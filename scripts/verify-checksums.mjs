#!/usr/bin/env node
/**
 * Hospyar Sovereign Checksum Verifier
 * Verifies that critical configurations, lockfiles, and data contracts
 * match their recorded SHA-256 cryptographic signatures.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const manifestPath = path.join(__dirname, 'checksums.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`❌ Checksum manifest not found at ${manifestPath}. Run 'pnpm run checksum:generate' first.`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
let hasFailure = false;
let verifiedCount = 0;

console.log(`🛡️  Verifying Hospyar Checksum Manifest (${manifest.algorithm})...`);
console.log(`   Manifest Generated: ${manifest.generated_at}`);
console.log(`   Governance Standard: ${manifest.governance}\n`);

for (const [relPath, expectedHash] of Object.entries(manifest.files)) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`  ❌ MISSING: ${relPath}`);
    hasFailure = true;
    continue;
  }

  const content = fs.readFileSync(fullPath);
  const actualHash = crypto.createHash('sha256').update(content).digest('hex');

  if (actualHash !== expectedHash) {
    console.error(`  ❌ TAMPERED/MODIFIED: ${relPath}`);
    console.error(`     Expected: ${expectedHash}`);
    console.error(`     Actual:   ${actualHash}`);
    hasFailure = true;
  } else {
    console.log(`  ✓ ${relPath}`);
    verifiedCount++;
  }
}

if (hasFailure) {
  console.error('\n❌ Checksum verification failed! One or more tracked files have been modified without updating the manifest.');
  console.error("   To accept legitimate changes, run: pnpm run checksum:generate\n");
  process.exit(1);
}

console.log(`\n✅ All ${verifiedCount} files passed cryptographic SHA-256 checksum verification.\n`);
process.exit(0);
