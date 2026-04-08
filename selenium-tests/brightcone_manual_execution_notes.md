# Brightcone QA Execution Notes

## Scope
These test cases target the actual Brightcone main application in this repository, not the previously uploaded shopping PDF domain.

## Current Runnable Coverage
Best current runnable smoke coverage in this repo/environment:
- Homepage render
- Register page render
- Login invalid credentials behavior
- Protected route redirect behavior

## Current Environment Notes
- Frontend can run locally on `http://127.0.0.1:3000`
- Backend auth/leads endpoints exist and database config is present
- Selenium browser launch is currently blocked in this runtime by Chrome session creation issues

## Recommended Next Runner Strategy
If execution is required in this exact environment, prefer:
- Playwright smoke tests for browser automation here
or
- Selenium on a machine with stable Chrome/ChromeDriver pairing
