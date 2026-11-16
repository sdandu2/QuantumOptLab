# Deploy the React atlas with GitHub Pages

This repository ships a **static** React/Vite atlas. The site reads frozen research
snapshots; GitHub Pages cannot run Python/Qiskit on demand.

## GitHub setup

1. Push the `.github/workflows/pages.yml` workflow and website asset-path fix to `main`.
2. Open repository **Settings → Pages**, and select **GitHub Actions** as the source.
3. Open **Actions → Deploy QuantumOptLab site to GitHub Pages** and run the workflow if needed.
4. Verify the workflow turns green, then open the displayed deployment URL. For this
   repository the expected URL is `https://sdandu2.github.io/QuantumOptLab/`.
5. Open Explorer and switch graph/depth combinations to verify all six exported Qiskit
   circuit SVGs load. Test Benchmarks, Hardware, Methodology, and mobile navigation.

## Design details

- Vite uses `base: './'`, which writes relative links for built JS/CSS.
- The circuit viewer uses `import.meta.env.BASE_URL` rather than `/circuits/`, so assets
  resolve under the repository subpath.
- The workflow uses `npm ci` with the committed `web/package-lock.json`.
- The build is deployed from `web/dist`, not the repository root.

If the Pages job fails before deployment, confirm Pages is configured to use GitHub Actions
and check repository/organization Pages policies. If assets 404, check the asset URL and
Vite base before changing research data.
