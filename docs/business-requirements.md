# Business Requirements — ReturnFlow

## Overview
ReturnFlow is a ServiceNow scoped application built to automate and 
streamline the order return process for retail customers. It eliminates 
the need for customers to contact a service desk, speak to a bot, or 
wait in a queue to return an item.

---

## Business Problem
Retail returns are a $890 billion global problem. Most organisations 
still handle them manually — through call centres, bots, and overwhelmed 
frontline staff. Customers wait. Requests get lost. Loyalty is damaged 
at the exact moment it matters most.

67% of customers say a negative return experience would stop them 
shopping with that brand again.
(Source: NRF & Happy Returns, 2024)

---

## Desired Outcomes
- A single centralised platform where customers submit return requests 
  without contacting customer service
- Reduction in frontline customer service costs through automation
- Faster processing and validation of return requests
- Full visibility on the entire return process for customers, 
  fulfillers, and managers

---

## Stakeholders

| Stakeholder        | Value                                                        |
|--------------------|--------------------------------------------------------------|
| Customer           | Self service returns with real time email updates            |
| Warehouse Team     | Automated task assignment and full return context on arrival |
| Finance Team       | Automated task assignment when refund approval is needed     |
| Manager/Executive  | Live dashboard with return volumes, trends, and outcomes     |

---

## Personas

| Persona                  | Access                                                     |
|--------------------------|------------------------------------------------------------|
| Self Service User        | Submit returns via portal. View own requests only.         |
| Administrator/Fulfiller  | Full read, edit, and delete access to all return records.  |

---

## Scope — MVP

### In Scope
- Customer return request form via Service Portal
- Automated order validation (order number, email, last name, 14 days)
- Duplicate return check
- Automated email notifications at each stage
- Warehouse task creation and inspection workflow
- Finance task creation and refund approval workflow
- Manager dashboard with return reports
- Knowledge base article on how to return an item
- Return Extension catalog item with manager approval

### Out of Scope (Post MVP)
- Collection slot booking
- Real time return status tracker on portal
- SLA driven escalations
- Scheduled scripts and event driven notifications

---

## Return Window Policy
Returns must be submitted within 14 days of the original order 
created date. Requests outside this window are blocked at the 
point of submission.

---

## Validation Rules
The following checks run before a return record is created:

1. Order number, last name, and email must all match a single 
   Order record
2. Order must have been created within the last 14 days
3. No existing return record must exist for the same order number
