"""CLI de Áureo.

Uso:
  python3 -m aureo.cli split 13
  python3 -m aureo.cli session 13
  python3 -m aureo.cli size 6.5
  python3 -m aureo.cli reminders
  python3 -m aureo.cli levels 8
  python3 -m aureo.cli budget 40 4
  python3 -m aureo.cli search 100 500      # imprime las dos sondas del ciclo 1
"""
from __future__ import annotations

import json
import sys

from . import (
    GoldenSearchState,
    golden_split_int,
    ingestion_budget,
    level_curve,
    reminder_schedule,
    session_split,
    to_fib_size,
)


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv:
        print(__doc__)
        return 1
    cmd, args = argv[0], argv[1:]
    if cmd == "split":
        print(json.dumps(golden_split_int(int(args[0]))))
    elif cmd == "session":
        print(json.dumps(session_split(int(args[0]))))
    elif cmd == "size":
        print(to_fib_size(float(args[0])))
    elif cmd == "reminders":
        print(json.dumps(reminder_schedule()))
    elif cmd == "levels":
        print(json.dumps(level_curve(int(args[0])), indent=2))
    elif cmd == "budget":
        print(json.dumps(ingestion_budget(int(args[0]), int(args[1])), ensure_ascii=False))
    elif cmd == "search":
        st = GoldenSearchState(float(args[0]), float(args[1]))
        x1, x2 = st.next_probes()
        print(json.dumps({"probar": [round(x1, 1), round(x2, 1)], "intervalo": [st.lo, st.hi]}))
    else:
        print(__doc__)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
