"""Safely create output-free notebook copies without changing originals.

python scripts/prepare_public_notebooks.py --output public_release/notebooks
The generated directory is ignored by Git; copy its files into a separately
created public repository only after reviewing the manifest.
"""
from __future__ import annotations
import argparse, hashlib, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--output',default='public_release/notebooks');a=ap.parse_args()
    dest=(ROOT/a.output).resolve()
    if ROOT not in dest.parents:raise SystemExit('Output must be inside repository')
    if (ROOT/'notebooks').resolve()==dest:raise SystemExit('Refusing to overwrite notebooks folder')
    dest.mkdir(parents=True,exist_ok=True)
    manifest=[]
    for src in sorted((ROOT/'notebooks').glob('*.ipynb')):
        data=src.read_bytes();nb=json.loads(data)
        for c in nb['cells']:
            if c['cell_type']=='code':c['execution_count']=None;c['outputs']=[]
        nb.get('metadata',{}).pop('widgets',None)
        target=dest/src.name
        if target.exists():raise SystemExit(f'Refusing overwrite: {target}')
        target.write_text(json.dumps(nb,ensure_ascii=False,indent=1)+'\n','utf8')
        manifest.append({'file':src.name,'private_executed_sha256':hashlib.sha256(data).hexdigest(),
                         'public_source_sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
    dest.parent.mkdir(parents=True,exist_ok=True)
    mfile=dest.parent/'notebook_public_copy_manifest.json'
    if mfile.exists():raise SystemExit('Refusing to overwrite prior manifest')
    mfile.write_text(json.dumps(manifest,indent=2)+'\n','utf8')
    print(f'PASS: Created {len(manifest)} clean copies and provenance manifest in {dest.parent}')

if __name__=='__main__':main()
