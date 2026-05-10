Visual Design Study — Tactical Biomechanics (Tennis)

Design goals
- Tone: professional-analytical with sporty energy.
- Audience: classmates, instructors, coaches, data-curious sports fans.
- Emphasis: clarity of statistical comparisons, intuitive interactivity, and tennis-themed aesthetics.

Typography
- Headings: "Playfair Display" (serif) or similar for a strong headline.
- Body: "Inter" or "Rubik" for readability at small sizes.
- Sizes: H1 36–48px, H2 24–30px, body 16px.

Color palette
- Court Grass: #7BB661 (accent)
- Clay: #D36B3E (accent)
- Hard Court: #4A90E2 (accent)
- Neutral background: #F7F7F7
- Text primary: #1F2D3D
- Highlight / Action: #FFD166

Imagery & iconography
- Use subtle court textures for section backgrounds (light opacity).
- Player avatars: circular photos where available; fallback to initials.
- Icons: simple line icons for filters, play, pause, map, and share.

Visualization grammar
- Q1: violin/box to show distributions + optional swarm/point overlay for Top-20.
- Q2: grouped bar charts or small multiples with animated transitions.
- Q3: choropleth + time slider; country detail panel with bar chart of top players.

Interaction techniques
- Scrollytelling activation: use IntersectionObserver to trigger D3 transitions.
- Reader controls: toggles, dropdowns, click-to-pin-country, time slider.
- Tooltips: concise stats (value, sample size, CI if available).
- Accessibility: high-contrast color options and keyboard navigation for filters.

Motion & transitions
- Smooth easing (cubic-out), 300–600ms durations for major transitions.
- Use highlight + dim to focus attention.

Assets & fonts
- Google Fonts: Playfair Display, Inter.
- D3.js (v7) for visualizations.
- Optional: topojson + simple world map GeoJSON for choropleth.

Deliverables from this step
- A small style guide (this file) and a set of color swatches.
- I can export a simple style mockup as HTML/CSS next if you want.
