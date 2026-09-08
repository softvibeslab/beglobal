#!/usr/bin/env python3
"""Create a new, offline Hermes profile. Never replace or start an existing one."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

REPO = Path(__file__).resolve().parents[1]

def prepare(destination, interpreter):
    destination = Path(destination).absolute()
    if destination.exists() or destination.is_symlink():
        raise ValueError('El destino ya existe; no se sobrescribe ningún perfil.')
    # Preserve a virtualenv's executable path: resolving its symlink loses the env.
    interpreter = Path(interpreter).absolute()
    if not interpreter.is_file():
        raise ValueError('No se encontró el intérprete de Hermes.')
    # Validate the private corpus and dependencies before creating any profile.
    from beglobal_academy_knowledge import Knowledge
    knowledge = Knowledge()
    for row in knowledge.rows.values():
        if row['has_transcript']:
            knowledge.evidence(row['node_id'])
    subprocess.run([str(interpreter), '-c', 'import mcp.server.fastmcp; import yaml'], check=True)
    config = json.loads((REPO/'hermes/beglobal-premium-web/config.template.json').read_text())
    server = config['mcp_servers']['beglobal_academy']
    server['command'] = str(interpreter)
    server['args'][0] = str(REPO/'scripts/beglobal_academy_knowledge.py')
    destination.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix='.premium-web-', dir=destination.parent))
    try:
        # JSON is valid YAML; no machine-specific paths remain in the template.
        (stage/'config.yaml').write_text(json.dumps(config, ensure_ascii=False, indent=2)+'\n')
        for name in ('SOUL.md', 'profile.yaml'):
            shutil.copyfile(REPO/'hermes/beglobal-premium-web'/name, stage/name)
        for directory in ('workspace', 'skills', 'memories'):
            (stage/directory).mkdir(mode=0o700)
        # Supported by the installed Hermes profile loader; validate on the VPS.
        (stage/'.no-bundled-skills').touch()
        for file in stage.iterdir():
            if file.is_file(): file.chmod(0o600)
        # Atomic directory reservation: fail if another operator created it.
        destination.mkdir(mode=0o700)
        for file in stage.iterdir(): shutil.move(str(file), destination/file.name)
    finally:
        shutil.rmtree(stage)
    return {'profile': str(destination), 'started': False, 'knowledge': knowledge.status()}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, required=True)
    parser.add_argument('--python', type=Path, required=True, help='Python del entorno Hermes con MCP instalado')
    args = parser.parse_args()
    print(json.dumps(prepare(args.destination, args.python), ensure_ascii=False, indent=2))
