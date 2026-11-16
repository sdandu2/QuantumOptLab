# Research design and experimental boundaries

- **Problem**: Weighted Max-Cut, encoded via QAOA with RZZ cost interactions
  and RX mixers; depth p=1 versus p=2.
- **Quantum software**: Qiskit 2.6.2, Aer 0.18.2 on the user's research
  environment; ideal statevectors and synthetic noisy shot-based simulations.
- **Graphs**: 80 generated instances (40 training, 20 validation,
  20 locked test). Three teaching graphs are also used for the Explorer.
- **Classical references**: exact brute-force cut values on small graphs;
  greedy and simulated annealing baselines. These should not be confused with
  QAOA's expected objective under a probability distribution.
- **Noise**: synthetic depolarizing CX and readout models. Neither is a
  hardware calibration. Measurement and compilation conditions are recorded
  in the associated notebooks.
- **Model selection**: Phase 5 used training folds grouped by graph and a
  separate development-validation set. The selected random forest and decision
  rules were frozen before the one-time 20-graph test in Phase 6A.
- **Locked test**: Negative learning result preserved. Simpler adaptive rules
  performed better under the cost-adjusted objective. No additional tuning on
  this test can count as a new independent generalization estimate.
- **Hardware study**: Phase 6B compiled QAOA circuits onto synthetic line,
  ring and all-to-all connectivity. It measures resources; it is not physical
  QPU execution or routed-circuit noisy-fidelity verification.
- **Research limitations**: small graph sizes, limited optimizer restarts,
  performance differences under synthetic noise, potential cost-function
  sensitivity, and no quantum computational advantage.

Detailed parameters and assertions are in the source-only notebooks in order.
The original executed notebooks and reports are private archival evidence.
