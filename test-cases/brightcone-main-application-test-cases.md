# Brightcone Main Application — Comprehensive Test Cases

## Application Coverage Summary
- **Public routes:** `/`, `/about`, `/pricing`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/hr`
- **Protected product routes:** `/chat`, `/crm`, `/report`
- **Protected HR routes:** `/hr/dashboard`, `/hr/companies`, `/hr/employees`, `/hr/attendance`, `/hr/leave`, `/hr/payslips`, `/hr/reports`, `/hr/profile`
- **Core backend surfaces inferred from frontend integrations:**
  - `/auth/register`
  - `/auth/login`
  - `/chat`
  - `/conversations`
  - `/profile`
  - `/leads`
  - `/email/logs`
  - `/email/report`
  - `/hr/auth/login`
  - `/hr/auth/register-company`
  - `/hr/auth/register-employee`

---

## Public Pages

### TC-PUB-001
- **Title:** Homepage renders hero, features, enterprise section, and CTA
- **Description:** Verify that the landing page loads core marketing content.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/`
  2. Observe the hero section
  3. Observe features and enterprise sections
  4. Observe CTA section
- **Expected Results:**
  - Hero text is visible
  - Feature cards are visible
  - Enterprise use cases are visible
  - CTA links are visible
- **Priority:** High
- **Test Type:** Functional

### TC-PUB-002
- **Title:** Homepage navigation routes correctly
- **Description:** Verify top-nav links route to appropriate public pages.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/`
  2. Click `Pricing`
  3. Return and click `About`
  4. Return and click `Sign in`
  5. Return and click `Get started`
- **Expected Results:**
  - User lands on `/pricing`, `/about`, `/login`, and `/register` respectively
- **Priority:** High
- **Test Type:** Regression

### TC-PUB-003
- **Title:** Theme toggle changes homepage theme state
- **Description:** Verify that dark mode toggle updates UI theme.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/`
  2. Click theme toggle
- **Expected Results:**
  - Theme switches successfully
  - Preference persists in localStorage if implemented
- **Priority:** Medium
- **Test Type:** Functional

### TC-PUB-004
- **Title:** About page renders mission, timeline, and team sections
- **Description:** Verify that About page content loads fully.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/about`
- **Expected Results:**
  - About hero renders
  - Mission section renders
  - Timeline renders
  - Team section renders
- **Priority:** Medium
- **Test Type:** Functional

### TC-PUB-005
- **Title:** Pricing page renders plans and CTA actions
- **Description:** Verify that pricing tiers and actions load correctly.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/pricing`
- **Expected Results:**
  - Starter, Pro, and Enterprise tiers are visible
  - Pricing CTAs are visible
- **Priority:** High
- **Test Type:** Functional

---

## Authentication

### TC-AUTH-001
- **Title:** Register page renders required inputs
- **Description:** Verify name, email, password, and submit button exist.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/register`
- **Expected Results:**
  - Required fields appear
  - Submit button appears
- **Priority:** High
- **Test Type:** Functional

### TC-AUTH-002
- **Title:** Successful registration routes to chat
- **Description:** Verify valid new-user registration completes successfully.
- **Preconditions:** Unique email available
- **Test Steps:**
  1. Open `/register`
  2. Fill valid details
  3. Submit
- **Expected Results:**
  - Account is created
  - Token is stored
  - User is routed to `/chat`
- **Priority:** High
- **Test Type:** Functional

### TC-AUTH-003
- **Title:** Duplicate registration shows error
- **Description:** Verify backend duplicate-email protection is surfaced in UI.
- **Preconditions:** Existing account email available
- **Test Steps:**
  1. Open `/register`
  2. Submit existing email
- **Expected Results:**
  - Error is shown
  - Registration does not complete
- **Priority:** High
- **Test Type:** Negative

### TC-AUTH-004
- **Title:** Login page renders correctly
- **Description:** Verify email/password fields and submit action load.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/login`
- **Expected Results:**
  - Email field appears
  - Password field appears
  - Continue button appears
- **Priority:** High
- **Test Type:** Functional

