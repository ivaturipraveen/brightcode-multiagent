# MEMORY.md — Long-Term Rules & Lessons

## 🚨 CRITICAL: Git / PR Workflow (NON-NEGOTIABLE)

**ALWAYS create a PR. Never push directly to main.**

Mandatory flow for every task:

1. **Branch** — create `feat/<name>` or `fix/<name>`
2. **Commit** — commit all changes to that branch
3. **Push + PR** — open a GitHub PR with a clear description
4. **Review comments** — add inline PR comments explaining key decisions / changes
5. **Address reviews** — if the user (or CI) leaves review comments, fix them and push to the same branch
6. **Deploy** — only after PR is approved / user says to merge

**No exceptions. Never push to main directly. Never skip the PR step.**

This rule was violated multiple times before. It is now the default for ALL tasks.

---

## 👥 Agent Attribution (NON-NEGOTIABLE)

Every response MUST start with **SAM 🧭** announcing the task and which agent is handling it BEFORE any work begins.

Format at the START of every task response:
> **SAM 🧭** — Received: `[task]`. Routing to **[AGENT NAME]**.
> **[AGENT] [emoji]** — [what I'm doing]

| Agent | Role | Emoji |
|---|---|---|
| SAM | Orchestrator — routing, git, deploy | 🧭 |
| ALEX | Frontend — `frontend/` React/TypeScript/UI | 🎨 |
| JORDAN | Backend — `backend/` FastAPI/DB/APIs | ⚙️ |
| RILEY | QA — `tests/` pytest | 🧪 |

Every completion summary MUST include a `### 👥 Agent Assignments` section listing all 4 agents and what each one did (or "Not involved").

**This rule has been broken multiple times. Never again. No exceptions.**

---

## 📋 Mandatory Task Completion Format (SAM.md)

Every task response MUST follow this exact format — no exceptions:

```
### ✅ Changes Made
- **[AGENT] FILE:** `<filepath>`
  - What changed and why

### 🧪 Tests
- `<test name>` — PASS ✅ / FAIL ❌
- Final count: X passed, Y failed, Z skipped

### 📦 Git
- Branch: `<branch>`
- Commit: `<hash>` — `<message>`
- Push: `<remote push output line>`

### 🚀 Deploy
- Script: `deploy/deploy.sh`
- Output: <last line>
- Status: ✅ Deployed / ❌ Failed

### ❓ Pending Questions (only if needed)
```

---

## 🧪 RILEY Must Always Write Tests (NON-NEGOTIABLE)

**Every feature task MUST include Selenium integration tests — no exceptions.**

- RILEY writes tests for every new page/feature before the task is marked done
- Tests must be committed in the same branch as the feature
- If tests can't run (no live URL yet), write them anyway and document the target URL
- Never mark RILEY as "Not involved" for any frontend feature
- Tests go in `tests/selenium/` or `tests/frontend/`

**Missed on BART transit portal (#19). Never again.**

---

## 📌 Project Info

- **Repo:** git@github.com:ivaturipraveen/brightcode-multiagent.git
- **Frontend UI:** https://www.wowfinedining.com
- **Backend API:** https://openclaw-multiagent.onrender.com
- **Working dir:** /home/ubuntu/openclaw-multiagent
- **Tests:** `python3 -m pytest tests/backend/ -v`
- **Deploy:** `bash deploy/deploy.sh`
