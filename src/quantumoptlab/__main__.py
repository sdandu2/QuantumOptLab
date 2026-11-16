"""Fast, deterministic local Qiskit installation and Max-Cut smoke check."""
from .benchmarks import FROZEN_GRAPHS, EXPECTED_OPTIMA
from .maxcut import exact_maxcut
from .qaoa import make_qaoa, ideal_statistics


def main():
    for name,graph in FROZEN_GRAPHS.items():
        maximum,_=exact_maxcut(graph)
        assert maximum==EXPECTED_OPTIMA[name],f'{name} exact Max-Cut failed'
    graph=FROZEN_GRAPHS['cycle_4']
    qc=make_qaoa(graph,1,[0.0,0.4])
    expected=ideal_statistics(graph,1,[0.0,0.4])
    assert abs(expected['expected_cut']-2.0)<1e-9
    assert qc.count_ops().get('rzz',0)==4
    print('PASS: Qiskit circuit, weighted Max-Cut, and exact-statevector smoke checks')

if __name__=='__main__':main()