### TC-AUTH-005
- **Title:** Invalid login shows backend error message
- **Description:** Verify wrong credentials are rejected.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/login`
  2. Enter invalid email/password
  3. Submit
- **Expected Results:**
  - Error `Invalid email or password` appears
- **Priority:** High
- **Test Type:** Negative

### TC-AUTH-006
- **Title:** Protected chat redirects to login when unauthenticated
- **Description:** Verify route protection for chat.
- **Preconditions:** No token in localStorage
- **Test Steps:**
  1. Open `/chat`
- **Expected Results:**
  - User is redirected to `/login`
- **Priority:** High
- **Test Type:** Regression

### TC-AUTH-007
- **Title:** Protected CRM redirects to login when unauthenticated
- **Description:** Verify route protection for CRM.
- **Preconditions:** No token in localStorage
- **Test Steps:**
  1. Open `/crm`
- **Expected Results:**
  - User is redirected to `/login`
- **Priority:** High
- **Test Type:** Regression

### TC-AUTH-008
- **Title:** Protected report redirects to login when unauthenticated
- **Description:** Verify route protection for report page.
- **Preconditions:** No token in localStorage
- **Test Steps:**
  1. Open `/report`
- **Expected Results:**
  - User is redirected to `/login`
- **Priority:** High
- **Test Type:** Regression

---

## Chat

### TC-CHAT-001
- **Title:** Authenticated user can open chat shell
- **Description:** Verify chat page loads its main structure for authenticated users.
- **Preconditions:** Valid token exists
- **Test Steps:**
  1. Sign in
  2. Open `/chat`
- **Expected Results:**
  - Chat sidebar loads
  - Message composer is visible
  - Header shows chat state
- **Priority:** High
- **Test Type:** Functional

### TC-CHAT-002
- **Title:** New chat resets active conversation state
- **Description:** Verify New Chat clears message state.
- **Preconditions:** Authenticated user with existing conversations
- **Test Steps:**
  1. Open chat
  2. Click `New Chat`
- **Expected Results:**
  - Active conversation clears
  - Messages area resets
- **Priority:** Medium
- **Test Type:** Regression

### TC-CHAT-003
- **Title:** Sending message starts assistant response flow
- **Description:** Verify chat send action triggers streaming/response handling.
- **Preconditions:** Authenticated user in chat
- **Test Steps:**
  1. Enter a prompt
  2. Send message
- **Expected Results:**
  - User message appears
  - Assistant placeholder/response appears
- **Priority:** High
- **Test Type:** Functional

### TC-CHAT-004
- **Title:** Sign out from chat removes token and routes to login
- **Description:** Verify sign-out behavior from chat header.
- **Preconditions:** Authenticated user in chat
- **Test Steps:**
  1. Click `Sign out`
- **Expected Results:**
  - Token is removed
  - User lands on `/login`
- **Priority:** High
- **Test Type:** Regression

---

## CRM

### TC-CRM-001
- **Title:** Authenticated user can open CRM page
- **Description:** Verify CRM dashboard renders.
- **Preconditions:** Valid token exists
- **Test Steps:**
  1. Sign in
  2. Open `/crm`
- **Expected Results:**
  - `Lead Management` heading is visible
  - Analytics cards render
- **Priority:** High
- **Test Type:** Functional

### TC-CRM-002
- **Title:** Add lead modal can create a new lead
- **Description:** Verify lead creation flow from modal.
- **Preconditions:** Authenticated user on CRM page
- **Test Steps:**
  1. Click `Add Lead`
  2. Fill required fields
  3. Submit
- **Expected Results:**
  - Lead is added to table
  - Status defaults to `New`
- **Priority:** High
- **Test Type:** Functional

### TC-CRM-003
- **Title:** Search field filters leads
- **Description:** Verify search narrows visible results.
- **Preconditions:** Leads exist
- **Test Steps:**
  1. Enter text in search
- **Expected Results:**
  - Matching leads remain visible
- **Priority:** Medium
- **Test Type:** Regression

### TC-CRM-004
- **Title:** Status chip filters leads by stage
- **Description:** Verify status filter buttons work.
- **Preconditions:** Leads exist in multiple statuses
- **Test Steps:**
  1. Click a status chip
- **Expected Results:**
  - Only matching status leads are shown
- **Priority:** Medium
- **Test Type:** Regression

### TC-CRM-005
- **Title:** Lead row status dropdown updates lead state
- **Description:** Verify inline status update works.
- **Preconditions:** At least one lead exists
- **Test Steps:**
  1. Change status from dropdown
- **Expected Results:**
  - Lead status updates successfully
- **Priority:** High
- **Test Type:** Functional

### TC-CRM-006
- **Title:** Delete lead requires confirmation
- **Description:** Verify accidental deletion is prevented.
- **Preconditions:** At least one lead exists
- **Test Steps:**
  1. Click `Delete`
  2. Observe confirm/cancel UI
  3. Confirm deletion
- **Expected Results:**
  - Confirmation is required
  - Confirm removes lead
- **Priority:** High
- **Test Type:** Regression

### TC-CRM-007
- **Title:** Import leads modal accepts CSV-like rows
- **Description:** Verify lead import creates multiple leads.
- **Preconditions:** Authenticated user on CRM page
- **Test Steps:**
  1. Open `Import Leads`
  2. Paste valid rows
  3. Import
- **Expected Results:**
  - Leads are created
  - Import success state appears
- **Priority:** Medium
- **Test Type:** Functional

### TC-CRM-008
- **Title:** Email outreach modal validates bad email input
- **Description:** Verify invalid recipient email is rejected.
- **Preconditions:** Authenticated user on CRM page
- **Test Steps:**
  1. Open `Email Outreach`
  2. Enter invalid email
  3. Submit
- **Expected Results:**
  - Error appears
  - Email is not sent
- **Priority:** Medium
- **Test Type:** Negative

### TC-CRM-009
- **Title:** Outreach history tab renders logs or empty state
- **Description:** Verify outreach history tab loads correctly.
- **Preconditions:** Authenticated user on CRM page
- **Test Steps:**
  1. Switch to `Outreach History`
- **Expected Results:**
  - Either logs render or no-history state renders cleanly
- **Priority:** Medium
- **Test Type:** Functional

---

## Report Page

### TC-REP-001
- **Title:** Authenticated user can open report page
- **Description:** Verify report shell renders.
- **Preconditions:** Valid token exists
- **Test Steps:**
  1. Open `/report`
- **Expected Results:**
  - `Outreach Activity Report` is visible
- **Priority:** High
- **Test Type:** Functional

### TC-REP-002
- **Title:** Report page handles loading and empty/error states
- **Description:** Verify report page degrades gracefully.
- **Preconditions:** Authenticated user
- **Test Steps:**
  1. Open `/report`
  2. Observe loading -> success or error state
- **Expected Results:**
  - User sees valid loading or failure messaging
- **Priority:** Medium
- **Test Type:** Regression

---

## HR Portal

### TC-HR-001
- **Title:** HR login portal renders all top-level tabs
- **Description:** Verify HR entry page supports sign-in and both registration tabs.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/hr`
- **Expected Results:**
  - `Sign In`, `Register Company`, and `Register Employee` tabs appear
