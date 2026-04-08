# Brightcone Main Application — Generated Test Cases

## Extracted Application Summary
- **Application:** Brightcone main web application
- **Primary public areas identified:** Home, Pricing, About, Login, Register
- **Primary protected area identified:** CRM
- **Core backend flows identified:** Auth (`/auth/register`, `/auth/login`), Leads CRUD (`/leads`), profile/chat/email support, protected routing
- **Key entities:** User, Lead, Email Log, Conversation
- **Important behavior:**
  - Unauthenticated users should be redirected away from protected CRM routes
  - Registration stores token and routes user into the product
  - Login returns token for valid credentials and shows error for invalid credentials
  - CRM lead creation defaults status to `New`
  - Lead search and status filtering are available in UI
  - Lead deletion requires explicit confirmation in UI

---

## Test Cases

### TC-HOME-001
- **Title:** Homepage renders hero section and top navigation
- **Description:** Verify that the public landing page renders its core marketing content and nav links.
- **Preconditions:** Application is running
- **Test Steps:**
  1. Open `/`
  2. Observe hero text and top navigation
- **Expected Results:**
  - Hero text is visible
  - Links for Pricing, About, Sign in, and Get started are visible
- **Priority:** High
- **Test Type:** Functional

### TC-HOME-002
- **Title:** Homepage CTA routes to registration
- **Description:** Verify that homepage CTA allows a user to start account creation.
- **Preconditions:** Application is running
- **Test Steps:**
  1. Open `/`
  2. Click `Get started`
- **Expected Results:**
  - User is routed to `/register`
- **Priority:** High
- **Test Type:** Functional

### TC-AUTH-001
- **Title:** Registration page renders required fields
- **Description:** Verify register page shows name, email, password, and submit controls.
- **Preconditions:** Application is running
- **Test Steps:**
  1. Open `/register`
- **Expected Results:**
  - Name field appears
  - Email field appears
  - Password field appears
  - `Create account` action is visible
- **Priority:** High
- **Test Type:** Functional

### TC-AUTH-002
- **Title:** Register a new user successfully
- **Description:** Verify a new user can register with valid unique credentials.
- **Preconditions:** Application is running and test email is unique
- **Test Steps:**
  1. Open `/register`
  2. Enter valid name, unique email, and password
  3. Submit registration
- **Expected Results:**
  - Registration succeeds
  - Auth token is stored
  - User is routed to `/chat`
- **Priority:** High
- **Test Type:** Functional

### TC-AUTH-003
- **Title:** Reject duplicate email during registration
- **Description:** Verify registration fails for an existing email.
- **Preconditions:** Existing user already registered
- **Test Steps:**
  1. Open `/register`
  2. Enter an already-registered email
  3. Submit registration
- **Expected Results:**
  - User remains on registration flow
  - Error message indicates email is already registered
- **Priority:** High
- **Test Type:** Negative

### TC-AUTH-004
- **Title:** Login page renders correctly
- **Description:** Verify login page shows email/password fields and action controls.
- **Preconditions:** Application is running
- **Test Steps:**
  1. Open `/login`
- **Expected Results:**
  - Email field appears
  - Password field appears
  - Continue button appears
  - Forgot password link appears
- **Priority:** High
- **Test Type:** Functional

### TC-AUTH-005
- **Title:** Invalid login shows proper error
- **Description:** Verify bad credentials are rejected.
- **Preconditions:** Application is running
- **Test Steps:**
  1. Open `/login`
  2. Enter invalid email/password
  3. Submit
- **Expected Results:**
  - Login fails
  - Error message shows `Invalid email or password`
- **Priority:** High
- **Test Type:** Negative

### TC-AUTH-006
- **Title:** Protected CRM route redirects unauthenticated users to login
- **Description:** Verify access control on protected frontend routes.
- **Preconditions:** No auth token in localStorage
- **Test Steps:**
  1. Open `/crm`
- **Expected Results:**
  - User is redirected to `/login`
- **Priority:** High
- **Test Type:** Regression

### TC-CRM-001
- **Title:** Authenticated user can open CRM dashboard
- **Description:** Verify CRM page loads after authentication.
- **Preconditions:** Valid user token exists
- **Test Steps:**
  1. Log in
  2. Open `/crm`
- **Expected Results:**
  - CRM page loads
  - Lead Management header is visible
- **Priority:** High
- **Test Type:** Functional

### TC-CRM-002
- **Title:** Add a new lead from CRM modal
- **Description:** Verify lead creation from UI.
- **Preconditions:** User is logged in on CRM page
- **Test Steps:**
  1. Click `Add Lead`
  2. Enter name and email
  3. Optionally enter company and value
  4. Submit
- **Expected Results:**
  - Lead is created
  - New lead appears in list
  - Lead status defaults to `New`
- **Priority:** High
- **Test Type:** Functional

### TC-CRM-003
- **Title:** Search filters visible leads
- **Description:** Verify text search narrows lead results.
- **Preconditions:** User is logged in and at least one lead exists
- **Test Steps:**
  1. Enter search text in search field
- **Expected Results:**
  - Only matching leads remain visible
- **Priority:** Medium
- **Test Type:** Regression

### TC-CRM-004
- **Title:** Status filter narrows results by lead stage
- **Description:** Verify filter chips work for lead status.
- **Preconditions:** User is logged in and leads exist in multiple statuses
- **Test Steps:**
  1. Click a status filter such as `Qualified`
- **Expected Results:**
  - Only leads in the selected status appear
- **Priority:** Medium
- **Test Type:** Regression

### TC-CRM-005
- **Title:** Change lead status from dropdown
- **Description:** Verify lead stage updates from the table.
- **Preconditions:** User is logged in and at least one lead exists
- **Test Steps:**
  1. Select a different status from the lead row dropdown
- **Expected Results:**
  - Lead status updates successfully
  - Updated status remains visible
- **Priority:** High
- **Test Type:** Functional

### TC-CRM-006
- **Title:** Delete lead requires explicit confirmation
- **Description:** Verify deletion is not immediate on first click.
- **Preconditions:** User is logged in and at least one lead exists
- **Test Steps:**
  1. Click `Delete` on a lead
  2. Observe confirmation controls
  3. Confirm deletion
- **Expected Results:**
  - First click shows confirmation state
  - Confirm removes the lead
- **Priority:** High
- **Test Type:** Regression

### TC-CRM-007
- **Title:** Import leads from CSV-style text
- **Description:** Verify import modal can create multiple leads.
- **Preconditions:** User is logged in on CRM page
- **Test Steps:**
  1. Open `Import Leads`
  2. Paste valid lead rows
  3. Import
- **Expected Results:**
  - New leads are added to the list
  - Success state is shown
- **Priority:** Medium
- **Test Type:** Functional

### TC-CRM-008
- **Title:** Invalid outreach email shows validation error
- **Description:** Verify email modal validates recipient address.
- **Preconditions:** User is logged in on CRM page
- **Test Steps:**
  1. Open `Email Outreach`
  2. Enter invalid recipient email
  3. Submit
- **Expected Results:**
  - Email is not sent
  - Validation error is shown
- **Priority:** Medium
- **Test Type:** Negative

### TC-CRM-009
- **Title:** Outreach history tab renders sent email log data
- **Description:** Verify outreach history can display backend-provided email logs.
- **Preconditions:** User is logged in and email logs exist
- **Test Steps:**
  1. Open CRM
  2. Switch to `Outreach History`
- **Expected Results:**
  - Email log table renders
  - Sent/failed status chips appear correctly
- **Priority:** Medium
- **Test Type:** Functional
