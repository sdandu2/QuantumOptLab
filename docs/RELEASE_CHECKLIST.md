# QuantumOptLab release checklist

## Completed

- [x] Public repository and MIT license.
- [x] Fresh isolated candidate passed 21 Python tests, Qiskit smoke checks and circuit exports.
- [x] Source hygiene audit and manual Git staging inspection.
- [x] npm lockfile committed; npm ci, scientific data/UI verification and production build passed.
- [x] Initial GitHub Actions run: Qiskit/Python 3.12 and React/Node 22 both passed.

## Deployment follow-ups

- [ ] Enable Settings → Pages → Source: GitHub Actions.
- [ ] Verify the Pages workflow succeeds and open the deployed website.
- [ ] Check all five pages, circuit diagrams and mobile layout on the hosted site.
- [ ] Add actual screenshots to README and portfolio site.
- [ ] Optionally create a tagged GitHub Release.

## Scientific integrity

The frozen Random Forest selector underperformed simpler noise-aware rules on the one-time locked test.
No quantum advantage or real QPU execution is claimed. CI confirms source and implementation checks,
not a full rerun of the original private research outputs.
