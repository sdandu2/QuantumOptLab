# M7C release-candidate installation

1. Extract this ZIP into `C:\Users\sammy\Projects\QuantumOptLab-Public` (separate from the working project).
2. Run `powershell -ExecutionPolicy Bypass -File .\scripts\verify_public_candidate.ps1` in that directory, or use the terminal command supplied in ChatGPT. The script imports the **actual tested** npm lockfile from the working project.
3. The script creates an isolated Python 3.12 virtual environment, installs dependencies, runs all source-only tests, checks Qiskit circuits, then performs `npm ci` and the Vite production build.
4. Review the source and select a deliberate license. Do not claim `--strict` audit passes before resolving the license.
5. Only after verifying staging and CI, publish the repository. Do not overwrite frozen results in the working project.

Never copy `.venv`, `node_modules`, `dist`, private checkpoints, or reports to the public candidate. Qiskit circuit export outputs are generated during verification and ignored by Git.
