# Run from a fresh public checkout on Windows 11 with Python 3.12 and Node installed.
# The repository includes web/package-lock.json; no private working copy is needed.
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$targetLock = Join-Path $repo 'web\package-lock.json'
if (-not (Test-Path -LiteralPath $targetLock)) { throw 'Missing web/package-lock.json in the public repository' }
$lockName = & node -p "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).name" $targetLock
if ($LASTEXITCODE -ne 0 -or [string]$lockName -ne 'quantumoptlab-web') { throw "Unexpected npm lockfile: $lockName" }
function Confirm-Exit([string]$step) { if ($LASTEXITCODE -ne 0) { throw "$step failed (exit $LASTEXITCODE)" } }
Push-Location $repo
try {
    py -3.12 -m venv .venv
    Confirm-Exit 'Create Python 3.12 environment'
    $python = Join-Path $repo '.venv\Scripts\python.exe'
    & $python -m pip install -e '.[research,dev]'
    Confirm-Exit 'Install research dependencies'
    $env:QUANTUMOPTLAB_PUBLIC_SOURCE = '1'
    & $python -m pytest -q
    Confirm-Exit 'Public-source tests'
    Remove-Item Env:QUANTUMOPTLAB_PUBLIC_SOURCE -ErrorAction SilentlyContinue
    & $python -m quantumoptlab
    Confirm-Exit 'Qiskit smoke test'
    & $python .\web\scripts\export_qiskit_circuits.py
    Confirm-Exit 'Qiskit circuit exporter'
    & $python .\scripts\audit_repository.py
    Confirm-Exit 'Repository hygiene scan'
    Push-Location (Join-Path $repo 'web')
    try {
        npm ci
        Confirm-Exit 'Clean npm install'
        npm run build
        Confirm-Exit 'Frontend production build'
    } finally { Pop-Location }
    Write-Host 'PASS: independent public checkout verification'
} finally {
    Remove-Item Env:QUANTUMOPTLAB_PUBLIC_SOURCE -ErrorAction SilentlyContinue
    Pop-Location
}
