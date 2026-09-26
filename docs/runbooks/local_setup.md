# Runbook: Local Development Setup & Operations

## Prerequisites
* **Node.js**: >= 20.0.0
* **pnpm**: >= 9.0.0
* **Python**: >= 3.12
* **Git**: Installed

---

## 1. Fresh Clone & Setup

```bash
# Clone the repository
git clone <repo-url>
cd Hospyar

# Copy environment template
cp .env.example .env

# Install monorepo dependencies
pnpm install

# Install backend Python requirements (optional if using global python)
pip install -r apps/backend/requirements.txt
```

---

## 2. Running Local Services

```bash
# Start both Web and Backend API simultaneously via Turborepo
pnpm run dev
```

* **Web UI**: [http://localhost:3000](http://localhost:3000)
* **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend Health Endpoint**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 3. Running Builds & Tests

```bash
# Run Turborepo builds for all packages
pnpm run build

# Run automated backend test suites (pytest)
pnpm run test
```
