"""Transparent weighted Max-Cut reference implementation.

Bit i of integer assignment selects the group for node i, consistent with
Qiskit's little-endian statevector index convention.
"""
from __future__ import annotations
from dataclasses import dataclass
import math

@dataclass(frozen=True)
class GraphProblem:
    name: str
    nodes: int
    edges: tuple[tuple[int,int,float], ...]

    def __post_init__(self):
        if not isinstance(self.nodes,int) or not (2 <= self.nodes <= 20):
            raise ValueError('This reference solver supports 2–20 nodes')
        if not self.edges:
            raise ValueError('At least one edge is required')
        seen=set()
        for u,v,w in self.edges:
            if not (isinstance(u,int) and isinstance(v,int) and 0<=u<self.nodes and 0<=v<self.nodes and u!=v):
                raise ValueError(f'Invalid edge endpoints: {(u,v)}')
            if not isinstance(w,(int,float)) or not math.isfinite(w) or w <= 0:
                raise ValueError('All weights must be finite and positive')
            key=tuple(sorted((u,v)))
            if key in seen: raise ValueError(f'Duplicate undirected edge {key}')
            seen.add(key)


def cut_value(graph:GraphProblem, assignment:int)->float:
    if not isinstance(assignment,int) or not (0<=assignment<(1<<graph.nodes)):
        raise ValueError('Assignment must be an integer bitmask within the graph size')
    return float(sum(w for u,v,w in graph.edges if ((assignment>>u)&1) != ((assignment>>v)&1)))


def cut_table(graph:GraphProblem)->tuple[float,...]:
    return tuple(cut_value(graph, mask) for mask in range(1<<graph.nodes))


def exact_maxcut(graph:GraphProblem)->tuple[float,tuple[int,...]]:
    values=cut_table(graph)
    maximum=max(values)
    return maximum, tuple(i for i,v in enumerate(values) if math.isclose(v,maximum,abs_tol=1e-12))
