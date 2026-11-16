# Data provenance and interpretation

This site is a **read-only interactive visualization of previously executed QuantumOptLab experiments**. Values are defined in `src/data.ts`. It never runs Qiskit in the browser. All dates and numbers below are from the user's executed, saved notebooks, not synthetic demo values.

| Website view | Source notebook | Data |
|---|---|---|
| Explorer | `notebooks/02_maxcut_qaoa_baselines.ipynb` | Three hand-defined weighted graphs, exact Max-Cut solutions, QAOA p=1/p=2 ideal-statevector expected cut and optimal-solution probabilities |
| Noise curve | `notebooks/04_qaoa_generalization_and_noise.ipynb` | 20 development-validation graphs, mean p=2 minus p=1 approximation-ratio differences under 0%, 2%, 5%, 10% CX noise, 95% bootstrap intervals, fraction preferring p=2 |
| Locked-test policies | `notebooks/06a_frozen_selector_locked_test.ipynb` | One-time test with 20 held-out graphs and 120 graph/condition choices, 720 Aer executions, mean utility, approximation ratio, compiled CX counts, paired graph-bootstrap intervals |
| Hardware | `notebooks/06b_qiskit_hardware_aware_transpilation.ipynb` | Mean CX and compiled circuit-depth resources, using 20 development-validation graphs for 3 topologies × 2 optimization levels × 2 QAOA depths |

### Frozen results highlighted

- Locked test: gate-budget rule mean utility **0.71814**, Random Forest **0.70511**, always p=2 **0.69939**, always p=1 **0.70870**. Oracle **0.72904** is hindsight, not deployable.
- Phase 4 validation: mean depth-2 advantage falls from **+0.0854** (0% CX error) to **−0.0105** (10% CX error), with the latter 95% bootstrap interval containing zero.
- Phase 6B: line topology at depth 2, optimization level 2 has **121.55** mean CX gates versus **54.40** for unrestricted connectivity at the same level.
- Selected Random Forest's paired locked-test difference versus gate-budget rule: **−0.01303** (95% interval **[−0.02412, −0.00415]**).

### Not supported

- No physical IBM QPU was executed.
- The topology illustrations are schematic 8-node graphs and are not calibrated IBM device maps.
- The interactive Max-Cut bit flips are a classical browser-side cut calculation, not quantum simulation.
- The circuit view is a conceptual representation of QAOA gate *families*, not a transpiler output or sampled circuit.
- The Random Forest did **not** establish superiority over simple adaptive rules on the locked test. This negative result should remain visible.
- No evidence of quantum computational advantage over classical optimization is claimed.

### Reproduction

The original executed notebooks and their local `reports/` artifacts remain in the existing QuantumOptLab project; this ZIP deliberately **does not** overwrite them or package potentially private local report files. For a future release, include appropriately audited, immutable exported benchmarks and pinned Python environments separately.
