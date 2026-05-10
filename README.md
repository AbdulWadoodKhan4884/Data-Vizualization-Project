Narrative Web Visualization — Tactical Biomechanics (Tennis)

Quick start

1) Prepare web-ready JSON files (requires pandas):

```bash
python data/prepare_data.py
```

This writes lightweight JSON files into `web/data/` used by the prototype.

2) Open the prototype:
- Open `web/index.html` in your browser.

GitHub Pages deployment

This repository is prepared to publish from the repository root.

1) Make sure the generated JSON files exist in `web/data/`:

```bash
python data/prepare_data.py
```

2) Push the repository to GitHub.

```bash
git init
git add .
git commit -m "Prepare tennis visualization for GitHub Pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3) In the repository settings, open Pages and choose one of these sources:
- Branch: `main`, folder: `/ (root)`
- Or use the GitHub Actions workflow if you add one later

4) Open the published site. The root `index.html` redirects to `web/index.html`, so the app loads without moving files out of `web/`.

Notes
- The prototype uses the JSON files in `web/data/` and the page entry point in `web/index.html`.
- If you prefer a cleaner Pages path, you can also deploy from a dedicated `gh-pages` branch later.

Next recommended steps
- Implement `renderQ1`, `renderQ2`, `renderQ3` in `web/script.js` using D3 and the JSON files.
- Add Top-20 player interaction and tooltips.
- Replace placeholder map with TopoJSON-based choropleth.

Acknowledgements
- Dataset: Huge Tennis Database (Kaggle / ATP datasets).
- Libraries: D3.js, pandas.

Team
- Abdul Wadood Khan (2023029)
- Anila Kiran (2023117)
