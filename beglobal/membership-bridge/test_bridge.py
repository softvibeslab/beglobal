"""Synthetic conformance checks only; no platform calls or real member data."""
import asyncio
import dataclasses
import json
import unittest

from bridge import MembershipBridge, MembershipSnapshot, ProviderNotConfigured

NOW = 1_800_000_000


class Mapping:
    def __init__(self):
        self.links = {"person_a": "external_a", "person_b": "external_b"}

    async def external_member_for(self, person_id):
        return self.links.get(person_id)


class FixtureProvider:
    release_status = "fixture"

    def __init__(self):
        self.calls = []
        self.snapshots = {key: MembershipSnapshot(key, "active", NOW, NOW - 100, NOW + 3600, "test-v1")
                          for key in ("external_a", "external_b")}
        self.error = None
        self.delay = False

    async def fetch_membership(self, external_member_id):
        self.calls.append(external_member_id)
        if self.delay:
            await asyncio.Event().wait()
        if self.error:
            raise self.error
        return self.snapshots[external_member_id]


class Tests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.mapping = Mapping()
        self.provider = FixtureProvider()
        self.bridge = MembershipBridge(self.mapping, self.provider, environment="test", clock=lambda: NOW)

    def change(self, **kwargs):
        self.provider.snapshots["external_a"] = dataclasses.replace(self.provider.snapshots["external_a"], **kwargs)

    async def test_unconfigured_is_disabled_by_default(self):
        result = await MembershipBridge(self.mapping, clock=lambda: NOW).check("person_a")
        self.assertFalse(result.can_read_pro)
        self.assertEqual(result.reason, "PROVIDER_NOT_CONFIGURED")

    async def test_fixture_rejected_in_production_and_staging(self):
        for environment in ("staging", "production"):
            result = await MembershipBridge(self.mapping, self.provider, environment=environment, clock=lambda: NOW).check("person_a")
            self.assertEqual(result.reason, "PROVIDER_NOT_APPROVED")
        self.assertEqual(self.provider.calls, [])

    async def test_unknown_release_denied(self):
        self.provider.release_status = "available_because_user_says_so"
        self.assertFalse((await self.bridge.check("person_a")).can_read_pro)

    async def test_active_returns_bounded_decision(self):
        result = await self.bridge.check("person_a")
        self.assertTrue(result.can_read_pro)
        self.assertEqual(result.valid_until, NOW + 300)
        self.assertNotIn("plan", result.to_dict())

    async def test_membership_expiry_caps_decision(self):
        self.change(valid_until=NOW + 10)
        self.assertEqual((await self.bridge.check("person_a")).valid_until, NOW + 10)

    async def test_snapshot_expiry_caps_decision(self):
        self.change(observed_at=NOW - 290)
        self.assertEqual((await self.bridge.check("person_a")).valid_until, NOW + 10)

    async def test_negative_statuses_fail_closed(self):
        for status in ("expired", "suspended", "revoked", "unknown"):
            self.change(status=status)
            self.assertFalse((await self.bridge.check("person_a")).can_read_pro)

    async def test_unknown_status_not_coerced(self):
        self.change(status="paid")
        self.assertEqual((await self.bridge.check("person_a")).reason, "INVALID_STATUS")

    async def test_missing_identity_mapping_does_not_query_provider(self):
        self.assertEqual((await self.bridge.check("person_c")).reason, "MEMBER_LINK_REQUIRED")
        self.assertEqual(self.provider.calls, [])

    async def test_cross_member_snapshot_rejected(self):
        self.change(external_member_id="external_b")
        self.assertEqual((await self.bridge.check("person_a")).reason, "MEMBER_MISMATCH")

    async def test_subject_cannot_supply_external_member_id(self):
        self.assertFalse((await self.bridge.check("external_a")).can_read_pro)
        self.assertFalse((await self.bridge.check({"personId": "person_a"})).can_read_pro)

    async def test_stale_and_future_snapshots(self):
        for value, reason in [(NOW - 300, "STALE_SNAPSHOT"), (NOW + 31, "FUTURE_OBSERVATION")]:
            self.change(observed_at=value)
            self.assertEqual((await self.bridge.check("person_a")).reason, reason)

    async def test_invalid_observation_types(self):
        for value in (True, "1800000000", 0, 1.8):
            self.change(observed_at=value)
            self.assertFalse((await self.bridge.check("person_a")).can_read_pro)

    async def test_invalid_validity(self):
        for start, end in [(None, NOW + 5), (NOW - 1, None), (True, NOW + 5), (NOW, NOW), (-1, NOW + 5)]:
            self.change(valid_from=start, valid_until=end)
            self.assertFalse((await self.bridge.check("person_a")).can_read_pro)

    async def test_not_started_and_expired(self):
        self.change(valid_from=NOW + 1, valid_until=NOW + 10)
        self.assertEqual((await self.bridge.check("person_a")).reason, "MEMBERSHIP_NOT_STARTED")
        self.change(valid_from=NOW - 100, valid_until=NOW)
        self.assertEqual((await self.bridge.check("person_a")).membership_status, "expired")

    async def test_invalid_payload_and_version(self):
        self.change(source_version="")
        self.assertFalse((await self.bridge.check("person_a")).can_read_pro)
        self.provider.snapshots["external_a"] = {"status": "active"}
        self.assertEqual((await self.bridge.check("person_a")).reason, "INVALID_SNAPSHOT")

    async def test_provider_exception_is_sanitized(self):
        self.provider.error = RuntimeError("DO_NOT_EXPOSE_TEST_SECRET")
        result = await self.bridge.check("person_a")
        self.assertEqual(result.reason, "PROVIDER_UNAVAILABLE")
        self.assertNotIn("DO_NOT_EXPOSE", json.dumps(result.to_dict()))

    async def test_provider_not_configured_exception(self):
        self.provider.error = ProviderNotConfigured()
        self.assertEqual((await self.bridge.check("person_a")).reason, "PROVIDER_NOT_CONFIGURED")

    async def test_provider_timeout_fails_closed(self):
        self.provider.delay = True
        bridge = MembershipBridge(self.mapping, self.provider, environment="test", timeout_seconds=.01, clock=lambda: NOW)
        self.assertEqual((await bridge.check("person_a")).reason, "PROVIDER_TIMEOUT")

    async def test_no_positive_cache_after_revocation_or_outage(self):
        self.assertTrue((await self.bridge.check("person_a")).can_read_pro)
        self.change(status="revoked")
        self.assertFalse((await self.bridge.check("person_a")).can_read_pro)
        self.provider.error = OSError("down")
        self.assertFalse((await self.bridge.check("person_a")).can_read_pro)

    async def test_concurrent_members_do_not_share_results(self):
        self.provider.snapshots["external_b"] = dataclasses.replace(self.provider.snapshots["external_b"], status="suspended")
        results = await asyncio.gather(self.bridge.check("person_a"), self.bridge.check("person_b"))
        self.assertEqual([r.can_read_pro for r in results], [True, False])

    async def test_invalid_config_rejected(self):
        for kwargs in ({"environment": "prod-typo"}, {"max_snapshot_age": 301}, {"max_snapshot_age": True}, {"future_skew": 31}, {"timeout_seconds": 0}):
            with self.assertRaises(ValueError):
                MembershipBridge(self.mapping, **kwargs)


if __name__ == "__main__":
    unittest.main(verbosity=2)
