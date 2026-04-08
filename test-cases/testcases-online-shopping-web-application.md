# Generated Test Cases — Online Shopping Web Application

## Extracted Requirement Summary
- **Document:** `Testcases.pdf`
- **Detected domain:** Online shopping web application
- **User roles identified:** Guest User, Registered User, Admin
- **Major workflows identified:**
  - User registration
  - User login
  - Product browsing and filtering
  - Add to cart / cart management
  - Checkout and payment confirmation
  - Logout / session termination
- **Key entities identified:** User, Product, Category, Cart, Order, Payment, Session
- **Important business rules identified:**
  - Email must be unique during registration
  - Password must be at least 8 characters
  - Invalid credentials must show an error
  - Successful login redirects to dashboard
  - Product listing must show name, price, and image
  - Cart must show product name, quantity, and total price
  - User can update quantity or remove items from cart
  - Checkout requires shipping address and payment details
  - Order confirmation is shown after successful payment
  - Logout must clear the active session
- **Non-functional notes:**
  - Target load time within 3 seconds
  - Browser support: Chrome and Edge
  - Secure password handling required
- **Assumptions from document:**
  - Payment gateway is mocked
  - Inventory is preloaded
- **Clarifications still useful for real automation later:**
  - Actual field ids/names/selectors are not provided
  - Exact dashboard URL/route is not defined
  - Exact cart/checkout page structure is not defined
  - Stock handling UI for out-of-stock items is not specified

---

## Test Cases

### TC-REG-001
- **Title:** Register a new user with valid details
- **Description:** Verify that a user can register using a valid name, unique email, and password that meets minimum length.
- **Preconditions:**
  - Registration page is accessible
  - Email is not already registered
- **Test Steps:**
  1. Open the registration page
  2. Enter a valid name
  3. Enter a unique email address
  4. Enter a password with at least 8 characters
  5. Submit the registration form
- **Expected Results:**
  - Registration succeeds
  - User account is created
  - User is redirected or shown a successful registration state
- **Priority:** High
- **Test Type:** Functional

### TC-REG-002
- **Title:** Reject registration with duplicate email
- **Description:** Verify that registration fails when the email address already exists.
- **Preconditions:**
  - An account already exists with the email used in the test
- **Test Steps:**
  1. Open the registration page
  2. Enter a valid name
  3. Enter an email address already registered in the system
  4. Enter a valid password with at least 8 characters
  5. Submit the registration form
- **Expected Results:**
  - Registration is blocked
  - A duplicate email validation message is displayed
  - No duplicate account is created
- **Priority:** High
- **Test Type:** Negative

### TC-REG-003
- **Title:** Reject registration with password shorter than 8 characters
- **Description:** Verify that the password policy is enforced during registration.
- **Preconditions:**
  - Registration page is accessible
- **Test Steps:**
  1. Open the registration page
  2. Enter a valid name
  3. Enter a unique email address
  4. Enter a password shorter than 8 characters
  5. Submit the registration form
- **Expected Results:**
  - Registration is blocked
  - A password length validation message is displayed
- **Priority:** High
- **Test Type:** Negative

### TC-LOG-001
- **Title:** Login with valid email and password
- **Description:** Verify that a registered user can log in successfully.
- **Preconditions:**
  - A registered user exists with valid credentials
- **Test Steps:**
  1. Open the login page
  2. Enter a valid registered email
  3. Enter the correct password
  4. Submit the login form
- **Expected Results:**
  - Login succeeds
  - User is redirected to the dashboard
- **Priority:** High
- **Test Type:** Functional

### TC-LOG-002
- **Title:** Show error for invalid login credentials
- **Description:** Verify that the system blocks login with invalid credentials.
- **Preconditions:**
  - Login page is accessible
- **Test Steps:**
  1. Open the login page
  2. Enter an invalid email or password combination
  3. Submit the login form
- **Expected Results:**
  - Login fails
  - An invalid credentials error message is displayed
  - User remains on the login page
- **Priority:** High
- **Test Type:** Negative

### TC-PROD-001
- **Title:** View product listing with required product details
- **Description:** Verify that users can browse the product list and see required product attributes.
- **Preconditions:**
  - Product inventory is preloaded
  - Product listing page is accessible
- **Test Steps:**
  1. Open the product listing page
  2. Observe the displayed product cards/items
- **Expected Results:**
  - Product list is displayed
  - Each listed product shows name, price, and image
- **Priority:** High
- **Test Type:** Functional

### TC-PROD-002
- **Title:** Filter products by category
- **Description:** Verify that users can filter the visible product list by category.
- **Preconditions:**
  - Product inventory contains multiple categories
- **Test Steps:**
  1. Open the product listing page
  2. Select a category filter
  3. Observe the filtered results
- **Expected Results:**
  - Only products belonging to the selected category are displayed
