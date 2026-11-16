"""One-way checksum inventory of PRIVATE executed outputs, never tracked by Git.

Run on your original research project (not an already-clean public copy).
Existing manifests will NOT be overwritten.
"""
from pathlib import Path
import hashlib,json,datetime

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'reports'/'release-manifests'/'local_frozen_artifact_hashes.json'

def main():
    if DEST.exists():raise SystemExit('Manifest already exists; refusing to replace an existing freeze')
    inputs=list((ROOT/'notebooks').glob('*.ipynb'))
    if (ROOT/'reports').exists():
        inputs += [p for p in (ROOT/'reports').rglob('*') if p.is_file() and p!=DEST]
    records=[]
    for p in sorted(set(inputs)):
        digest=hashlib.sha256()
        with p.open('rb') as f:
            for block in iter(lambda:f.read(1024*1024),b''):digest.update(block)
        records.append({'path':p.relative_to(ROOT).as_posix(),'sha256':digest.hexdigest(),'bytes':p.stat().st_size})
    DEST.parent.mkdir(parents=True,exist_ok=True)
    DEST.write_text(json.dumps({'created_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                'note':'Local archival hashes; do not commit reports', 'files':records},indent=2)+'\n','utf8')
    print(f'PASS: Froze hashes for {len(records)} private files in {DEST}')

if __name__=='__main__':main()
