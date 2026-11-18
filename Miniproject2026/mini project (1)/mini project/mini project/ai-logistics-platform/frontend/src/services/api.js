const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

/**
 * Helper to handle fetch responses safely
 */
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson.message) errorMsg = errJson.message;
      } catch { }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API Client] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

/**
 * Fetch settlements & outposts with optional filters (Objective 03)
 */
export async function getVillages(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.corridor) query.set('corridor', params.corridor);
  if (params.riskStatus) query.set('riskStatus', params.riskStatus);
  if (params.borderZone !== undefined && params.borderZone !== null) query.set('borderZone', params.borderZone);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const qs = query.toString();
  return fetchJson(`/villages${qs ? `?${qs}` : ''}`);
}

/**
 * Fetch specific settlement profile with SHRUG link
 */
export async function getVillageById(id) {
  return fetchJson(`/villages/${encodeURIComponent(id)}`);
}

/**
 * Dynamically evaluate accessibility score (Objective 03)
 */
export async function scoreVillageAccessibility(payload) {
  return fetchJson('/villages/score', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Fetch system-wide risk assessment overview (Objective 02)
 */
export async function getRiskAssessment() {
  return fetchJson('/risk/assessment');
}

/**
 * Evaluate multi-factor ML disruption risk (Objective 02)
 */
export async function evaluateRisk(payload) {
  return fetchJson('/risk/evaluate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Fetch active delivery routes (Objective 04)
 */
export async function getActiveRoutes(corridorId = '') {
  return fetchJson(`/routing/active${corridorId ? `?corridorId=${encodeURIComponent(corridorId)}` : ''}`);
}

/**
 * Optimize route delivery waypoints & modal split (Objective 04)
 */
export async function optimizeRoute(payload) {
  return fetchJson('/routing/optimize', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Fetch case-study corridors (Objective 06)
 */
export async function getCorridors() {
  return fetchJson('/corridors');
}

/**
 * Fetch single case study corridor
 */
export async function getCorridorById(id) {
  return fetchJson(`/corridors/${encodeURIComponent(id)}`);
}

/**
 * Fetch multimodal modes & transport capacities (Objective 01)
 */
export async function getMultimodalModes() {
  return fetchJson('/multimodal/modes');
}

/**
 * Pareto-optimal mode recommendation engine (Objective 04)
 */
export async function recommendMode(payload) {
  return fetchJson('/multimodal/recommend', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Dataset health and presence status (SRTM + SHRUG)
 */
export async function getGeoStatus() {
  return fetchJson('/geo/status');
}

/**
 * Fetch SRTM elevation contours & spot heights
 */
export async function getSrtmFeatures(corridorId = '') {
  return fetchJson(`/geo/srtm${corridorId ? `?corridor_id=${encodeURIComponent(corridorId)}` : ''}`);
}

/**
 * Search SHRUG Assembly Constituencies and identifiers
 */
export async function searchShrugConstituencies(query = '', limit = 10) {
  return fetchJson(`/geo/shrug/constituencies?q=${encodeURIComponent(query)}&limit=${limit}`);
}

/**
 * Fetch SRTM elevation profile and cross-sectional transect
 */
export async function getElevationProfile(corridorId = 'corridor-himalaya') {
  return fetchJson(`/geo/elevation-profile?corridor_id=${encodeURIComponent(corridorId)}`);
}

/**
 * Fetch real system latency and telemetry metrics (Fixes Issue A5)
 */
export async function getMetrics() {
  const rootUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  try {
    const res = await fetch(`${rootUrl}/metrics`);
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch system health status
 */
export async function getHealth() {
  const rootUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  try {
    const res = await fetch(`${rootUrl}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'DEGRADED', error: err.message };
  }
}

/**
 * Fetch all 29 Phase 2 operational and hazard cases (T1–T29)
 */
export async function getCases(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.riskLevel) query.set('riskLevel', params.riskLevel);
  if (params.search) query.set('search', params.search);
  const qStr = query.toString();
  return fetchJson(`/cases${qStr ? `?${qStr}` : ''}`);
}

/**
 * Simulate case triggers based on environmental sensors (Phase 2 Case Engine)
 */
export async function simulateCaseTrigger(payload) {
  return fetchJson('/cases/simulate-trigger', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * T25: Test unknown SHRUG key lookup with nearest suggestions
 */
export async function lookupShridCase(shrid) {
  return fetchJson(`/cases/data/lookup-shrid/${encodeURIComponent(shrid)}`);
}

/**
 * T26: Run duplicate settlement detection check
 */
export async function checkDuplicateSettlements() {
  return fetchJson('/cases/data/duplicate-check');
}

/**
 * T27: Check weather feed staleness & offline cache status
 */
export async function checkWeatherStaleness(hours = 7.2) {
  return fetchJson(`/cases/data/weather-staleness?hours=${hours}`);
}
