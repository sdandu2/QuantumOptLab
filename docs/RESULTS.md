# Frozen research findings (not new M7B experiments)

These values were recorded in the user's executed notebooks and curated into
`web/src/data.ts`. They are not recomputed by this packaging step.

## Development-validation: average p=2 advantage under CX-only noise

| CX depolarizing parameter | p2 − p1 ratio (percentage points) | 95% graph-bootstrap interval | Validation graphs preferring p2 |
|---:|---:|---|---:|
| 0% | +8.54 | [+5.61, +11.86] | 100% |
| 2% | +4.25 | [+1.73, +6.98] | 65% |
| 5% | +1.00 | [−0.87, +3.14] | 50% |
| 10% | −1.05 | [−2.41, +0.38] | 25% |

## One-time locked-test comparison (20 held-out graphs)

Utility = approximation ratio − 0.0005 × mean compiled CX gates. Mean figures:

| Policy | Utility ↑ | Approximation ratio ↑ | Mean CX gates ↓ |
|---|---:|---:|---:|
| Oracle (non-deployable) | 0.72904 | 0.75017 | 42.25 |
| Gate-budget rule | **0.71814** | 0.73832 | 40.35 |
| Noise lookup | 0.71809 | 0.73811 | 40.05 |
| Always p=1 | 0.70870 | 0.72355 | 29.70 |
| Frozen Random Forest | 0.70511 | 0.72614 | 42.07 |
| Always p=2 | 0.69939 | 0.72909 | 59.40 |

Random Forest vs gate-budget: utility difference −0.01303, paired graph-level
95% bootstrap interval [−0.02412, −0.00415]. This is evidence **against**
the learned selector beating the simple rule in this experiment.

## Compiler routing cost: mean CX gates at p=2, optimization level 2

| Synthetic connectivity | Mean CX gates |
|---|---:|
| All-to-all | 54.40 |
| Ring | 103.45 |
| Line | 121.55 |

For more context, open `docs/METHODS.md` and `web/PROVENANCE.md`.

**Not claimed:** real QPU results, validated physical error rates, quantum
computational advantage, or general superior performance of ML selection.
