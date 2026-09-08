#!/usr/bin/env python3
"""Build an exclusive private transfer archive, never inside the public repository."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import tarfile
from beglobal_academy_knowledge import REPO, ROOT, Knowledge

def package(output):
    output = Path(output).absolute()
    if output.resolve().is_relative_to(REPO):
        raise ValueError('Guarda el paquete privado fuera del repositorio público.')
    knowledge = Knowledge()
    files = {ROOT/'scope.json', ROOT/'lesson-reference-index.json', ROOT/'graphify-out/graph.json'}
    for row in knowledge.rows.values():
        if row['has_transcript']:
            knowledge.evidence(row['node_id'])  # Verify preserved hash and allowed source.
            files.add(REPO/row['content_source'])
    fd = os.open(output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(fd, 'wb') as stream, tarfile.open(fileobj=stream, mode='w:gz') as archive:
            for source in sorted(files):
                if source.is_symlink() or not source.resolve().is_relative_to(REPO):
                    raise ValueError('Fuente fuera del repositorio o enlace simbólico.')
                archive.add(source, arcname=str(source.relative_to(REPO)), recursive=False)
    except BaseException:
        output.unlink(missing_ok=True)
        raise
    return {'archive': str(output), 'files': len(files), 'sha256': hashlib.sha256(output.read_bytes()).hexdigest(), 'private': True}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    print(json.dumps(package(parser.parse_args().output), indent=2))
