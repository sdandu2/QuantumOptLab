import json
import os
import pytest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
NAMES=[
 '01_quantum_circuits_and_noise.ipynb','02_maxcut_qaoa_baselines.ipynb',
 '03_qaoa_noise_robustness.ipynb','04_qaoa_generalization_and_noise.ipynb',
 '05_noise_aware_depth_selection.ipynb','06a_frozen_selector_locked_test.ipynb',
 '06b_qiskit_hardware_aware_transpilation.ipynb']


def test_all_seven_notebooks_are_present_and_structured():
    for name in NAMES:
        p=ROOT/'notebooks'/name
        assert p.is_file(),name
        nb=json.loads(p.read_text(encoding='utf8'))
        assert nb['nbformat']==4
        codes=[i for i,c in enumerate(nb['cells']) if c['cell_type']=='code']
        assert codes,f'No code cells: {name}'
        for i in codes:
            assert i>0 and nb['cells'][i-1]['cell_type']=='markdown',f'Code lacks markdown introduction: {name} cell {i}'


@pytest.mark.skipif(os.environ.get('QUANTUMOPTLAB_PUBLIC_SOURCE') != '1', reason='Enforce source-only notebooks in public CI, not local executed working copies')
def test_public_copy_does_not_publish_executed_outputs():
    for name in NAMES:
        nb=json.loads((ROOT/'notebooks'/name).read_text(encoding='utf8'))
        for cell in nb['cells']:
            if cell['cell_type']=='code':
                assert cell.get('outputs',[])==[],f'Notebook output must be stripped in the public candidate: {name}'
                assert cell.get('execution_count') is None,name
