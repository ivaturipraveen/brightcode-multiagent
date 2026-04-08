---
name: context-aware-test-case-generation-safe-execution
description: Generate test cases from uploaded PDFs with strict context validation and safe execution boundaries. Use when a user uploads a PDF or other requirements document and asks for test case generation, Selenium script generation, or test execution, especially when you must decide whether the document is related to the current repository/application or should be handled as isolated ad-hoc work.
---

# Context-Aware Test Case Generation & Safe Execution

Follow these requirements exactly when handling uploaded requirement documents, especially PDFs, for test generation or execution.

## Requirements

### 1. PDF Input Handling

When a user uploads a PDF and requests test case generation:

- Parse the document.
- Extract requirements, workflows, pages, roles, endpoints, validations, or features.
- Generate structured test cases from the extracted content.

### 2. Context Validation (Important)

Before proceeding, check whether the uploaded document is related to the current application/repository.

Use repository evidence instead of guesswork. Compare the document against the current codebase using:
- application or product name
- modules, features, and workflows
- route names, page names, and endpoint names
- UI labels, roles, and business terms
- architecture or domain concepts that clearly match the repository

Then classify the document as one of:
- **Related**
- **Unrelated**
- **Uncertain**

If the document is **related**:
- Proceed with the normal flow.
- Generate test cases and integrate with the system/repo as appropriate for the user request.

If the document is **not related**:
- Do **not** interfere with the main application or existing repository.
- Handle all operations locally in an isolated manner.

If the status is **uncertain**:
- Say that explicitly.
- Default to isolated handling unless the user clarifies otherwise.

### 3. Local Execution for Unrelated Documents

For unrelated or external documents:

- Generate test cases locally.
- Generate Selenium scripts locally if requested.
- Do **not** push or modify existing project files by default.
- Keep execution sandboxed so the main system is not impacted.

Use a clearly isolated folder such as:
- `external-test-cases/`
- `adhoc-tests/`
- or another clearly separate folder requested by the user

Keep unrelated outputs inside that isolated area, including:
- extracted notes
- generated test cases
- generated Selenium scripts
- execution logs

### 4. Optional GitHub Push (User Controlled)

Only if the user explicitly requests to push unrelated-document outputs:

- Create a dedicated folder such as `/external-test-cases/` or `/adhoc-tests/`.
- Add generated files only inside that folder.
- Commit with a clear message such as:
  - `Added test cases from external/unrelated document`
- Ensure no existing files are overwritten.

Do not mix unrelated work into normal application folders unless the user explicitly asks and the separation remains clear.

### 5. Test Execution Capability

If the user requests test execution:

- Set up the required environment locally.
- Install dependencies if needed.
- Execute tests in isolation when the document is unrelated.
- Use the repository’s normal environment only when the document is related.
- Provide execution results, including pass/fail logs and errors.

### 6. Safety & Isolation

Maintain strict separation between:
- application-related work
- ad-hoc or external user requests

For unrelated inputs:
- never impact the main application by default
- never overwrite existing project files
- never repurpose the main test structure for ad-hoc work
- prefer isolated folders, isolated environments, and local-only execution

### 7. Output Expectations

Always state clearly:

1. **Whether the document is related or unrelated**
2. **Why that classification was chosen**
3. **Whether actions were local/isolated or repo-integrated**
4. **What was generated**
   - test cases
   - Selenium scripts
   - notes/logs
5. **Execution results**, if tests were run
   - pass/fail summary
   - key errors
   - important setup notes

Use direct phrasing such as:
- `Document status: related to the current application.`
- `Document status: unrelated to the current repository; handling in isolated local mode.`

## Default Safety Rule

If the document is not clearly related to the current application/repository, isolate the work.

Isolation is the default safe fallback.
