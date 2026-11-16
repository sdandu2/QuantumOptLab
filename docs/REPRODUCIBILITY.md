# Reproducibility playbook

## Fast verification from a clean source checkout

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[research,dev]"
python -m pytest -q
python -m quantumoptlab
python .\scripts\audit_repository.py
python .\web\scripts\export_qiskit_circuits.py
cd web; npm install; npm run build; npm run dev
```

For a deterministic research *configuration*, seed 31 was used throughout
experiments; each notebook records its own expanded optimizer and simulator
seed settings. Qiskit and Aer versions are pinned in `pyproject.toml`.
**Other Python dependency versions and frontend packages are not yet fully
locked**. Generate `web/package-lock.json` locally using `npm install`,
review it, then commit it and switch CI to `npm ci` in M7C. A separately
reviewed Python freeze/lock is also needed for cross-machine byte-for-byte
reproduction; CI proves execution, not exact physical reproducibility.

## Re-running full research

Run notebooks in order 01, 02, 03, 04, 05, 06A, 06B with the Python kernel
selected from the installed virtual environment. `04` produces experiment
catalog and optimization checkpoints read by `05`; `06A` needs the frozen
`05` selector and manifests. Original `reports/` artifacts are intentionally
not included in this source package. The full end-to-end benchmark can
recreate them, but 06A should be considered a *reproduction* of an already
unlocked test, not an independent blind test.

Run the notebooks **only in a working copy**, never in the archival release
folder. For personal output snapshots, run:

```powershell
python .\scripts\freeze_local_manifest.py
```

This produces one SHA-256 inventory under ignored `reports/release-manifests/`
without overwriting a prior freeze. The originals should be kept privately.

## Public notebook handling

Public candidate notebooks here have their outputs and execution counts
stripped; Markdown explanations and source code are kept. The SHA-256 hashes
of user-provided executed originals are included in
`docs/NOTEBOOK_SOURCE_MANIFEST.json` as provenance checks, **not as proof
that every experiment is rerunnable without the private reports**.

To make fresh copies without altering executed notebooks:

```powershell
python .\scripts\prepare_public_notebooks.py
```

The exported `public_release/` folder is ignored; review it before using.

## Provenance and result interpretation

The website reads frozen metadata, not live QPU output. Check
`web/PROVENANCE.md` for notebook-to-view mappings, and run
`npm run verify:data` to test internal snapshot consistency.
