# Technical Documentation — ReturnFlow

## Application Overview

| Property     | Value                    |
|--------------|--------------------------|
| Platform     | ServiceNow               |
| App Type     | Scoped Application       |
| App Name     | ReturnFlow               |
| Build Type   | Capstone Project         |
| Year         | 2026                     |

---

## Table Structure

### Order Item Table (x_1974680_return_0_order_item)
Extends: task

| Field Label  | Field Name   | Type      | Notes                                    |
|--------------|--------------|-----------|------------------------------------------|
| Number       | number       | String    | Auto-generated with ORDER prefix         |
| Order Date   | order_date   | Date      | Auto-populated via Business Rule from    |
|              |              |           | sys_created_on. Created because          |
|              |              |           | ServiceNow does not allow sys_created_on |
|              |              |           | to be edited, so this field is used for  |
|              |              |           | the 14 day validation check instead.     |
| Assigned To  | assigned_to  | Reference | Stores the customer (sys_user reference) |
| Email        | email        | Email     | Customer email address                   |
| Item Cost    | item_cost    | Currency  | Used to determine if finance approval    |
|              |              |           | is required (threshold: over 100)        |
| Item Category| item_category| String    | Auto-populated onto return record        |

---

### Order Return Table (x_1974680_return_0_order_return)
Extends: task

| Field Label          | Field Name           | Type       | Notes                               |
|----------------------|----------------------|------------|-------------------------------------|
| Number               | number               | String     | Auto-generated with RETURN prefix   |
| Order Number         | order_number         | String     | Entered by customer on form         |
| Last Name            | last_name            | String     | Used for identity validation        |
| Email                | email                | Email      | Used for identity validation        |
| Reason for Return    | reason_for_return    | Choice     | Broken/Faulty, Wrong Item, Changed  |
|                      |                      |            | Mind, Other                         |
| Additional Comments  | additional_comments  | String     | Shown when reason is Other          |
| State                | state                | Choice     | See state cycle below               |
| Requested For        | requested_for        | Reference  | Auto-populated from Order record    |
| Reason for Rejection | reason_for_rejection | String     | Read only. Visible when state is    |
|                      |                      |            | Return Rejected or Closed Rejected  |

---

### Return Task Table (x_1974680_return_0_returnflow_task)
Extends: task

| Field Label          | Field Name           | Type      | Notes                                |
|----------------------|----------------------|-----------|--------------------------------------|
| Task Outcome         | task_outcome         | Choice    | Warehouse Approved, Warehouse         |
|                      |                      |           | Rejected, Finance Approved           |
| Reason for Rejection | reason_for_rejection | String    | Visible and mandatory when Task       |
|                      |                      |           | Outcome is Warehouse Rejected        |
| Order Return         | order_return         | Reference | Links task back to Order Return      |
| Assigned To          | assigned_to          | Reference | Visible and mandatory when task      |
|                      |                      |           | is closed                            |
| State                | state                | Choice    | Open or Closed (two options only)    |

Note: There is no Task Type field on the Return Task table. 
Warehouse and finance tasks are distinguished by their 
assignment group and task outcome values.

---

## State Cycles

### Order Return States

| State            | Description                                           |
|------------------|-------------------------------------------------------|
| Return Submitted | Record created, drop off email sent to customer       |
| Return Approved  | Warehouse approved the inspection                     |
| Return Rejected  | Warehouse rejected the return. Reason for Rejection   |
|                  | field becomes visible and read only on the record     |
| Refund Processed | Finance has processed the refund                      |
| Closed Approved  | Return fully resolved and closed                      |
| Closed Rejected  | Return closed following rejection                     |

### Return Task States

| State  | Description                                              |
|--------|----------------------------------------------------------|
| Open   | Task created and awaiting action from fulfiller          |
| Closed | Fulfiller has completed the task and recorded outcome    |

---

## Business Rules

### 1. Order Return Checks (Before Insert into Order Return table)
Validates before a return record is created. Checks:
- Order number, email, and last name all match a single 
  Order record (last name checked against last word of 
  assigned_to display name)
