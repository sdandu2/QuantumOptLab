"""Small, tested reference implementation for QuantumOptLab experiments.

The published notebooks are independent historical research records; this
package offers reusable reference algorithms without modifying them.
"""
from .maxcut import GraphProblem, cut_value, cut_table, exact_maxcut
from .benchmarks import FROZEN_GRAPHS

__all__ = ["GraphProblem", "FROZEN_GRAPHS", "cut_value", "cut_table", "exact_maxcut"]
__version__ = "0.1.0"
