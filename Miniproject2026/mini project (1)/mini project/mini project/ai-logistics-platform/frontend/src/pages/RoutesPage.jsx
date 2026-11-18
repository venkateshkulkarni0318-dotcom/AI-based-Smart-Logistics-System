import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import MapView from '../components/MapView';
import RiskPanel from '../components/RiskPanel';
import RoutePanel from '../components/RoutePanel';
import AlternateRoutesTable from '../components/AlternateRoutesTable';
import ElevationTransect from '../components/ElevationTransect';
import DestinationDrawer from '../components/DestinationDrawer';
import { getVillages, getRiskAssessment, getActiveRoutes, optimizeRoute } from '../services/api';

const RoutesPage = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [optimizationSummary, setOptimizationSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [villagesRes, riskRes, routesRes] = await Promise.allSettled([
          getVillages(),
          getRiskAssessment(),
          getActiveRoutes()
        ]);

        if (villagesRes.status === 'fulfilled' && villagesRes.value?.data) {
          setVillages(villagesRes.value.data);
          if (villagesRes.value.data.length > 0) setSelectedVillage(villagesRes.value.data[0]);
        }

        if (riskRes.status === 'fulfilled' && riskRes.value?.data) {
          setRiskData(riskRes.value.data);
        }

        if (routesRes.status === 'fulfilled' && routesRes.value?.routes) {
          setRoutes(routesRes.value.routes);
        }
      } catch (err) {
        console.error('Failed to load route data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelectVillage = (village) => {
    setSelectedVillage(village);
    setDrawerOpen(true);
  };

  const handleOptimize = async () => {
    try {
      const payload = {
        destinationVillageIds: villages.slice(0, 5).map(v => v.id),
        preferredMode: 'hybrid',
        riskThreshold: 60
      };
      const res = await optimizeRoute(payload);
      if (res?.success && res.summary) {
        setOptimizationSummary(res.summary);
        setRoutes(prev => prev.map(r => ({
          ...r,
          status: 'AI Optimized (Zero Disruption)',
          estimatedDuration: res.summary.estimatedDuration,
          totalDistanceKm: res.summary.roadDistanceKm
        })));
      }
    } catch (err) {
      console.error('Optimization error:', err);
    }
  };

  return (
    <PageLayout
      title="Route Intelligence & Optimization"
      subtitle="Geospatial operations map with real-time routing, SRTM elevation gradients & AI dispatch directives"
      badge="Objective 04"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
          gap: '1.25rem',
          alignItems: 'start'
        }}>
          {/* Map View */}
          <MapView
            villages={villages}
            selectedVillage={selectedVillage}
            onSelectVillage={handleSelectVillage}
            routes={routes}
          />

          {/* Side Panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <RiskPanel riskData={riskData} selectedVillage={selectedVillage} />
            <RoutePanel
              routes={routes}
              onOptimize={handleOptimize}
              optimizationSummary={optimizationSummary}
            />
          </div>
        </div>

        {/* Phase 3: Multi-Criteria Alternative Routing Trade-Offs (Fastest / Safest / Cheapest / Greenest) */}
        <AlternateRoutesTable />

        {/* SRTM Topographic Cross-Sectional Transect */}
        <ElevationTransect initialCorridor="corridor-himalaya" />

        {/* Slide-in Destination Drawer */}
        {drawerOpen && (
          <DestinationDrawer
            village={selectedVillage}
            onClose={() => setDrawerOpen(false)}
            riskData={riskData}
            onOptimizeRoute={handleOptimize}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default RoutesPage;
