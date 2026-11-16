"""Three historical Phase 2 teaching/verification graphs, not held-out test graphs."""
from .maxcut import GraphProblem

FROZEN_GRAPHS={
    'cycle_4': GraphProblem('Cycle 4',4,((0,1,1),(1,2,1),(2,3,1),(3,0,1))),
    'weighted_5': GraphProblem('Weighted 5',5,((0,1,1),(0,2,2),(1,2,1),(1,3,1),(2,3,2),(2,4,1),(3,4,1))),
    'weighted_6': GraphProblem('Weighted 6',6,((0,1,1),(1,2,2),(2,3,1),(3,4,2),(4,5,1),(5,0,2),(0,2,1),(1,4,1),(3,5,1))),
}
EXPECTED_OPTIMA={'cycle_4':4,'weighted_5':7,'weighted_6':10}
