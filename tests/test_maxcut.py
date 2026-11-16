import pytest
from quantumoptlab.benchmarks import FROZEN_GRAPHS, EXPECTED_OPTIMA
from quantumoptlab.maxcut import GraphProblem, cut_value, cut_table, exact_maxcut

@pytest.mark.parametrize('name',list(EXPECTED_OPTIMA))
def test_exact_historical_graphs(name):
    graph=FROZEN_GRAPHS[name]
    optimum,assignments=exact_maxcut(graph)
    assert optimum==EXPECTED_OPTIMA[name]
    assert len(cut_table(graph))==2**graph.nodes
    assert all(cut_value(graph,x)==optimum for x in assignments)


def test_bitmask_and_complement_invariance():
    for graph in FROZEN_GRAPHS.values():
        mask=(1<<graph.nodes)-1
        for assignment in range(1<<graph.nodes):
            assert cut_value(graph,assignment)==cut_value(graph,assignment^mask)

@pytest.mark.parametrize('edges', [((0,0,1),),((0,1,-2),),((0,1,1),(1,0,2)),((0,5,1),)])
def test_bad_edges_fail(edges):
    with pytest.raises(ValueError): GraphProblem('invalid',4,edges)

def test_undefined_assignment_fails():
    with pytest.raises(ValueError):cut_value(FROZEN_GRAPHS['cycle_4'],16)
