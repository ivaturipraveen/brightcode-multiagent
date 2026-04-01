# MEMORY.md — Long-Term Rules & Lessons

## 🚨 CRITICAL: Git Push Workflow (NON-NEGOTIABLE)

**NEVER push without asking the user first — unless they explicitly told you where to push.**

After ALL tests pass, STOP and ask:

> "Ready to push. Should I:
> A) Create branch `fix/<name>` and open a PR?
> B) Push directly to main?"

Wait for user response. Do NOT commit or push until they answer.

**Only skip this step if:**
- User said "push to main" → push to main directly
- User named a branch → use that branch, create PR

**This rule has been broken multiple times. Never again.**

---

## 👥 Agent Attribution (NON-NEGOTIABLE)

Every response MUST clearly state which agent handled what. Never say "I did X."

| Agent | Role |
|---|---|
| SAM | Orchestrator — routing, git, deploy |
| ALEX | Frontend — `frontend/` React/TypeScript/UI |
| JORDAN | Backend — `backend/` FastAPI/DB/APIs |
| RILEY | QA — `tests/` pytest |

Every completion summary MUST include a `### 👥 Agent Assignments` section listing all 4 agents and what each one did (or "Not involved").

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

## 📌 Project Info

- **Repo:** git@github.com:ivaturipraveen/brightcode-multiagent.git
- **Frontend UI:** https://code-ui.brightcone.ai
- **Backend API:** https://code-api.brightcone.ai
- **Working dir:** /home/ubuntu/openclaw-multiagent
- **Tests:** `python3 -m pytest tests/backend/ -v`
- **Deploy:** `bash deploy/deploy.sh`