- **Priority:** Medium
- **Test Type:** Functional

### TC-CART-001
- **Title:** Add in-stock product to cart
- **Description:** Verify that a user can add a product to the cart successfully.
- **Preconditions:**
  - Product listing page is accessible
  - Selected product is in stock
- **Test Steps:**
  1. Open the product listing page
  2. Choose an in-stock product
  3. Click Add to Cart
  4. Open the cart
- **Expected Results:**
  - Selected product appears in the cart
  - Cart shows product name, quantity, and total price
- **Priority:** High
- **Test Type:** Functional

### TC-CART-002
- **Title:** Update product quantity in cart
- **Description:** Verify that the user can change quantity for a cart item.
- **Preconditions:**
  - Cart contains at least one product
- **Test Steps:**
  1. Open the cart
  2. Increase or decrease the product quantity
  3. Save or trigger cart recalculation if required
- **Expected Results:**
  - Quantity updates successfully
  - Total price updates correctly
- **Priority:** High
- **Test Type:** Regression

### TC-CART-003
- **Title:** Remove product from cart
- **Description:** Verify that the user can remove an item from the cart.
- **Preconditions:**
  - Cart contains at least one product
- **Test Steps:**
  1. Open the cart
  2. Remove one product
- **Expected Results:**
  - Product is removed from the cart
  - Cart totals are updated accordingly
- **Priority:** Medium
- **Test Type:** Regression

### TC-CART-004
- **Title:** Prevent adding out-of-stock product to cart
- **Description:** Verify proper handling when attempting to add an out-of-stock product.
- **Preconditions:**
  - At least one product is marked out of stock
- **Test Steps:**
  1. Open the product listing page
  2. Select an out-of-stock product
  3. Attempt to add the product to the cart
- **Expected Results:**
  - Product is not added to the cart
  - User sees an out-of-stock message or disabled action state
- **Priority:** High
- **Test Type:** Edge

### TC-CHK-001
- **Title:** Complete checkout with valid shipping and payment details
- **Description:** Verify that a user can successfully place an order.
- **Preconditions:**
  - Cart contains at least one product
  - Payment gateway mock is available
- **Test Steps:**
  1. Open the cart
  2. Proceed to checkout
  3. Enter valid shipping address
  4. Enter valid payment details
  5. Submit the order
- **Expected Results:**
  - Payment is processed successfully through the mock gateway
  - Order confirmation is displayed
- **Priority:** High
- **Test Type:** Functional

### TC-CHK-002
- **Title:** Block checkout when shipping address is missing
- **Description:** Verify that shipping information is mandatory for checkout.
- **Preconditions:**
  - Cart contains at least one product
- **Test Steps:**
  1. Proceed to checkout
  2. Leave shipping address blank
  3. Enter payment details if needed
  4. Submit the order
- **Expected Results:**
  - Checkout is blocked
  - Validation message is shown for missing shipping address
- **Priority:** High
- **Test Type:** Negative

### TC-CHK-003
- **Title:** Handle payment failure during checkout
- **Description:** Verify that payment failure is handled gracefully.
- **Preconditions:**
  - Cart contains at least one product
  - Payment gateway can return a failure response
- **Test Steps:**
  1. Proceed to checkout
  2. Enter valid shipping address
  3. Enter payment details configured to simulate failure
  4. Submit the order
- **Expected Results:**
  - Order is not completed
  - A payment failure message is displayed
  - User can retry or remain on checkout
- **Priority:** High
- **Test Type:** Negative

### TC-LOGOUT-001
- **Title:** Logout clears user session
- **Description:** Verify that the user can log out and the session is cleared.
- **Preconditions:**
  - User is logged in
- **Test Steps:**
  1. Click logout
  2. Attempt to access a protected area if available
- **Expected Results:**
  - User session is cleared
  - User is redirected to a public page or login page
  - Protected resources require login again
- **Priority:** Medium
- **Test Type:** Regression

### TC-NFR-001
- **Title:** Verify homepage or product page load completes within 3 seconds
- **Description:** Check the documented performance expectation for page load.
- **Preconditions:**
  - Test environment is stable
- **Test Steps:**
  1. Open the application in a supported browser
  2. Measure initial page load time
- **Expected Results:**
  - Application load time is within 3 seconds under expected test conditions
- **Priority:** Medium
- **Test Type:** Edge

### TC-COMP-001
- **Title:** Verify core user journey in Chrome and Edge
- **Description:** Ensure that supported browsers can complete the main purchase flow.
- **Preconditions:**
  - Chrome and Edge are available
- **Test Steps:**
  1. Open the application in Chrome
  2. Execute registration/login/browse/cart/checkout/logout flow
  3. Repeat in Edge
- **Expected Results:**
  - Core user journey works in both browsers
- **Priority:** Medium
- **Test Type:** Regression
