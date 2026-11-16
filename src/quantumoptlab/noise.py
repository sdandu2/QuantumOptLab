"""Synthetic noise utilities; NOT calibrated physical quantum hardware noise."""

def make_noise_model(cx_depolarizing:float=0.0, readout_flip:float=0.0):
    from qiskit_aer.noise import NoiseModel, ReadoutError, depolarizing_error
    for value,name in [(cx_depolarizing,'CX depolarizing parameter'),(readout_flip,'readout flip probability')]:
        if not (0<=value<=1): raise ValueError(f'{name} must be between 0 and 1')
    model=NoiseModel()
    if cx_depolarizing>0:
        model.add_all_qubit_quantum_error(depolarizing_error(cx_depolarizing,2),['cx'])
    if readout_flip>0:
        model.add_all_qubit_readout_error(ReadoutError([[1-readout_flip,readout_flip],[readout_flip,1-readout_flip]]))
    return model
