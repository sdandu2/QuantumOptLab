# QuantumOptLab

**Noise-aware quantum optimization using Qiskit, from correct Max-Cut
circuits to measured synthetic-noise and compiler-resource tradeoffs.**

QuantumOptLab studies whether deeper Quantum Approximate Optimization
Algorithm (QAOA) circuits provide better optimization outcomes under noise,
and whether a simple adaptive depth-selection rule can avoid unnecessary CX
gates. It includes standalone Jupyter research notebooks and a
React/TypeScript visual research atlas.

> **Key research finding:** Ideal depth-2 QAOA often improves expected
> Max-Cut quality, but its advantage decreases under stronger synthetic CX
> noise. On 20 held-out graphs, a trained Random Forest depth selector did
> **not** outperform two simple noise-aware decision rules. No quantum
> computational advantage or physical QPU result is claimed.

## Research in numbers

| Measure | Scope |
|---|---|
| 80 graphs | 40 train, 20 development validation, 20 one-time locked test |
| 720 locked-test Aer executions | Phase 6A, Qiskit Aer under synthetic noise |
| 240 compiler configurations | Phase 6B: 3 topologies × 2 transpilation levels × 2 depths × 20 graphs |
| Approx. ratio advantage at 0% CX noise | +8.54 percentage points (validation mean, p2 − p1) |
| Approx. ratio advantage at 10% CX noise | −1.05 percentage points (95% CI includes zero) |
| Final learned selector utility | 0.70511 versus 0.71814 for the gate-budget rule |

See [full results](docs/RESULTS.md) and [methodology](docs/METHODS.md).

## Quick start (Windows / Python 3.12)

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[research,dev]"
python -m pytest -q
python -m quantumoptlab
python .\web\scripts\export_qiskit_circuits.py
cd web
npm ci
npm run dev
```

Open the Vite URL (typically `http://127.0.0.1:5173/`). This website
visualizes precomputed experiments and can display symbolic Qiskit-generated
circuits; it does not submit jobs to IBM Quantum hardware.

Run `npm run build` within `web/` for the frontend production check.

## Repository map

- `notebooks/` — source-only research notebooks 01–06B, in execution order.
- `src/quantumoptlab/` — tested reference Max-Cut and QAOA circuit utilities.
- `tests/` — mathematical, simulator, compilation, and source-integrity checks.
- `web/` — interactive QAOA atlas and Qiskit circuit exporter.
- `docs/` — results, research methodology, artifact provenance, and release gates.
- `.github/workflows/ci.yml` — automated Python + frontend verification.

See [architecture](docs/ARCHITECTURE.md), [reproduction](docs/REPRODUCIBILITY.md),
and [release checklist](docs/RELEASE_CHECKLIST.md).

## Known limitations

Noise and topologies are synthetic. Classical exact methods and heuristics
remain competitive or superior on the small benchmarks used. The QAOA depth
selector was trained on limited graph families and failed to generalize
better than simple rules on the locked test. Experimental outputs and private
checkpoints are deliberately not packaged in the public source copy; the
source files and a hash manifest document their provenance.

## Status

**M7C public release candidate**, not yet a verified GitHub release. The original working project passed 20 Python tests, the website data/UI checks, and the Vite build on Windows. The isolated candidate must still import the author-generated npm lockfile, pass fresh-install verification, undergo license and security review, and obtain green GitHub Actions checks after publication. See `docs/RELEASE_CHECKLIST.md`.

**License:** No public license has been selected by the author. Choose an
explicit license before offering reuse rights; a public GitHub repository
without a license is not automatically open source.
