"""Membership boundary. No network credentials, platform assumptions or plan grants.

The caller must authenticate the person before invoking this library. Production
needs a reviewed provider adapter and authoritative identity mapping. There is no
positive cache; callers must respect decision.valid_until and revocations.
"""
from __future__ import annotations

import asyncio
import re
import time
from dataclasses import asdict, dataclass
from typing import Callable, Protocol


STATUSES = frozenset({"unknown", "active", "expired", "suspended", "revoked"})
ENVIRONMENTS = frozenset({"development", "test", "staging", "production"})


class ProviderNotConfigured(Exception):
    pass


@dataclass(frozen=True)
class MembershipSnapshot:
    external_member_id: str
    status: str
    observed_at: int
    valid_from: int | None
    valid_until: int | None
    source_version: str


@dataclass(frozen=True)
class MembershipDecision:
    membership_status: str
    verification_status: str
    can_read_pro: bool
    reason: str
    checked_at: int
    valid_until: int | None = None
    source: str = "beglobal_platform"

    def to_dict(self) -> dict:
        return asdict(self)


class IdentityMapping(Protocol):
    async def external_member_for(self, person_id: str) -> str | None:
        """Resolve a server-verified link. Never accept a member ID from chat."""
        ...


class MembershipProvider(Protocol):
    release_status: str

    async def fetch_membership(self, external_member_id: str) -> MembershipSnapshot:
        """Nonblocking I/O; normalize verified platform data, not user claims.

        Adapter owns TLS/auth, status/date mapping, retries and source freshness.
        It must not return a stale 'active' value after a known newer revocation.
        Release status production_verified is controlled by deployment review,
        never by an HTTP request or model parameter.
        """
        ...


class UnconfiguredProvider:
    release_status = "disabled"

    async def fetch_membership(self, external_member_id: str) -> MembershipSnapshot:
        raise ProviderNotConfigured("Platform adapter pending")


def _integer(value: object) -> bool:
    return type(value) is int


def _valid_reference(value: object) -> bool:
    return isinstance(value, str) and 0 < len(value) <= 256 and not any(ord(c) < 32 for c in value)


class MembershipBridge:
    """Fail-closed, transport-independent async check, disabled by default.

    This returns academic entitlement only. A true result is necessary but not
    sufficient for resource access: the API still checks subject/business/object,
    plan, role, scopes, budget and action approvals.
    """

    def __init__(self, mapping: IdentityMapping, provider: MembershipProvider | None = None,
                 *, environment: str = "development", timeout_seconds: float = 3.0,
                 max_snapshot_age: int = 300, future_skew: int = 30,
                 clock: Callable[[], float] = time.time):
        if environment not in ENVIRONMENTS:
            raise ValueError("Unsupported environment")
        if isinstance(timeout_seconds, bool) or not 0 < timeout_seconds <= 30:
            raise ValueError("Timeout must be > 0 and <= 30 seconds")
        if not _integer(max_snapshot_age) or not 1 <= max_snapshot_age <= 300:
            raise ValueError("Snapshot lifetime must be 1..300 seconds")
        if not _integer(future_skew) or not 0 <= future_skew <= 30:
            raise ValueError("Future skew must be 0..30 seconds")
        self.mapping = mapping
        self.provider = provider if provider is not None else UnconfiguredProvider()
        self.environment = environment
        self.timeout = timeout_seconds
        self.max_age = max_snapshot_age
        self.future_skew = future_skew
        self.clock = clock

    def _deny(self, reason: str, *, membership: str = "unknown",
              verification: str = "unavailable") -> MembershipDecision:
        return MembershipDecision(membership, verification, False, reason, int(self.clock()))

    async def check(self, person_id: str) -> MembershipDecision:
        if not isinstance(person_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", person_id):
            return self._deny("INVALID_SUBJECT", verification="invalid")
        release = getattr(self.provider, "release_status", "disabled")
        if release == "disabled":
            return self._deny("PROVIDER_NOT_CONFIGURED")
        allowed_releases = {"production_verified"} if self.environment in {"production", "staging"} else {"fixture", "production_verified", "development"}
        if release not in allowed_releases:
            return self._deny("PROVIDER_NOT_APPROVED")
        try:
            return await asyncio.wait_for(self._resolve_and_check(person_id), timeout=self.timeout)
        except asyncio.TimeoutError:
            return self._deny("PROVIDER_TIMEOUT")
        except ProviderNotConfigured:
            return self._deny("PROVIDER_NOT_CONFIGURED")
        except Exception:
            # Deliberately do not expose upstream exception strings or credentials.
            return self._deny("PROVIDER_UNAVAILABLE")

    async def _resolve_and_check(self, person_id: str) -> MembershipDecision:
        external_id = await self.mapping.external_member_for(person_id)
        if external_id is None:
            return self._deny("MEMBER_LINK_REQUIRED", verification="unmapped")
        if not _valid_reference(external_id):
            return self._deny("INVALID_MEMBER_LINK", verification="invalid")
        snapshot = await self.provider.fetch_membership(external_id)
        now = int(self.clock())
        if not isinstance(snapshot, MembershipSnapshot):
            return self._deny("INVALID_SNAPSHOT", verification="invalid")
        if snapshot.external_member_id != external_id:
            return self._deny("MEMBER_MISMATCH", verification="invalid")
        if not isinstance(snapshot.status, str) or snapshot.status not in STATUSES:
            return self._deny("INVALID_STATUS", verification="invalid")
        if not _valid_reference(snapshot.source_version):
            return self._deny("INVALID_SOURCE_VERSION", verification="invalid")
        if not _integer(snapshot.observed_at) or snapshot.observed_at <= 0:
            return self._deny("INVALID_OBSERVATION", verification="invalid")
        if snapshot.observed_at > now + self.future_skew:
            return self._deny("FUTURE_OBSERVATION", verification="invalid")
        if snapshot.observed_at + self.max_age <= now:
            return self._deny("STALE_SNAPSHOT", verification="stale")
        if snapshot.status != "active":
            return self._deny("MEMBERSHIP_" + snapshot.status.upper(), membership=snapshot.status,
                              verification="unknown" if snapshot.status == "unknown" else "verified")
        if not _integer(snapshot.valid_from) or not _integer(snapshot.valid_until):
            return self._deny("INVALID_VALIDITY", verification="invalid")
        if snapshot.valid_from < 0 or snapshot.valid_until <= snapshot.valid_from:
            return self._deny("INVALID_VALIDITY", verification="invalid")
        if snapshot.valid_from > now:
            return self._deny("MEMBERSHIP_NOT_STARTED", verification="verified")
        if snapshot.valid_until <= now:
            return self._deny("MEMBERSHIP_EXPIRED", membership="expired", verification="verified")
        decision_expiry = min(snapshot.valid_until, snapshot.observed_at + self.max_age, now + self.max_age)
        return MembershipDecision("active", "verified", True, "ACADEMIC_MEMBERSHIP_ACTIVE", now, decision_expiry)
