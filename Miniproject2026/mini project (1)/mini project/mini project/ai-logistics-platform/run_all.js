#!/usr/bin/env node
/**
 * AI-LOGIX Unified Orchestrator Script (Phase 6 Requirement)
 * Launches all 3 services concurrently with unified stdout/stderr logging:
 * 1. Node Gateway (:5050)
 * 2. Python ML Service (:8000)
 * 3. Vite Frontend (:5173)
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const defaultPythonCmd = isWindows ? 'python' : 'python3';

const venvPythonWin = path.join(__dirname, 'ml-service', '.venv', 'Scripts', 'python.exe');
const venvPythonUnix = path.join(__dirname, 'ml-service', '.venv', 'bin', 'python');
let resolvedPythonCmd = defaultPythonCmd;
if (isWindows && fs.existsSync(venvPythonWin)) {
  resolvedPythonCmd = path.join('.venv', 'Scripts', 'python.exe');
} else if (!isWindows && fs.existsSync(venvPythonUnix)) {
  resolvedPythonCmd = path.join('.venv', 'bin', 'python');
}

const services = [
  {
    name: 'BACKEND',
    color: '\x1b[36m', // Cyan
    command: 'node',
    args: ['server.js'],
    cwd: path.join(__dirname, 'backend')
  },
  {
    name: 'ML-SERVICE',
    color: '\x1b[35m', // Magenta
    command: resolvedPythonCmd,
    args: ['main.py'],
    cwd: path.join(__dirname, 'ml-service')
  },
  {
    name: 'FRONTEND',
    color: '\x1b[32m', // Green
    command: npmCmd,
    args: ['run', 'dev'],
    cwd: path.join(__dirname, 'frontend')
  }
];

const resetColor = '\x1b[0m';
const children = [];

console.log('\x1b[1m\x1b[34m=======================================================');
console.log('  🚀 AI-LOGIX MULTI-MODAL LOGISTICS PLATFORM');
console.log('  Starting all services in unified offline mode...');
console.log('=======================================================\x1b[0m\n');

services.forEach((s) => {
  const child = spawn(s.command, s.args, {
    cwd: s.cwd,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1', PYTHONUNBUFFERED: '1' }
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${s.color}[${s.name}]${resetColor} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${s.color}[${s.name} ERROR]${resetColor} ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${s.color}[${s.name}]${resetColor} Process exited with code ${code}`);
  });

  children.push(child);
});

function cleanup() {
  console.log('\n\x1b[33m🛑 Gracefully terminating all AI-Logix services...\x1b[0m');
  children.forEach((child) => {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', child.pid, '/f', '/t']);
      } else {
        child.kill('SIGTERM');
      }
    } catch {}
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
