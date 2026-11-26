# COBOL Accounting Application Test Plan

This plan covers the behavior implemented in `src/cobol`. Start a fresh application for each test unless a test explicitly describes multiple operations in one run. A new run initializes the balance to `1000.00`.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View the initial account balance | Application is freshly started. | 1. Select option `1`. | The displayed balance has a numeric value of `1000.00`. | Not run | Not run | The COBOL field has an implied decimal point; confirm its displayed representation. |
| TC-002 | Credit the account | Application is freshly started. | 1. Select option `2`.<br>2. Enter `125.50`.<br>3. Select option `1`. | The credit succeeds; the balance is `1125.50`. | Not run | Not run |  |
| TC-003 | Debit less than the balance | Application is freshly started. | 1. Select option `3`.<br>2. Enter `250.00`.<br>3. Select option `1`. | The debit succeeds; the balance is `750.00`. | Not run | Not run |  |
| TC-004 | Debit the exact balance | Application is freshly started. | 1. Select option `3`.<br>2. Enter `1000.00`.<br>3. Select option `1`. | The debit succeeds because the balance is equal to the debit amount; the balance is `0.00`. | Not run | Not run |  |
| TC-005 | Reject a debit greater than the balance | Application is freshly started. | 1. Select option `3`.<br>2. Enter `1000.01`.<br>3. Select option `1`. | An insufficient-funds message is displayed; the balance remains `1000.00`. | Not run | Not run |  |
| TC-006 | Credit a fractional amount | Application is freshly started. | 1. Select option `2`.<br>2. Enter `0.01`.<br>3. Select option `1`. | The credit succeeds; the balance is `1000.01`. | Not run | Not run | Confirms cent-level arithmetic. |
| TC-007 | Handle an invalid menu choice | Application is freshly started. | 1. Enter `5` at the menu.<br>2. Select option `1`. | An invalid-choice message is displayed, the menu continues, and the balance remains unchanged at `1000.00`. | Not run | Not run |  |
| TC-008 | Exit the application | Application is running. | 1. Select option `4`. | A goodbye message is displayed and the application stops. | Not run | Not run |  |
| TC-009 | Verify balance is not persisted between runs | Application is freshly started. | 1. Credit `25.00`.<br>2. Exit with option `4`.<br>3. Start the application again and select option `1`. | The new run displays the initial balance, `1000.00`, rather than the previous run's balance. | Not run | Not run | Balance is held in working storage, not saved to persistent storage. |

Actual results and Pass/Fail statuses have not been recorded; execute the test cases and fill them in during validation.
