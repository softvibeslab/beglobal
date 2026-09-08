import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "build_corporate_knowledge.py"


def load_module():
    spec = importlib.util.spec_from_file_location("build_corporate_knowledge", MODULE_PATH)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class CorporateKnowledgeBuildTests(unittest.TestCase):
    def test_build_federates_project_and_youtube_graphs_with_canonical_sources(self):
        module = load_module()
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            result = module.build(ROOT, out)

            graph = json.loads((out / "knowledge_graph.json").read_text())
            catalog = json.loads((out / "source_catalog.json").read_text())

            self.assertGreater(result["nodes"], 700)
            self.assertGreater(result["edges"], 1800)
            self.assertTrue(any(n["id"].startswith("commerce:") for n in graph["nodes"]))
            self.assertTrue(any(n["id"].startswith("youtube:") for n in graph["nodes"]))
            self.assertTrue(any(n["id"].startswith("project:") for n in graph["nodes"]))

            paths = {entry["path"] for entry in catalog["sources"]}
            self.assertIn("beglobal/meetings/summary.md", paths)
            self.assertIn("hermes/beglobal-pro/workspace/be-global-commerce-os/kb/08_mvp_pilot_charter.md", paths)
            self.assertIn("hermes/beglobal-pro/skills/beglobal/beglobal-pro-guide/references/01_METODOLOGIA.md", paths)
            self.assertFalse(any("/.env" in path or "/logs/" in path or "state.db" in path for path in paths))

    def test_query_prioritizes_canonical_allan_pilot_sources(self):
        module = load_module()
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            module.build(ROOT, out)
            results = module.query(out / "knowledge_graph.json", "Allan piloto 30 45 días", limit=8)
            source_files = "\n".join(str(item.get("source_file", "")) for item in results)
            self.assertIn("08_mvp_pilot_charter.md", source_files)
            self.assertTrue(any("Allan" in item.get("label", "") for item in results))

    def test_build_is_deterministic_except_generated_timestamp(self):
        module = load_module()
        with tempfile.TemporaryDirectory() as first, tempfile.TemporaryDirectory() as second:
            module.build(ROOT, Path(first))
            module.build(ROOT, Path(second))
            a = json.loads((Path(first) / "knowledge_graph.json").read_text())
            b = json.loads((Path(second) / "knowledge_graph.json").read_text())
            a["metadata"].pop("generated_at", None)
            b["metadata"].pop("generated_at", None)
            self.assertEqual(a, b)


if __name__ == "__main__":
    unittest.main()
