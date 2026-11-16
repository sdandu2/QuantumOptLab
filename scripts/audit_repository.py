"""Release hygiene audit for tracked files; never modifies user research data.

Usage: python scripts/audit_repository.py
       python scripts/audit_repository.py --strict
Strict additionally requires npm lockfile and an explicit user-selected license;
those are M7C gates, not claims completed in M7B.
"""
from __future__ import annotations
import argparse, os, re, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BLOCKED=['.venv/','venv/','web/node_modules/','web/dist/','reports/','data/','external/','models/','checkpoints/']

# These are exported, public-facing Qiskit circuit figures used by the website.
# Whitelist only the exact generated filenames; reject any other tracked content
# inside the directory so the audit still catches accidentally committed files.
CIRCUIT_DIR='web/public/circuits/'
ALLOWED_CIRCUIT_FILES={CIRCUIT_DIR+'manifest.json'} | {
    CIRCUIT_DIR+f'{graph}_p{depth}.{extension}'
    for graph in ('cycle_4','weighted_5','weighted_6')
    for depth in (1,2)
    for extension in ('svg','txt')
}

SECRET_PATTERNS=[
    re.compile(r'-----BEGIN (?:OPENSSH |RSA |EC )?PRIVATE KEY-----',re.I),
    re.compile(r'(?i)\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*[\x22\x27][A-Za-z0-9_\-]{18,}[\x22\x27]')
]

def staged_paths():
    result=subprocess.run(['git','ls-files','-z'],cwd=ROOT,capture_output=True)
    if result.returncode!=0:
        # In a standalone ZIP, audit the curated source tree, not the user's
        # existing ignored venv/report directories.
        selected=['README.md','pyproject.toml','requirements-research.txt','.gitignore','.gitattributes','.editorconfig']
        for d in ['docs','src','tests','scripts','.github','notebooks','web']:
            p=ROOT/d
            if p.is_dir():
                for f in p.rglob('*'):
                    if f.is_file() and not any(part in {'node_modules','dist','__pycache__','.vite','circuits'} for part in f.relative_to(ROOT).parts):
                        selected.append(f.relative_to(ROOT).as_posix())
        return sorted(set(selected))
    return [x.decode('utf8') for x in result.stdout.split(b'\0') if x]


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--strict',action='store_true');args=parser.parse_args()
    errors=[];paths=staged_paths()
    for name in paths:
        norm=name.replace('\\','/');rel=ROOT/norm
        if any(norm.startswith(p) for p in BLOCKED):errors.append(f'Blocked tracked path: {norm}')
        if norm.startswith(CIRCUIT_DIR) and norm not in ALLOWED_CIRCUIT_FILES:
            errors.append(f'Unexpected tracked Qiskit circuit asset: {norm}')
        if not rel.exists():continue
        if rel.stat().st_size>7_000_000:errors.append(f'Large file needs manual review: {norm}')
        if rel.suffix.lower() in {'.py','.ts','.tsx','.js','.mjs','.json','.md','.toml','.yml','.yaml','.env','.txt'}:
            try:src=rel.read_text('utf8')
            except UnicodeDecodeError:continue
            for p in SECRET_PATTERNS:
                if p.search(src):errors.append(f'Potential credential: {norm}')
    required=['README.md','pyproject.toml','.github/workflows/ci.yml','docs/RESULTS.md','notebooks/06a_frozen_selector_locked_test.ipynb','web/package.json']
    for name in required:
        if not (ROOT/name).exists():errors.append(f'Missing required release source: {name}')
    if args.strict:
        if not (ROOT/'web/package-lock.json').exists():errors.append('Missing web/package-lock.json; generate locally using npm install')
        if not (ROOT/'LICENSE').exists():errors.append('No author-selected LICENSE; choose one or document deliberate no-license release')
        for asset in sorted(ALLOWED_CIRCUIT_FILES):
            if asset not in paths or not (ROOT/asset).is_file():
                errors.append(f'Missing tracked Qiskit circuit asset: {asset}')
    print('Audited',len(paths),'candidate files')
    if errors:
        for error in errors:print('FAIL:',error)
        return 1
    print('PASS: release source hygiene'+(' (strict)' if args.strict else ''))
    return 0

if __name__=='__main__':sys.exit(main())
