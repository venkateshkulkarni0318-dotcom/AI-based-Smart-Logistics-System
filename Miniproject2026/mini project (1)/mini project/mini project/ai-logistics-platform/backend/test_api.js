const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:5050';

async function runTests() {
  // Check if server is already listening; if not, dynamically start it
  try {
    const check = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(300) });
    if (!check.ok) throw new Error('Not running');
  } catch {
    await import('./server.js');
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n--- STARTING AUTOMATED BACKEND API TESTS [${BASE_URL}] ---`);
  let failures = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
    } catch (err) {
      console.error(`✗ FAIL: ${name} ->`, err.message);
      failures++;
    }
  }

  // 1. Health endpoint
  await test('GET /health returns 200 with objectivesSupported', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'OK' || !Array.isArray(data.objectivesSupported)) {
      throw new Error(`Unexpected health payload: ${JSON.stringify(data)}`);
    }
  });

  // 1b. Real Metrics Telemetry endpoint (Fixes Issue A5)
  await test('GET /metrics returns verified latency & telemetry', async () => {
    const res = await fetch(`${BASE_URL}/metrics`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.data?.latency) {
      throw new Error(`Unexpected metrics payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. Villages endpoint
  await test('GET /api/villages returns canonical villages & stats', async () => {
    const res = await fetch('http://127.0.0.1:5050/api/villages');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length < 5) {
      throw new Error('Villages array missing or empty');
    }
    if (!data.stats || typeof data.stats.totalSettlements !== 'number') {
      throw new Error('Villages stats missing');
    }
  });

  // 3. Villages dynamic scoring
  await test('POST /api/villages/score computes accurate accessibility score', async () => {
    const res = await fetch('http://127.0.0.1:5050/api/villages/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seasonalCutoffDays: 90,
        distanceToPavedRoadKm: 18,
        terrainElevationM: 3200,
        slopeGradientDeg: 24
      })
    });
    const data = await res.json();
    if (!data.success || typeof data.data.accessScore !== 'number') {
      throw new Error(`Scoring calculation failed: ${JSON.stringify(data)}`);
    }
    if (data.data.accessScore > 60) {
      throw new Error('High cutoff and slope should result in isolated score');
    }
  });

  // 4. Multimodal modes and recommendation
  await test('POST /api/multimodal/recommend selects drone for emergency', async () => {
    const res = await fetch('http://127.0.0.1:5050/api/multimodal/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distanceKm: 85,
        payloadWeightKg: 40,
        urgencyLevel: 'CRITICAL_EMERGENCY',
        weatherCondition: 'Clear',
        terrainType: 'Mountain'
      })
    });
    const data = await res.json();
    if (!data.success || data.recommendedModeId !== 'drone') {
      throw new Error(`Expected drone, got: ${data.recommendedModeId}`);
    }
    if (!Array.isArray(data.comparativeMatrix) || data.comparativeMatrix.length !== 4) {
      throw new Error('Matrix missing 4 comparison modes');
    }
  });

  // 5. ML Risk Assessment
  await test('POST /api/risk/evaluate computes disruption probability', async () => {
    const res = await fetch('http://127.0.0.1:5050/api/risk/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rainfallMmHr: 85,
        windSpeedKmh: 42,
        soilSaturationPct: 88,
        slopeGradientDeg: 28,
        pastIncidentsScale: 7
      })
    });
    const data = await res.json();
    if (!data.success || data.evaluation.category !== 'CRITICAL') {
      throw new Error(`Expected CRITICAL risk, got: ${data?.evaluation?.category}`);
    }
    if (!data.evaluation.hazards.length) {
      throw new Error('Expected hazard alerts');
    }
  });

  // 6. Routing optimization
  await test('POST /api/routing/optimize calculates multi-stop route', async () => {
    const res = await fetch('http://127.0.0.1:5050/api/routing/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationVillageIds: ['v-h1', 'v-h2', 'v-h3']
      })
    });
    const data = await res.json();
    if (!data.success || !data.summary || !data.legs) {
      throw new Error('Routing optimization summary or legs missing');
    }
    if (data.summary.totalStops !== 3) {
      throw new Error(`Expected 3 stops, got ${data.summary.totalStops}`);
    }
  });

  // 7. GeoData status
  await test('GET /api/geo/status verifies srtm and shrug presence', async () => {
    const res = await fetch(`${BASE_URL}/api/geo/status`);
    const data = await res.json();
    if (!data.success || !data.data.srtm.loaded) {
      throw new Error('SRTM GeoJSON should be reported as loaded');
    }
    if (!data.data.shrug.loaded) {
      throw new Error('SHRUG SQLite DB should be reported as loaded');
    }
  });

  // 8. Elevation Profile & Transect Curve
  await test('GET /api/geo/elevation-profile returns points, metrics & transect curve', async () => {
    const res = await fetch(`${BASE_URL}/api/geo/elevation-profile?corridor_id=corridor-himalaya`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.profile) || data.pointCount < 1) {
      throw new Error('Elevation profile array missing or empty');
    }
    if (!data.metrics || typeof data.metrics.maxElevationM !== 'number') {
      throw new Error('Elevation metrics missing or invalid');
    }
    if (!Array.isArray(data.transectCurve) || data.transectCurve.length < 5) {
      throw new Error('Interpolated transect curve missing or incomplete');
    }
  });

  // 9. Phase 2: All 29 Cases Listed (T1–T29)
  await test('GET /api/cases returns all 29 categorized cases', async () => {
    const res = await fetch(`${BASE_URL}/api/cases`);
    const data = await res.json();
    if (!data.success || data.totalCount !== 29) {
      throw new Error(`Expected 29 cases, got ${data.totalCount}`);
    }
    if (data.categories.weatherDisaster !== 12 || data.categories.operational !== 11 || data.categories.dataIntegrity !== 6) {
      throw new Error(`Category breakdown mismatch: ${JSON.stringify(data.categories)}`);
    }
  });

  // 10. Phase 2: Cloudburst Trigger Simulation (T1)
  await test('POST /api/cases/simulate-trigger detects T1 Cloudburst and recommends Drone', async () => {
    const res = await fetch(`${BASE_URL}/api/cases/simulate-trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rainfallMmHr: 110 })
    });
    const data = await res.json();
    if (!data.success || data.triggeredCount < 1 || !data.topRecommendedSwitch.includes('Drone')) {
      throw new Error(`Expected Cloudburst drone switch: ${JSON.stringify(data)}`);
    }
  });

  // 11. Phase 2: Unknown SHRUG key graceful rejection (T25)
  await test('GET /api/cases/data/lookup-shrid returns polite suggestions without crashing (T25)', async () => {
    const res = await fetch(`${BASE_URL}/api/cases/data/lookup-shrid/nonexistent-key-12345`);
    const data = await res.json();
    if (!data.success || data.found !== false || !Array.isArray(data.suggestions)) {
      throw new Error(`T25 unknown shrug handling failed: ${JSON.stringify(data)}`);
    }
  });

  // 12. Phase 2: Duplicate settlements detection (T26)
  await test('GET /api/cases/data/duplicate-check verifies single source of truth (T26)', async () => {
    const res = await fetch(`${BASE_URL}/api/cases/data/duplicate-check`);
    const data = await res.json();
    if (!data.success || typeof data.duplicateCount !== 'number') {
      throw new Error(`T26 duplicate detector failed: ${JSON.stringify(data)}`);
    }
  });

  // 13. Phase 2: Outdated weather feed fallback (T27)
  await test('GET /api/cases/data/weather-staleness detects stale feed and triggers cache (T27)', async () => {
    const res = await fetch(`${BASE_URL}/api/cases/data/weather-staleness?hours=8.0`);
    const data = await res.json();
    if (!data.success || !data.isStale || !data.warning) {
      throw new Error(`T27 weather staleness detector failed: ${JSON.stringify(data)}`);
    }
  });

  console.log(`\n--- ALL TESTS COMPLETED: ${failures === 0 ? 'ALL PASSED' : `${failures} FAILED`} ---\n`);
  process.exit(failures === 0 ? 0 : 1);
}

runTests();
