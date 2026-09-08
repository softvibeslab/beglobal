#!/usr/bin/env python3
import importlib.util
import json
import sys
from pathlib import Path

builder = Path(__file__).resolve().parents[4] / "scripts" / "build_corporate_knowledge.py"
if not builder.exists():
    builder = Path("/root/beblogal/beglobal/scripts/build_corporate_knowledge.py")
spec = importlib.util.spec_from_file_location("build_corporate_knowledge", builder)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
question = " ".join(sys.argv[1:]).strip()
if not question:
    raise SystemExit("uso: query_graph.py <pregunta>")
results = module.query(Path(__file__).with_name("knowledge_graph.json"), question)
print(json.dumps(results, ensure_ascii=False, indent=2))
