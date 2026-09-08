#!/usr/bin/env python3
"""Install reviewed static branding into the existing chat service; no secrets or model changes."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ASSETS = ('branding.css', 'theme.js', 'logo-beglobal.png')
ANCHOR = '  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],'
ROUTES = '\n'.join([
    '  ["/branding.css", ["branding.css", "text/css; charset=utf-8"]],',
    '  ["/theme.js", ["theme.js", "text/javascript; charset=utf-8"]],',
    '  ["/logo-beglobal.png", ["logo-beglobal.png", "image/png"]],',
])

def patch_server(source):
    if source.count(ANCHOR) != 1 or any(f'"/{name}"' in source for name in ASSETS):
        raise ValueError('La lista de rutas cambió o ya contiene el branding; revisar antes de instalar.')
    return source.replace(ANCHOR, ANCHOR + '\n' + ROUTES)

def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()

def deploy(app, release, expected_server, expected_index, node):
    app, release = Path(app).resolve(), Path(release).resolve()
    public = app/'public'
    server, index = app/'server.js', public/'index.html'
    if sha(server) != expected_server or sha(index) != expected_index:
        raise ValueError('El servidor o index cambió desde la revisión; no se sobrescribe.')
    for name in ASSETS:
        if (public/name).exists() or (public/name).is_symlink():
            raise ValueError(f'Ya existe el asset {name}; requiere revisión de actualización.')
    manifest = json.loads((release/'manifest.json').read_text())
    for name in ('index.html', *ASSETS):
        if sha(release/name) != manifest[name]:
            raise ValueError(f'Checksum incorrecto: {name}')
    unchanged = {name: sha(public/name) for name in ('app.js','styles.css')}
    with tempfile.TemporaryDirectory(prefix='.chat-branding-stage-', dir=app.parent) as folder:
        staged = Path(folder)/'server.js'
        staged.write_text(patch_server(server.read_text()))
        subprocess.run([node,'--check',str(staged)], check=True)
        subprocess.run([node,'--check',str(release/'theme.js')], check=True)
        backup = Path(tempfile.mkdtemp(prefix='.chat-branding-backup-', dir=app.parent))
        originals = {'server.js': server, 'index.html': index}
        for name, file in originals.items():
            shutil.copy2(file,backup/name)
            if sha(file) != sha(backup/name): raise ValueError('Falló la verificación del respaldo.')
        (backup/'checksums.json').write_text(json.dumps({**unchanged,'server.js':expected_server,'index.html':expected_index},indent=2))
        def publish(source, target, owner):
            stat = owner.stat()
            fd, temporary = tempfile.mkstemp(prefix='.branding-',dir=target.parent)
            try:
                with os.fdopen(fd,'wb') as out: out.write(source.read_bytes())
                os.chmod(temporary,0o644)
                if os.geteuid()==0: os.chown(temporary,stat.st_uid,stat.st_gid)
                os.replace(temporary,target)
            finally:
                Path(temporary).unlink(missing_ok=True)
        try:
            for name in ASSETS: publish(release/name, public/name, index)
            publish(staged,server,server)
            publish(release/'index.html',index,index)
            if any(sha(public/name)!=digest for name,digest in unchanged.items()):
                raise ValueError('Los assets originales cambiaron durante el despliegue.')
        except BaseException:
            for name,file in originals.items(): publish(backup/name,file,file)
            for name in ASSETS: (public/name).unlink(missing_ok=True)
            raise
    return {'backup':str(backup),'installed':True,'service_restarted':False,'app_js_unchanged':True,'styles_css_unchanged':True}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--app',required=True)
    parser.add_argument('--release',required=True)
    parser.add_argument('--expected-server',required=True)
    parser.add_argument('--expected-index',required=True)
    parser.add_argument('--node',default='node')
    args=parser.parse_args()
    print(json.dumps(deploy(args.app,args.release,args.expected_server,args.expected_index,args.node),indent=2))
