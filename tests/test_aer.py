import pytest
pytest.importorskip('qiskit_aer',reason='Aer installed in release CI')
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from quantumoptlab.noise import make_noise_model
from quantumoptlab.qaoa import make_qaoa
from quantumoptlab.benchmarks import FROZEN_GRAPHS


def test_bell_parity_degrades_with_cx_noise():
    qc=QuantumCircuit(2,2)
    qc.h(0);qc.cx(0,1);qc.measure([0,1],[0,1])
    shots=4096
    ideal=AerSimulator(seed_simulator=31).run(qc,shots=shots).result().get_counts()
    noisy=AerSimulator(noise_model=make_noise_model(0.20),seed_simulator=31).run(qc,shots=shots).result().get_counts()
    assert ideal.get('01',0)+ideal.get('10',0)==0
    assert noisy.get('01',0)+noisy.get('10',0)>shots*0.04


def test_compiled_line_topology_has_only_neighboring_cx():
    graph=FROZEN_GRAPHS['cycle_4']
    circuit=make_qaoa(graph,2,[0.4,0.5,0.2,0.4],measure=True)
    coupling=[[i,i+1] for i in range(graph.nodes-1)] + [[i+1,i] for i in range(graph.nodes-1)]
    routed=transpile(circuit,basis_gates=['rz','sx','x','cx'],coupling_map=coupling,optimization_level=1,seed_transpiler=31)
    for instruction in routed.data:
        if instruction.operation.name=='cx':
            u,v=(routed.find_bit(bit).index for bit in instruction.qubits)
            assert abs(u-v)==1
    assert routed.num_qubits==graph.nodes
    assert routed.count_ops().get('cx',0)>0


def test_invalid_noise_rejected():
    with pytest.raises(ValueError):make_noise_model(-0.1)
    with pytest.raises(ValueError):make_noise_model(0.1,1.1)
