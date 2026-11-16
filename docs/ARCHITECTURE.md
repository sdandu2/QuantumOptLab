# Architecture

```text
Qiskit notebooks (source-only in public repo)
    │    Phase 1–3: quantum gates, QAOA, noise
    ├── Phase 4: 80 generated graphs; 40 training / 20 validation / 20 locked test
    ├── Phase 5: selector trained on development data
    └── Phase 6A: one-time locked test; Phase 6B: synthetic topology compilation
        │
        └── Frozen, audited research snapshot (web/src/data.ts)
                    │
                    └── React/Vite site (precomputed views; no live QPU)

src/quantumoptlab/ – independent reference Max-Cut/QAOA circuit utilities
  └── pytest tests + python -m quantumoptlab

web/scripts/export_qiskit_circuits.py – symbolic Qiskit -> text/SVG drawings
.github/workflows/ci.yml – Python 3.12 and Node 22 release checks
```

The research notebooks remain historical, self-contained experiments. The
reference package supports testing and reuse, not retroactive modification of
frozen experiment values.

The frozen Random Forest **did not** beat the simple gate-budget policy on the
locked test. Do not retrain it on test examples or label the frontend a live
quantum simulator.
