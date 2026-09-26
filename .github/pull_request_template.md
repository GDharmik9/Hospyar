## Description

<!-- Provide a brief summary of changes introduced in this PR -->

## Affected Modules

- [ ] `packages/shared-types`
- [ ] `packages/ui` (Atoms / Molecules / Organisms)
- [ ] `apps/web` (Frontend Pages / Hooks / Services)
- [ ] `apps/backend` (Core / Domain / Use Cases / Services / Delivery)
- [ ] `docs/` (Architecture / ADR / Runbooks)
- [ ] `scripts/` (Checksums / Tooling)

## Compliance & Governance Checklist

- [ ] UAE PDPL Federal Decree-Law No. 45 & KSA PDPL data residency verified
- [ ] Zero cross-border data egress maintained
- [ ] All LLM assertions bound to verifiable `[CIT-xxx]` citation anchors
- [ ] Cryptographic audit logger and SHA-256 checksum integrity preserved
- [ ] Bilingual RTL (Arabic) / LTR (English) layout verified

## Quality & Protection Gates

- [ ] `pnpm run checksum:verify` passed (SHA-256 cryptographic manifest verified)
- [ ] `pnpm run lint` passed with 0 errors and 0 warnings (ESLint)
- [ ] `pnpm run test` passes without failures (Pytest & TypeScript)
- [ ] `pnpm run build` succeeds across all packages (Turborepo)
