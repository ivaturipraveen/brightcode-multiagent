# Generated Selenium Artifact Notes — Online Shopping Web Application

## Source
- PDF: `/tmp/openclaw_uploads/Testcases.pdf`
- Generated from extracted functional requirements only

## Important Notes
- These Selenium tests are intentionally kept separate from the current application runtime code.
- They were generated as QA artifacts and stored only under `/selenium-tests/`.
- Selectors are inferred placeholders because the source PDF does not define actual DOM structure.
- Before execution against a real application, align:
  - routes
  - element locators
  - expected success/error messages
  - payment failure trigger data

## Suggested Execution
- Framework: `pytest + selenium`
- Browser target: Chrome first, then Edge per requirement doc
- Base URL should be injected via environment variable:
  - `BASE_URL=http://localhost:3000 pytest selenium-tests/testcases-online-shopping-web-application_pytest_selenium.py -v`

## Coverage Included
- Registration
- Duplicate email validation
- Password validation
- Login success/failure
- Product browsing
- Category filtering
- Cart add/update/remove
- Out-of-stock handling
- Checkout success/failure
- Logout/session clearing