- **Priority:** High
- **Test Type:** Functional

### TC-HR-002
- **Title:** HR sign-in form renders required inputs
- **Description:** Verify login tab shows email/password and sign-in button.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/hr`
- **Expected Results:**
  - Email and password fields appear
  - `Sign In` button appears
- **Priority:** High
- **Test Type:** Functional

### TC-HR-003
- **Title:** Register Company tab renders company and admin fields
- **Description:** Verify company registration form structure.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/hr`
  2. Switch to `Register Company`
- **Expected Results:**
  - Company fields render
  - Admin fields render
- **Priority:** High
- **Test Type:** Functional

### TC-HR-004
- **Title:** Register Employee tab renders required inputs
- **Description:** Verify employee registration form structure.
- **Preconditions:** App is running
- **Test Steps:**
  1. Open `/hr`
  2. Switch to `Register Employee`
- **Expected Results:**
  - Employee fields render
  - Company ID field renders
- **Priority:** High
- **Test Type:** Functional

### TC-HR-005
- **Title:** Protected HR dashboard redirects unauthenticated users to HR login
- **Description:** Verify HR protected route behavior.
- **Preconditions:** No HR token/session exists
- **Test Steps:**
  1. Open `/hr/dashboard`
- **Expected Results:**
  - User is redirected to `/hr`
- **Priority:** High
- **Test Type:** Regression
