import math
import sys
import unittest
from pathlib import Path

PKG_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PKG_DIR))
# Si se ejecuta desde la raíz del workspace, la carpeta externa `aureo/` se
# importa como paquete namespace y tapa al paquete real; se descarta.
_mod = sys.modules.get("aureo")
if _mod is not None and getattr(_mod, "__file__", None) is None:
    del sys.modules["aureo"]

import aureo as a  # noqa: E402


class TestAureo(unittest.TestCase):
    def test_phi(self):
        self.assertAlmostEqual(a.PHI, 1.6180339887, places=9)
        self.assertAlmostEqual(a.INV_PHI + a.MINOR, 1.0)

    def test_split(self):
        self.assertEqual(a.golden_split_int(13), (8, 5))
        self.assertEqual(a.golden_split_int(100), (62, 38))
        self.assertEqual(a.session_split(13), {"mision_min": 8, "leccion_min": 5})

    def test_context_budget(self):
        self.assertEqual(a.context_budget(1000), {"estado_miembro": 618, "conocimiento": 382})
        self.assertEqual(a.context_budget(1000, executing=True), {"conocimiento": 618, "estado_miembro": 382})

    def test_fibonacci(self):
        self.assertEqual(a.fibonacci(8), [1, 1, 2, 3, 5, 8, 13, 21])
        self.assertEqual(a.mission_spiral(6), [1, 1, 2, 3, 5, 8])

    def test_size(self):
        self.assertEqual(a.to_fib_size(6.5), 8)   # empate -> mayor
        self.assertEqual(a.to_fib_size(4), 5)     # 4 está a 1 de 3 y de 5 -> mayor
        self.assertEqual(a.to_fib_size(2.4), 2)
        self.assertTrue(a.needs_split(8))
        self.assertFalse(a.needs_split(5))

    def test_reminders(self):
        self.assertEqual(a.reminder_schedule(), [1, 2, 3, 5, 8, 13])

    def test_levels(self):
        rows = a.level_curve(7)
        self.assertEqual(rows[0], {"nivel": 2, "xp_nivel": 500, "xp_acumulado": 500})
        self.assertEqual(rows[-1]["xp_acumulado"], 500 * sum([1, 1, 2, 3, 5, 8, 13]))

    def test_branching(self):
        rep = a.branching_audit({"grande": 78, "sano": 8, "chico": 2})
        verdicts = {r.node: r.verdict for r in rep}
        self.assertEqual(verdicts, {"grande": "split", "sano": "ok", "chico": "merge"})
        self.assertEqual(rep[0].suggested_parts, math.ceil(78 / 8))

    def test_budget(self):
        b = a.ingestion_budget(40, 4)
        self.assertEqual((b["profundidad"], b["amplitud"], b["por_curso_foco"]), (25, 15, 6))

    def test_golden_search(self):
        f = lambda x: -(x - 300) ** 2  # máximo en 300
        x, w = a.golden_section_search(f, 100, 500, iterations=6)
        self.assertLess(abs(x - 300), 25)
        self.assertAlmostEqual(w / 400, a.INV_PHI ** 6, places=6)

    def test_response_rule(self):
        self.assertEqual(a.check_response(3, 2, 1), [])
        self.assertEqual(len(a.check_response(5, 3, 0)), 3)

    def test_word_ratio(self):
        r = a.word_ratio(62, 38)
        self.assertLess(r["desvio"], 0.01)


if __name__ == "__main__":
    unittest.main()
