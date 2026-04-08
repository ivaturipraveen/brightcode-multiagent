# Brightcone Selenium Execution Notes

## Target
- Deployed UI: `https://code-ui.brightcone.ai`
- Deployed API: `https://code-api.brightcone.ai`

## Included Selenium Coverage (safe first slice)
- Homepage render
- About page render
- Pricing page render
- Login page render
- HR portal render
- Unauthenticated redirect behavior for chat, CRM, and report

## Why this slice first
These checks are stable and do not require seeded credentials, user creation cleanup, or destructive data setup.

## Next Selenium Expansion Candidates
- Register flow with unique test user
- Invalid login flow
- CRM authenticated shell tests
- Report authenticated shell tests
- HR auth tests with dedicated credentials
