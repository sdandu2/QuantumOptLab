import pytest
qiskit=pytest.importorskip('qiskit',reason='Qiskit installed in release CI')
from quantumoptlab.benchmarks import FROZEN_GRAPHS
from quantumoptlab.qaoa import make_qaoa, ideal_statistics

@pytest.mark.parametrize('depth',[1,2])
def test_gate_families_match_historical_qaoa(depth):
    graph=FROZEN_GRAPHS['weighted_5']
    circ=make_qaoa(graph,depth)
    operations=circ.count_ops()
    assert operations.get('h',0)==graph.nodes
    assert operations.get('rzz',0)==len(graph.edges)*depth
    assert operations.get('rx',0)==graph.nodes*depth
    assert len(circ.parameters)==2*depth


def test_uniform_distribution_when_gamma_zero():
    result=ideal_statistics(FROZEN_GRAPHS['cycle_4'],1,[0.0,0.4])
    assert result['expected_cut']==pytest.approx(2.0,abs=1e-9)
    assert result['approximation_ratio']==pytest.approx(0.5,abs=1e-9)


def test_deeper_circuit_has_more_entangling_gates():
    graph=FROZEN_GRAPHS['weighted_6']
    p1=make_qaoa(graph,1,[0.5,0.6]);p2=make_qaoa(graph,2,[0.5,0.4,0.6,0.3])
    assert p2.count_ops()['rzz']==2*p1.count_ops()['rzz']

@pytest.mark.parametrize('bad',[(),(0.3,),(float('nan'),0.2)])
def test_invalid_angles_rejected(bad):
    with pytest.raises(ValueError):make_qaoa(FROZEN_GRAPHS['cycle_4'],1,bad)
