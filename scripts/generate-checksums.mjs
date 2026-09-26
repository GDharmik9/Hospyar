#!/usr/bin/env node
/**
 * Hospyar Sovereign Checksum Generator
 * Computes deterministic SHA-256 hashes of critical project configurations,
 * lockfiles, sovereign data contracts, and assets.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// List of critical files subject to sovereign checksum verification
const TRACKED_FILES = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'turbo.json',
  'eslint.config.js',
  'apps/web/package.json',
  'apps/web/tailwind.config.js',
  'apps/web/public/images/1.png',
  'apps/web/public/images/4.png',
  'apps/backend/requirements.txt',
  'apps/backend/app/core/config.py',
  'apps/backend/app/core/security.py',
  'packages/shared-types/package.json',
  'packages/shared-types/src/index.ts',
  'packages/ui/package.json'
];

function computeFileHash(relPath) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relPath}`);
  }
  const content = fs.readFileSync(fullPath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

console.log('🔒 Generating Hospyar Sovereign Checksum Manifest (SHA-256)...');

const manifest = {
  version: '1.0.0',
  algorithm: 'SHA-256',
  generated_at: new Date().toISOString(),
  governance: 'UAE PDPL & KSA PDPL Sovereign Verification',
  files: {}
};

for (const file of TRACKED_FILES) {
  try {
    const hash = computeFileHash(file);
    manifest.files[file] = hash;
    console.log(`  ✓ ${file}: ${hash.slice(0, 16)}...`);
  } catch (err) {
    console.warn(`  ⚠️ Skipped ${file}: ${err.message}`);
  }
}

const outputPath = path.join(__dirname, 'checksums.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

console.log(`\n✅ Saved checksum manifest to ${path.relative(rootDir, outputPath)} (${Object.keys(manifest.files).length} files tracked).\n`);
