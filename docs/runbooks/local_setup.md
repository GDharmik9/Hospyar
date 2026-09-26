# Runbook: Local Development Setup & Operations

This runbook provides complete, step-by-step instructions for bootstrapping, running, linting, testing, and verifying the **Hospyar** monorepo on a local development machine.

---

## 1. System Prerequisites

Ensure the following tools are installed on your host system:

| Dependency  | Minimum Version                              | Verification Command | Purpose                                 |
| ----------- | -------------------------------------------- | -------------------- | --------------------------------------- |
| **Node.js** | `>= 20.0.0` (Recommended `v20.x` or `v22.x`) | `node -v`            | JavaScript runtime for Vite & Turborepo |
| **pnpm**    | `>= 9.0.0` (Recommended `9.15.0`)            | `pnpm -v`            | Monorepo workspace package manager      |
| **Python**  | `>= 3.12`                                    | `python --version`   | FastAPI backend & Pytest test suites    |
| **Git**     | `>= 2.30.0`                                  | `git --version`      | Version control & Husky git hooks       |

> [!NOTE]
> On Windows systems, ensure PowerShell execution policy allows local scripts, or use Git Bash / standard PowerShell.

---

## 2. Step-by-Step Initial Setup

### Step 2.1: Clone the Repository

```bash
git clone https://github.com/GetLiveSeed/Hospyar.git
cd Hospyar
```

### Step 2.2: Configure Environment Variables

Copy the template `.env.example` into `.env` at the root directory:

```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

Key variables include:

- `SOVEREIGN_CLOUD_REGION=UAE-CENTRAL-1` (Enforces zero cross-border data egress)
- `SNOWFLAKE_CORTEX_HOST=https://hospyar-sovereign.snowflakecomputing.com`
- `FASTAPI_HOST=0.0.0.0`, `FASTAPI_PORT=8000`
- `VITE_PORT=3000`

### Step 2.3: Install Monorepo Dependencies

Install all packages across the workspace with `pnpm`:

```bash
pnpm install
```

This automatically runs `pnpm run prepare` to install the **Husky** git hooks in `.husky/`.

### Step 2.4: Install Backend Python Dependencies

Install required packages for the FastAPI backend and test suite:

```bash
# Optional: create and activate a Python virtual environment
python -m venv .venv

# Activate venv:
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# Install requirements
pip install -r apps/backend/requirements.txt
```

---

## 3. Cryptographic Checksum Integrity

Hospyar tracks SHA-256 cryptographic signatures for 15 critical configuration files, lockfiles, and data contracts to prevent supply-chain tampering and maintain UAE/KSA PDPL compliance:

### Verify Checksums

Run the verification script before starting work:

```bash
pnpm run checksum:verify
```

If all files match, you will receive:

```text
✅ All 15 files passed cryptographic SHA-256 checksum verification.
```

### Regenerate Checksums Manifest

If you intentionally modify `package.json`, `pnpm-lock.yaml`, `turbo.json`, or backend security files:

```bash
pnpm run checksum:generate
```

This updates [`scripts/checksums.json`](file:///d:/projects-bhim/Hospyar/scripts/checksums.json).

---

## 4. Code Quality & Linting (ESLint)

Hospyar enforces zero-warning TypeScript and React standards using ESLint Flat Config (`eslint.config.js`):

```bash
# Run ESLint check across all workspaces (fails if any error or warning is found)
pnpm run lint

# Automatically fix autofixable lint and formatting errors
pnpm run lint:fix

# Format all files with Prettier
pnpm run format
```

---

## 5. Running Automated Tests

Run the automated test suites to ensure both backend and frontend contracts are intact:

```bash
# Run all workspace test suites through Turborepo
pnpm run test

# Or run pytest directly against the backend
python -m pytest
```

The test suite validates:

- `test_atoms_molecules_organisms.py`: Verification of domain structures and routing.
- `test_clean_architecture.py`: Verification of hexagonal layer boundaries.
- `test_checksum_integrity.py`: Verification of canonical JSON checksums and tamper detection.

---

## 6. Starting Development Servers

Launch both the frontend web application and backend API concurrently using Turborepo:

```bash
pnpm run dev
```

### Local Service URLs

| Service                      | URL                                                          | Description                                               |
| ---------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| **Patient 360 Web UI**       | [http://localhost:3000](http://localhost:3000)               | React 19 UI (Patient 360, Copilot Chat, Timeline, Claims) |
| **FastAPI Interactive Docs** | [http://localhost:8000/docs](http://localhost:8000/docs)     | Swagger OpenAPI UI for testing REST endpoints             |
| **Alternative API Docs**     | [http://localhost:8000/redoc](http://localhost:8000/redoc)   | ReDoc interface                                           |
| **Sovereign Health Check**   | [http://localhost:8000/health](http://localhost:8000/health) | Verifies sovereign zone & operational status              |

---

## 7. Building for Production

Compile all workspace applications and libraries to validate production bundles:

```bash
pnpm run build
```

Build outputs:

- `apps/web/dist/`: Static assets, bundled JavaScript, and CSS ready for edge/CDN hosting.
- `packages/shared-types/`: Verified TypeScript declarations.
- `packages/ui/`: Verified component library.

---

## 8. Git Commit & Push Workflow (Husky Quality Gates)

Hospyar enforces automated quality gates via **Husky**:

### On `git commit` (Pre-Commit Hook)

- Executes `lint-staged`.
- Automatically runs `eslint --fix` and `prettier --write` on staged files.

### On `git push` (Pre-Push Hook)

- Executes the 4-Gate Sovereign Pipeline:
  1. `[1/4]` Verifies SHA-256 Checksums (`pnpm run checksum:verify`)
  2. `[2/4]` Runs ESLint across workspaces (`pnpm run lint`)
  3. `[3/4]` Runs automated Pytest suites (`pnpm run test`)
  4. `[4/4]` Validates Turborepo build (`pnpm run build`)
- If any gate fails, the push is safely blocked locally to protect the `main` branch.

---

## 9. Troubleshooting & Common Issues

### Issue 1: `Port 3000 or 8000 already in use`

- **Cause**: A previous dev server process is still running in the background.
- **Fix (Windows PowerShell)**:
  ```powershell
  # Find PID for port 8000 or 3000:
  Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess
  Stop-Process -Id <PID> -Force
  ```
- **Fix (Linux / macOS)**:
  ```bash
  kill -9 $(lsof -t -i:8000)
  ```

### Issue 2: `Checksum verification failed`

- **Cause**: A tracked configuration file (`package.json`, `pnpm-lock.yaml`, etc.) was modified without updating the manifest.
- **Fix**: If the changes are intentional and reviewed, run:
  ```bash
  pnpm run checksum:generate
  ```

### Issue 3: `ModuleNotFoundError: No module named 'app'` when running pytest

- **Cause**: Pytest invoked outside the backend directory without `pythonpath` set.
- **Fix**: Both root and backend `pytest.ini` files have `pythonpath = apps/backend` configured. Ensure you run `python -m pytest` from the root or inside `apps/backend`.
