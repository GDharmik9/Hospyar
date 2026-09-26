# GitHub Branch Protection & Sovereign Quality Gate Runbook

This runbook guides repository administrators on configuring GitHub branch protection rules for the `main` branch, enforcing automated checksum integrity, ESLint standards, test coverage, and preventing unreviewed code commits.

---

## 1. GitHub UI Branch Protection Configuration

1. In the GitHub repository, navigate to **Settings** > **Branches**.
2. Under **Branch protection rules**, click **Add branch ruleset** (or **Add rule**).
3. Set **Branch name pattern** to `main`.
4. Enable the following recommended protections:

| Setting                                                 | Value                              | Rationale                                          |
| ------------------------------------------------------- | ---------------------------------- | -------------------------------------------------- |
| **Require a pull request before merging**               | **Enabled**                        | Prevents direct, unreviewed pushes to `main`.      |
| **Required approvals**                                  | `1` (or `2` for production)        | Requires clinical & software peer review.          |
| **Dismiss stale approvals when new commits are pushed** | **Enabled**                        | Guarantees changes receive fresh review.           |
| **Require status checks to pass before merging**        | **Enabled**                        | Enforces CI pipeline passing before merge.         |
| **Require branches to be up to date before merging**    | **Enabled**                        | Prevents race conditions with concurrent merges.   |
| **Required status checks**                              | `Sovereign Branch Protection Gate` | Bound to `.github/workflows/ci.yml`.               |
| **Require conversation resolution before merging**      | **Enabled**                        | Ensures all review comments are addressed.         |
| **Require linear history**                              | **Enabled**                        | Maintains clean git history without merge commits. |
| **Do not allow bypassing the above settings**           | **Enabled**                        | Enforces rules even for repository owners/admins.  |

---

## 2. Local Enforcement via Husky Git Hooks

Hospyar uses **Husky** (`v9`) to enforce quality gates locally before code leaves developer machines:

### Pre-Commit Hook (`.husky/pre-commit`)

Triggers automatically on `git commit`. Runs **lint-staged**:

- TypeScript & React files: `eslint --fix` and `prettier --write`
- Config & Markdown: `prettier --write`

### Pre-Push Hook (`.husky/pre-push`)

Triggers automatically on `git push origin ...`. Validates 4 sovereign gates:

1. `node scripts/verify-checksums.mjs`: Verifies all tracked configurations, assets, and lockfiles against SHA-256 signatures in `scripts/checksums.json`.
2. `pnpm run lint`: Runs ESLint across all workspaces with `--max-warnings 0`.
3. `pnpm run test`: Executes pytest suites for clean architecture, atoms, and checksum integrity.
4. `pnpm run build`: Validates production bundle compilation across Turborepo packages.

---

## 3. Cryptographic Checksum System

To prevent supply-chain tampering and ensure sovereign health data governance (UAE PDPL & KSA PDPL), Hospyar computes and verifies deterministic SHA-256 hashes of critical project assets.

### Tracked Files

- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`
- `eslint.config.js`, `apps/web/tailwind.config.js`
- `apps/backend/requirements.txt`, `apps/backend/app/core/config.py`, `apps/backend/app/core/security.py`
- `packages/shared-types/src/index.ts`
- `apps/web/public/images/1.png`, `apps/web/public/images/4.png`

### Commands

```bash
# Verify checksums against the recorded manifest
pnpm run checksum:verify

# Regenerate manifest after approved dependency or config updates
pnpm run checksum:generate
```
