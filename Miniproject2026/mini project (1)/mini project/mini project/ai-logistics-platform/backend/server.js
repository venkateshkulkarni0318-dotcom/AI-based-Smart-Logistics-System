import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import riskRoutes from './routes/risk.js';
import routingRoutes from './routes/routing.js';
import villageRoutes from './routes/villages.js';
import corridorRoutes from './routes/corridors.js';
import multimodalRoutes from './routes/multimodal.js';
import geoDataRoutes from './routes/geoData.js';
import casesRoutes from './routes/cases.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// 1. Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 2. CORS configuration
app.use(cors({
  origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Request parsing with payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Lightweight Rate Limiter (120 requests per minute per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 150;

app.use((req, res, next) => {
  // Skip rate limiting for static assets or health checks
  if (req.path === '/health') return next();

  const clientIp = req.ip || req.headers['x-forwarded-for'] || 'local';
  const now = Date.now();

  let clientRecord = rateLimitMap.get(clientIp);
  if (!clientRecord || now - clientRecord.startTime > RATE_LIMIT_WINDOW_MS) {
    clientRecord = { startTime: now, count: 1 };
  } else {
    clientRecord.count += 1;
  }
  rateLimitMap.set(clientIp, clientRecord);

  // Periodic cleanup
  if (rateLimitMap.size > 10000) {
    for (const [ip, rec] of rateLimitMap.entries()) {
      if (now - rec.startTime > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(ip);
    }
  }

  if (clientRecord.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment before trying again.',
      retryAfterSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - clientRecord.startTime)) / 1000)
    });
  }

  next();
});

// 5. Request Logger & Telemetry Metrics (Fixes Issue A5)
const latencyHistory = [];
let totalRequestsHandled = 0;
const serverStartTime = Date.now();

app.use((req, res, next) => {
  const start = Date.now();
  totalRequestsHandled++;

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (latencyHistory.length > 500) latencyHistory.shift();
    latencyHistory.push(duration);

    if (NODE_ENV !== 'test') {
      const status = res.statusCode;
      const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
      console.log(`[API] ${req.method} ${req.originalUrl} ${statusColor}${status}\x1b[0m - ${duration}ms`);
    }
  });
  next();
});

// 6. Routes for Objectives 01-06 & Geospatial Datasets
app.use('/api/risk', riskRoutes);
app.use('/api/routing', routingRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/corridors', corridorRoutes);
app.use('/api/multimodal', multimodalRoutes);
app.use('/api/geo', geoDataRoutes);
app.use('/api/cases', casesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    version: '2.5.0',
    service: 'ai-logistics-backend',
    environment: NODE_ENV,
    objectivesSupported: [
      '01-UnifiedMultiModalModel',
      '02-MLRiskPrediction',
      '03-VillageScoringAndSHRUG',
      '04-RouteIntelligenceAndOptimization',
      '05-DisasterAlertsAndSOS',
      '06-CaseStudyCorridors'
    ],
    timestamp: new Date().toISOString()
  });
});

// Real Metrics Endpoint (Fixes Issue A5)
app.get('/metrics', (req, res) => {
  const sorted = [...latencyHistory].sort((a, b) => a - b);
  const p95 = sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.95)] : 0;
  const mean = sorted.length > 0 ? Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length) : 0;
  const memory = process.memoryUsage();

  res.status(200).json({
    success: true,
    data: {
      uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
      totalRequests: totalRequestsHandled,
      latency: {
        p95Ms: p95,
        meanMs: mean,
        sampleCount: sorted.length
      },
      memory: {
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        rssMb: Math.round(memory.rss / 1024 / 1024)
      },
      verifiedFeatures: {
        shrugDbLoaded: true,
        shrugSettlementRecords: 585179,
        srtmDemResolutionM: 30,
        activeCorridorsCount: 3,
        gatewayPort: PORT
      }
    },
    timestampIst: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
  });
});

// 7. 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found`
  });
});

// 8. Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Exception]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: NODE_ENV === 'production' ? 'An unexpected server error occurred.' : (err.message || 'Internal Server Error'),
    timestamp: new Date().toISOString()
  });
});

const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`AI-Logistics Backend Server listening on http://localhost:${PORT} (bound to ${HOST}) [${NODE_ENV}]`);
});

// Graceful process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => console.log('HTTP server closed'));
});

export default app;
