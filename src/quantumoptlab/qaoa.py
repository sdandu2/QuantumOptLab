"""QAOA circuit construction matching the Phase 2/4/6 notebook convention.

Parameter order: [gamma_1,...,gamma_p,beta_1,...,beta_p].
Cost gates: RZZ(-gamma * edge_weight) for each graph edge.
Mixer gates: RX(2 * beta) for each qubit.
"""
from __future__ import annotations
from collections.abc import Sequence
from .maxcut import GraphProblem


def make_qaoa(graph:GraphProblem, depth:int, params:Sequence[float] | None = None, *, measure:bool = False):
    from qiskit import QuantumCircuit
    from qiskit.circuit import Parameter
    if not isinstance(depth,int) or depth < 1 or depth > 8:
        raise ValueError('Depth must be an integer from 1 through 8')
    if params is None:
        gammas=[Parameter(f'gamma_{i+1}') for i in range(depth)]
        betas=[Parameter(f'beta_{i+1}') for i in range(depth)]
    else:
        import math
        pars=list(params)
        if len(pars)!=2*depth or not all(isinstance(x,(int,float)) and math.isfinite(x) for x in pars):
            raise ValueError(f'Expected {2*depth} finite numeric QAOA angles')
        gammas,betas=pars[:depth],pars[depth:]
    qc=QuantumCircuit(graph.nodes)
    qc.h(range(graph.nodes))
    for gamma,beta in zip(gammas,betas):
        for u,v,w in graph.edges:
            qc.rzz(-float(w)*gamma,u,v)
        for q in range(graph.nodes):
            qc.rx(2*beta,q)
    if measure:qc.measure_all()
    return qc


def ideal_statistics(graph:GraphProblem, depth:int, params:Sequence[float])->dict:
    import numpy as np
    from qiskit.quantum_info import Statevector
    from .maxcut import cut_table
    qc=make_qaoa(graph,depth,params)
    p=np.abs(Statevector.from_instruction(qc).data)**2
    costs=np.asarray(cut_table(graph))
    maximum=float(costs.max())
    return {'expected_cut':float(np.dot(p,costs)),
            'approximation_ratio':float(np.dot(p,costs)/maximum),
            'p_optimal':float(p[np.isclose(costs,maximum)].sum())}
