const steps = Array.from(document.querySelectorAll('.step'));
const vizCanvas = document.getElementById('viz-canvas');

const subsetSelect = document.getElementById('subset-select');
const surfaceSelect = document.getElementById('surface-select');
const metricSelect = document.getElementById('metric-select');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

const state = {
    currentStep: 'intro',
    subset: 'all',
    surface: 'All',
    metric: 'bp_save_rate'
};

const colors = {
    Clay: '#D36B3E',
    Grass: '#7BB661',
    Hard: '#4A90E2',
    Unknown: '#8E8E8E',
    L: '#7BB661',
    R: '#4A90E2'
};

const datasets = {};

function setActiveStep(stepId) {
    steps.forEach(step => {
        if (step.dataset.step === stepId) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        if (link.dataset.stepLink === stepId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setCanvas(html) {
    vizCanvas.innerHTML = html;
}

function filteredServePoints() {
    let rows = (datasets.servePoints || []).slice();
    if (state.subset === 'top20') {
        rows = rows.filter(row => row.is_top20 === true);
    }
    if (state.surface !== 'All') {
        rows = rows.filter(row => row.surface === state.surface);
    }
    return rows;
}

function renderIntro() {
    setCanvas(`
        <div class="overview-grid">
            <div class="overview-left">
                <h3 class="viz-title">Tactical Biomechanics in Modern Tennis</h3>
                <p class="viz-subtitle">High-level takeaways and quick visual summary of 2020–2024 match data.</p>

                <ul class="overview-points">
                    <li><strong>Surface Effects:</strong> Serve efficiency is highest on grass and lowest on clay.</li>
                    <li><strong>Lefty Pressure:</strong> Handedness shifts clutch performance under break-point pressure.</li>
                    <li><strong>Global Shift:</strong> Winning talent is widely distributed beyond traditional strongholds.</li>
                </ul>

                <div class="overview-credits">
                    <div class="credit-title"> Team Members</div>
                    <div class="credit-list">
                        <div class="credit"><strong>Abdul Wadood Khan</strong> <span class="reg">(2023029)</span></div>
                        <div class="credit"><strong>Anila Kiran</strong> <span class="reg">(2023117)</span></div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function renderGutCheck() {
    setCanvas(`
        <h3 class="viz-title">Phase 1 Gut Check: Top Match Winners (2020-2023)</h3>
        <p class="viz-subtitle">Quick leaderboard of match winners to validate dataset patterns.</p>
        <div id="plot" class="plot-host"></div>
    `);

    const data = (datasets.topWinners || []).slice().reverse();
    Plotly.newPlot('plot', [{
        type: 'bar',
        x: data.map(d => d.wins),
        y: data.map(d => d.winner_name),
        orientation: 'h',
        marker: {
            color: data.map((_, index) => index),
            colorscale: 'Viridis'
        },
        hovertemplate: '%{y}<br>Wins: %{x}<extra></extra>'
    }], {
        margin: { l: 180, r: 20, t: 10, b: 50 },
        xaxis: { title: 'Match Wins' },
        yaxis: { title: '' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }, { responsive: true, displayModeBar: false });
}

function renderCorrelation() {
    const corr = datasets.correlation;
    setCanvas(`
        <h3 class="viz-title">Correlation Between Performance Metrics</h3>
        <p class="viz-subtitle">Heatmap of Pearson correlations among performance metrics.</p>
        <div id="plot" class="plot-host"></div>
    `);

    Plotly.newPlot('plot', [{
        type: 'heatmap',
        x: corr.labels,
        y: corr.labels,
        z: corr.matrix,
        colorscale: 'RdBu',
        reversescale: true,
        zmin: -1,
        zmax: 1,
        hovertemplate: '%{y} vs %{x}<br>corr: %{z:.2f}<extra></extra>'
    }], {
        margin: { l: 120, r: 20, t: 10, b: 100 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }, { responsive: true, displayModeBar: false });
}

function renderQ1() {
    const rows = filteredServePoints();
    const surfaces = Array.from(new Set(rows.map(r => r.surface))).sort();

    setCanvas(`
    <h3 class="viz-title">First Serve Efficiency by Surface</h3>
    <p class="viz-subtitle">Notebook violin/box exploration with interactive filtering by subset and surface.</p>
    <div id="plot" class="plot-host"></div>
  `);

    const traces = surfaces.map(surface => {
        const values = rows
            .filter(row => row.surface === surface)
            .map(row => row.first_serve_efficiency);

        return {
            type: 'violin',
            name: surface,
            y: values,
            box: { visible: true },
            points: 'suspectedoutliers',
            jitter: 0.25,
            marker: { color: colors[surface] || '#8E8E8E' },
            line: { color: colors[surface] || '#8E8E8E' },
            hovertemplate: `${surface}<br>Efficiency: %{y:.3f}<extra></extra>`
        };
    });

    Plotly.newPlot('plot', traces, {
        margin: { l: 60, r: 20, t: 10, b: 60 },
        yaxis: { title: 'First Serve Efficiency', tickformat: '.0%' },
        xaxis: { title: 'Surface' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }, { responsive: true, displayModeBar: false });
}

function renderQ2() {
    const metricKey = state.metric === 'first_serve_efficiency' ? 'mean_first_serve_efficiency' : 'mean_bp_save_rate';
    const metricLabel = state.metric === 'first_serve_efficiency' ? 'First Serve Efficiency' : 'Break Point Save %';

    const rows = (datasets.leftyStats || []).filter(row => state.surface === 'All' || row.surface === state.surface);
    const surfaces = Array.from(new Set(rows.map(row => row.surface))).sort();

    setCanvas(`
    <h3 class="viz-title">Lefty Advantage Across Surfaces</h3>
    <p class="viz-subtitle">Notebook facet concept, now interactive by metric and surface.</p>
    <div id="plot" class="plot-host"></div>
  `);

    const left = surfaces.map(surface => {
        const point = rows.find(row => row.surface === surface && row.loser_hand === 'L');
        return point ? point[metricKey] : null;
    });
    const right = surfaces.map(surface => {
        const point = rows.find(row => row.surface === surface && row.loser_hand === 'R');
        return point ? point[metricKey] : null;
    });

    Plotly.newPlot('plot', [
        {
            type: 'bar',
            name: 'Facing Left-Handed Opponent',
            x: surfaces,
            y: left,
            marker: { color: colors.L }
        },
        {
            type: 'bar',
            name: 'Facing Right-Handed Opponent',
            x: surfaces,
            y: right,
            marker: { color: colors.R }
        }
    ], {
        barmode: 'group',
        margin: { l: 70, r: 20, t: 10, b: 60 },
        yaxis: { title: metricLabel, tickformat: '.0%' },
        xaxis: { title: 'Surface' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }, { responsive: true, displayModeBar: false });
}

function renderQ3() {
    const geoRows = datasets.geoWins || [];
    const hasPlayerGeo = (datasets.geoPlayers || []).length > 0;

    setCanvas(`
    <h3 class="viz-title">Global Distribution of Winners</h3>
    <p class="viz-subtitle">Choropleth map from notebook, plus top-country ranking.</p>
    <div id="map" class="plot-host" style="min-height:52vh;"></div>
    <div id="bars" class="plot-host" style="min-height:28vh;"></div>
  `);

    Plotly.newPlot('map', [{
        type: 'choropleth',
        locations: geoRows.map(d => d.iso3),
        locationmode: 'ISO-3',
        z: geoRows.map(d => d.total_wins),
        text: geoRows.map(d => `${d.ioc}: ${d.total_wins} wins`),
        colorscale: 'YlOrRd',
        marker: { line: { color: 'white', width: 0.4 } },
        colorbar: { title: 'Wins' },
        hovertemplate: '%{text}<extra></extra>'
    }], {
        margin: { l: 10, r: 10, t: 10, b: 0 },
        geo: {
            projection: { type: 'natural earth' },
            showframe: false,
            showcoastlines: true,
            coastlinecolor: '#d6dfe8',
            bgcolor: 'rgba(0,0,0,0)'
        },
        paper_bgcolor: 'rgba(0,0,0,0)'
    }, { responsive: true, displayModeBar: false });

    const top = geoRows.slice().sort((a, b) => b.total_wins - a.total_wins).slice(0, 12).reverse();
    Plotly.newPlot('bars', [{
        type: 'bar',
        orientation: 'h',
        x: top.map(d => d.total_wins),
        y: top.map(d => d.ioc),
        marker: { color: '#D36B3E' },
        hovertemplate: '%{y}<br>Wins: %{x}<extra></extra>'
    }], {
        margin: { l: 60, r: 20, t: 10, b: 40 },
        xaxis: { title: 'Total Wins' },
        yaxis: { title: '' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }, { responsive: true, displayModeBar: false });

    if (hasPlayerGeo) {
        const note = document.createElement('p');
        note.className = 'viz-subtitle';
        note.textContent = 'Optional player-distribution map data is also prepared (geo_players.json).';
        vizCanvas.appendChild(note);
    }
}

function renderConclusion() {
    setCanvas(`
        <div class="conclusion-grid">
            <div class="conclusion-left">
                <h3 class="viz-title">Takeaways & Submission Checklist</h3>
                <ul class="checklist">
                    <li><strong>Surface sensitivity:</strong> First-serve effectiveness varies substantially by surface.</li>

                    <li><strong>Clutch variance:</strong> Break-point saving behaves differently facing left- vs right-handed opponents.</li>
                    
                    <li><strong>Global breadth:</strong> Winners are distributed across many countries — not just a few powerhouses.</li>
                </ul>
            </div>
            <div class="conclusion-right">
                <div id="summary-chart" class="plot-host" style="height:100%;"></div>
            </div>
        </div>
    `);

    // small pie/donut: top-5 countries share to visually fill space
    const geo = (datasets.geoWins || []).slice().sort((a, b) => b.total_wins - a.total_wins).slice(0, 5);
    if (geo.length > 0) {
        Plotly.newPlot('summary-chart', [{
            type: 'pie',
            labels: geo.map(d => d.ioc),
            values: geo.map(d => d.total_wins),
            hole: 0.45,
            marker: { colors: ['#D36B3E', '#7BB661', '#4A90E2', '#8E8E8E', '#FFC857'] },
            hovertemplate: '%{label}: %{value} wins<extra></extra>'
        }], {
            margin: { t: 10, b: 10, l: 10, r: 10 },
            paper_bgcolor: 'rgba(0,0,0,0)'
        }, { responsive: true, displayModeBar: false });
    }
}

function updateHeroStats() {
    const recordsEl = document.getElementById('stat-records');
    const medianServeEl = document.getElementById('stat-median-serve');
    const countriesEl = document.getElementById('stat-countries');
    const topCountryEl = document.getElementById('stat-top-country');

    const serveRows = datasets.servePoints || [];
    const geoRows = datasets.geoWins || [];

    const efficiencies = serveRows
        .map(row => row.first_serve_efficiency)
        .filter(value => Number.isFinite(value))
        .sort((a, b) => a - b);

    let median = null;
    if (efficiencies.length > 0) {
        const mid = Math.floor(efficiencies.length / 2);
        median = efficiencies.length % 2 === 0
            ? (efficiencies[mid - 1] + efficiencies[mid]) / 2
            : efficiencies[mid];
    }

    const topCountry = geoRows.length > 0
        ? geoRows.reduce((best, row) => (row.total_wins > best.total_wins ? row : best), geoRows[0]).ioc
        : '--';

    recordsEl.textContent = serveRows.length.toLocaleString();
    medianServeEl.textContent = median === null ? '--' : `${(median * 100).toFixed(1)}%`;
    countriesEl.textContent = geoRows.length.toLocaleString();
    topCountryEl.textContent = topCountry;
}

function renderCurrentStep() {
    setActiveStep(state.currentStep);

    if (state.currentStep === 'intro') renderIntro();
    if (state.currentStep === 'gutcheck') renderGutCheck();
    if (state.currentStep === 'correlation') renderCorrelation();
    if (state.currentStep === 'q1') renderQ1();
    if (state.currentStep === 'q2') renderQ2();
    if (state.currentStep === 'q3') renderQ3();
    if (state.currentStep === 'conclusion') renderConclusion();
}

function attachEvents() {
    const updateStepFromScroll = () => {
        const viewportCenter = window.innerHeight * 0.5;
        let bestStep = null;
        let bestDistance = Number.POSITIVE_INFINITY;

        steps.forEach(step => {
            const rect = step.getBoundingClientRect();
            const stepCenter = rect.top + rect.height / 2;
            const distance = Math.abs(stepCenter - viewportCenter);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestStep = step.dataset.step;
            }
        });

        if (bestStep && bestStep !== state.currentStep) {
            state.currentStep = bestStep;
            renderCurrentStep();
        }
    };

    // Disable automatic step changes on scroll. Steps only change when user clicks
    // a sidebar link. This prevents accidental navigation while reading.

    navLinks.forEach(link => {
        link.addEventListener('click', (ev) => {
            ev.preventDefault();
            const targetStep = link.dataset.stepLink;
            const targetSection = document.querySelector(`.step[data-step="${targetStep}"]`);
            // set state and render immediately when user clicks
            if (targetStep && targetStep !== state.currentStep) {
                state.currentStep = targetStep;
                renderCurrentStep();
            }
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    subsetSelect.addEventListener('change', () => {
        state.subset = subsetSelect.value;
        if (state.currentStep === 'q1') renderCurrentStep();
    });

    surfaceSelect.addEventListener('change', () => {
        state.surface = surfaceSelect.value;
        if (state.currentStep === 'q1' || state.currentStep === 'q2') renderCurrentStep();
    });

    metricSelect.addEventListener('change', () => {
        state.metric = metricSelect.value;
        if (state.currentStep === 'q2') renderCurrentStep();
    });

    window.addEventListener('resize', () => {
        if (['gutcheck', 'correlation', 'q1', 'q2', 'q3'].includes(state.currentStep)) {
            renderCurrentStep();
        }
    });
}

async function loadData() {
    const [
        topWinners,
        correlation,
        servePoints,
        leftyStats,
        geoWins,
        geoPlayers
    ] = await Promise.all([
        fetch('data/top_winners.json').then(res => res.json()),
        fetch('data/correlation.json').then(res => res.json()),
        fetch('data/serve_efficiency_points.json').then(res => res.json()),
        fetch('data/lefty_stats.json').then(res => res.json()),
        fetch('data/geo_wins.json').then(res => res.json()),
        fetch('data/geo_players.json').then(res => (res.ok ? res.json() : []))
    ]);

    datasets.topWinners = topWinners;
    datasets.correlation = correlation;
    datasets.servePoints = servePoints;
    datasets.leftyStats = leftyStats;
    datasets.geoWins = geoWins;
    datasets.geoPlayers = geoPlayers;
}

(async function init() {
    try {
        await loadData();
        updateHeroStats();
        attachEvents();
        state.currentStep = 'intro';
        renderCurrentStep();
    } catch (error) {
        setCanvas(`<h3 class="viz-title">Data Load Error</h3><p class="viz-subtitle">${error.message}</p>`);
    }
})();
