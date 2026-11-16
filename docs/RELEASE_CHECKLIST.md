# M7C final public release checklist

## Verified in the existing Windows working project (user-reported logs)

- [x] Python Qiskit/Aer test suite: **20 passed, 1 intentionally skipped**.
- [x] Release-source hygiene scan: passed for local working tree.
- [x] Website `npm install` and `npm ci` succeeded.
- [x] `verify:data` passed and `verify:ui` passed **9/9**.
- [x] Frontend `tsc -b && vite build` passed.
- [x] `web/package-lock.json` created locally (user reported **61,778 bytes**).

## Still required before public release

- [ ] Extract this candidate to a separate `QuantumOptLab-Public` directory.
- [ ] Copy **the exact original `web/package-lock.json`** from the verified local working folder. Do not regenerate from guessed versions.
- [ ] Verify Python 3.12 fresh virtual environment, Qiskit/Aer tests, circuit exporter, and npm `ci` + frontend build **in the candidate**, not just the working folder.
- [ ] Manually inspect source code, notebook source, images, and Git staging diff for sensitive data and local paths.
- [ ] Choose a license intentionally, or explicitly publish without one (not open source by default); strict audit currently requires LICENSE.
- [ ] Capture genuine screenshots for the README / portfolio page.
- [ ] Initialize Git, review staged content, push to an authorized GitHub repository, and confirm both CI jobs green.

## Scientific integrity

Keep the one-time locked-test evaluation frozen. The Random Forest **underperformed the gate-budget and noise lookup rules** on the locked test. No quantum hardware run or quantum computational advantage is claimed.

This release ZIP does not contain private checkpoints or execution outputs. Its scientific-results tables reflect prior locally executed notebooks, not newly rerun full benchmark experiments.
