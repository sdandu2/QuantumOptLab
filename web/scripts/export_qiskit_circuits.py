"""Export authentic, untranspiled Qiskit text drawings as portable SVG files.

Mirrors Phase 2's qaoa_circuit gate ordering and conventions:
H on all qubits; for each layer and each weighted edge, RZZ(-gamma*w);
RX(2*beta) on every qubit; finally measure all.

Run in the QuantumOptLab virtual environment:
    python web/scripts/export_qiskit_circuits.py

This writes only web/public/circuits; it NEVER changes frozen reports.
No extra plotting packages are required beyond Qiskit.
"""
from pathlib import Path
from html import escape
import json

from qiskit import QuantumCircuit
from qiskit.circuit import Parameter

EDGES = {
    'cycle_4': [(0,1,1),(1,2,1),(2,3,1),(3,0,1)],
    'weighted_5': [(0,1,1),(0,2,2),(1,2,1),(1,3,1),(2,3,2),(2,4,1),(3,4,1)],
    'weighted_6': [(0,1,1),(1,2,2),(2,3,1),(3,4,2),(4,5,1),(5,0,2),(0,2,1),(1,4,1),(3,5,1)],
}
DEST = Path(__file__).resolve().parent.parent / 'public' / 'circuits'
DEST.mkdir(parents=True, exist_ok=True)


def circuit_for(graph_name, depth):
    edges = EDGES[graph_name]
    n = max(max(u,v) for u,v,_ in edges) + 1
    qc = QuantumCircuit(n)
    qc.h(range(n))
    for layer in range(depth):
        gamma = Parameter(f'gamma_{layer+1}')
        beta = Parameter(f'beta_{layer+1}')
        for u,v,w in edges:
            qc.rzz(-float(w)*gamma,u,v)
        for q in range(n):
            qc.rx(2*beta,q)
    qc.measure_all()
    assert qc.count_ops()['rzz'] == len(edges)*depth
    assert qc.count_ops()['rx'] == n*depth
    return qc


def export_svg(text):
    lines = text.splitlines()
    max_chars = max(map(len, lines))
    height = max(90, 26 + len(lines)*19)
    width = max(650, 64 + max_chars*10)
    text_elems = '\n'.join(f'<text x="26" y="{32+i*19}">{escape(line)}</text>' for i,line in enumerate(lines))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
            f'viewBox="0 0 {width} {height}" role="img" aria-label="Qiskit text-rendered circuit">'
            '<rect width="100%" height="100%" fill="#0b2423"/>'
            '<g font-family="DejaVu Sans Mono, Consolas, monospace" font-size="14" '
            'xml:space="preserve" fill="#d1e8e2">'
            f'{text_elems}</g></svg>')


def main():
    manifest=[]
    for name in EDGES:
        for depth in (1,2):
            qc=circuit_for(name,depth)
            text=str(qc.draw(output='text', fold=135, vertical_compression='medium'))
            key=f'{name}_p{depth}'
            (DEST / f'{key}.txt').write_text(text+'\n',encoding='utf-8')
            (DEST / f'{key}.svg').write_text(export_svg(text),encoding='utf-8')
            manifest.append({'graph':name, 'depth':depth, 'qubits':qc.num_qubits,
                             'rzz':qc.count_ops()['rzz'], 'rx':qc.count_ops()['rx'],
                             'source':'qiskit.QuantumCircuit.draw(output="text")',
                             'file':f'{key}.svg'})
            print(f'Qiskit circuit: {key} ({qc.num_qubits} qubits, {qc.count_ops()["rzz"]} RZZ)')
    (DEST / 'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    print('Exported to:',DEST)


if __name__ == '__main__':
    main()
