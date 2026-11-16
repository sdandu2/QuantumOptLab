# M7A.1 — Design review → implemented improvements

| Design review finding | Implementation | Verification |
|---|---|---|
| False one-qubit `RZZ` boxes | Edge-resolved two-qubit SVG interactions with lines connecting both qubit wires; optional genuine Qiskit text drawings exported to SVG | `web/src/components/QAOACircuit.tsx`; `web/scripts/export_qiskit_circuits.py` |
| Max-Cut equation unclear | Accurate binary weighted-cut objective with glossary, crossing-edge explanation and score semantics | `web/src/pages/Explore.tsx` |
| Clicking a node appears to update QAOA | Explicit separate live classical and frozen-Qiskit cards, conspicuous provenance notes | `Explore.tsx` |
| CI shaded bands imply continuous evidence | Four observed points with individual 95% interval whiskers; dotted line is a guide only | `Benchmarks.tsx` |
| Truncated bar axis exaggerates policy differences | Zero-based dot plot, exact values, fixed-depth and oracle labels | `Benchmarks.tsx` |
| Hardware multiplier mixes optimization levels | Divide by all-to-all **at selected optimization level and QAOA depth** | `Hardware.tsx` |
| Topology diagrams are static | Choose a qubit pair and highlight shortest connectivity path (educational only, not a SWAP trace) | `Hardware.tsx` |
| Microtext, insufficient contrast, repetitive cards | Editorial typography, contrast upgrades, responsive refinements, more open mathematical/data sections | `refinements.css` |
| Overly promotional negative-result wording | Neutral language and retained negative locked-test finding | `Home.tsx`, `Methodology.tsx` |
| Scientific protocol hard to find | Dedicated 40/20/20 graph split visualization | `Methodology.tsx` |

## Remaining release checks

- Full `npm run build` and browser QA on Windows.
- Qiskit exporter execution and authentic drawing inspection using installed Qiskit 2.6.2.
- Responsive test at phone and tablet widths and keyboard-only navigation.
- Full M7B/M7C integration, CI, fresh-clone reproduction and dependency audit.
