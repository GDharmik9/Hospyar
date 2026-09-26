# ADR 001: Adoption of Turborepo Monorepo with Symmetrical Clean & Atomic Architecture

## Status
**Accepted**

## Context
Hospyar requires cross-platform delivery (Bilingual Web Dashboard with native Arabic RTL support, future mobile applications) bound to a high-performance Python FastAPI backend. Regional data governance mandates (UAE PDPL Federal Decree-Law No. 45, KSA PDPL) require zero cross-border data egress and verifiable source citation binding.

## Decision
1. **Monorepo Engine**: Use **Turborepo** with **pnpm workspaces** to coordinate builds, linting, and testing across `@hospyar/shared-types`, `@hospyar/ui`, `@hospyar/web`, and `@hospyar/backend`.
2. **Frontend Architecture**: Adopt **Atomic Design** (`atoms`, `molecules`, `organisms`, `templates`, `pages`, `hooks`) within `@hospyar/ui` and `@hospyar/web` to ensure reusability and clean visual hierarchy.
3. **Backend Architecture**: Adopt **Clean / Hexagonal Architecture** (`core`, `domain`, `services`, `use_cases`, `delivery`) in Python FastAPI to decouple domain logic from Snowflake and Cortex AI infrastructure.

## Consequences
- Single command execution (`pnpm run build`, `pnpm run test`, `pnpm run dev`) coordinates the entire stack.
- Clear contract boundary between TypeScript frontend and Python backend via shared DTO definitions.
- Strict isolation of sovereign logic within dedicated domain and use-case modules.