- Order date is within the last 14 days
- No existing active return exists for the same order number
If any check fails the submission is blocked with an 
error message. Message is deliberately vague to prevent 
bad actors from identifying which field failed.

### 2. Auto Populate Order Date (After Insert into Order table)
Copies sys_created_on into the order_date field after a 
new Order record is created. This field is used instead 
of sys_created_on for the 14 day validation check because 
ServiceNow does not allow sys_created_on to be manually 
edited, which is needed for testing the return window.

### 3. Auto Populate Requested For (After Insert into Order Return table)
Queries the Order table using the submitted order number 
and copies the requested_for value across to the 
Order Return record automatically.

---

## Flow Designer — ReturnFlow Decision Flow

### Trigger
Order Return Created where State is Return Submitted

### Steps (as built)

| Step | Action                          | Description                                           |
|------|---------------------------------|-------------------------------------------------------|
| 1    | Look Up Order Item Record       | Finds Order record by order number                    |
| 2    | Update Order Return Record      | Populates item category from Order record             |
| 3    | Update Order Return Record      | Populates item price from Order record                |
| 4    | Send Email                      | Drop off email sent to requester                      |
| 5    | Create ReturnFlow Task          | Warehouse task created and assigned                   |
| 6    | Wait For                        | Waits for warehouse task state = Closed               |
| 7    | If                              | Task Outcome = Warehouse Approved                     |
| 8    | Update Order Return Record      | State set to Return Approved                          |
| 9    | Send Email                      | Notifies requester of approved return                 |
| 10   | Create ReturnFlow Task          | Finance task created and assigned                     |
| 11   | Wait For                        | Waits for finance task outcome = Finance Approved     |
| 12   | Update Order Return Record      | State set to Refund Processed                         |
| 13   | Wait                            | 30 second wait before closing record                  |
| 14   | Update Order Return Record      | State set to Closed Approved                          |
| 15   | End Flow                        | Approved path complete                                |
| 16   | Else                            | If warehouse rejects the return                       |
| 17   | Look Up ReturnFlow Task Record  | Retrieves warehouse task to get rejection reason      |
| 18   | Update Order Return Record      | State set to Return Rejected                          |
| 19   | Send Email                      | Informs requester of rejection including reason       |
| 20   | Wait                            | 30 second wait before closing record                  |
| 21   | Update Order Return Record      | State set to Closed Rejected                          |
| 22   | End Flow                        | Rejected path complete                                |

---

## UI Policies — Return Task Form

| Condition                             | Action                                     |
|---------------------------------------|--------------------------------------------|
| Task closed                           | Assigned To visible and mandatory          |
| Task closed                           | Task Outcome visible and mandatory         |
| Task Outcome = Warehouse Rejected     | Reason for Rejection visible and mandatory |

Note: Attachment visibility on the return request form 
could not be controlled via UI Policy or Catalog Client 
Script due to a platform limitation encountered during 
the build. This is logged as a known issue for post MVP.

---

## Notifications
Both requesters and fulfillers are notified at every stage 
of the return journey. Notifications are triggered by the 
flow at the following points:

| Event                        | Recipient              |
|------------------------------|------------------------|
| Return Submitted             | Requester: drop off   |
|                              | instructions and ref   |
| Warehouse task created       | Warehouse fulfiller    |
| Warehouse decision made      | Requester: approved   |
|                              | or rejected with reason|
| Finance task created         | Finance fulfiller      |
| Refund processed             | Requester: refund     |
|                              | confirmation           |

---

## Known Issues and Limitations

| Issue                                 | Detail                                      |
|---------------------------------------|---------------------------------------------|
| Attachment field visibility           | Could not be controlled via UI Policy or    |
|                                       | Catalog Client Script. Platform limitation. |
| Return Extension catalog item         | Not built in MVP due to time constraints    |
| sys_created_on cannot be backdated    | Workaround: order_date field created and    |
|                                       | used for 14 day validation instead          |

---

## Dashboard
A manager-facing dashboard containing:
- Line chart showing returns by time period
- Reports on state of returns, reasons for return, category of items being returned.
- List of all open returns (Returns that aren't closed)
- All data updates automatically as records are processed
