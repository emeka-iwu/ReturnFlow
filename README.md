# ReturnFlow — Order Return Application

> A ServiceNow scoped application that automates the end-to-end
> order return process for retail customers. Built as a capstone
> project on the ServiceNow platform.

---

## The Problem

Retail returns are a $890 billion global problem. Most organisations
still handle them manually through call centres, bots, and
overwhelmed frontline staff. Customers wait. Staff are overwhelmed.
Requests get lost.

- **16.9%** of all retail sales are returned annually
- **67%** of customers say a bad return experience stops them
  shopping with that brand again

*Source: NRF & Happy Returns, 2024*

---

## The Solution

ReturnFlow is a self-service ServiceNow application where customers
submit return requests in minutes, get instant eligibility validation,
and receive real-time updates at every stage without ever reaching
an agent.

---

## The Customer Journey

Submit Request → Instant Validation → Drop-off Email → Warehouse Inspection → Refund Processed → Closed

```mermaid
flowchart TD
    A([START]) --> B{Order Exists?}
    B -- NO --> C([Order Not Found])
    B -- YES --> D{Within 14 Days?}
    D -- NO --> E([Outside Return Window])
    D -- YES --> F([Create Return Record])
    F --> G([Return Submitted])
    G --> H([✉ Email: Drop Off + Ref No.])
    H --> I([Warehouse Task — Inspect Item])
    I --> J{Decision?}
    J -- REJECTED --> K([Look Up Task — Get Rejection Reason])
    K --> L([Update: Return Rejected])
    L --> M([✉ Email: Rejected — Reason Included])
    M --> N([Wait 7 Days])
    N --> O([Closed Rejected])
    J -- APPROVED --> P([✉ Email: Return Approved])
    P --> Q([Update: Return Approved])
    Q --> R([Finance Task — Process Refund])
    R --> S([Update: Refund Processed])
    S --> T([Wait 7 Days])
    T --> U([Closed Approved])
    U --> V([END])

    style A fill:#1e293b,stroke:#334155,color:#94a3b8
    style V fill:#1e293b,stroke:#334155,color:#94a3b8
    style C fill:#1c0f0f,stroke:#ef4444,color:#fca5a5
    style E fill:#1c0f0f,stroke:#ef4444,color:#fca5a5
    style O fill:#1c0f0f,stroke:#ef4444,color:#fca5a5
    style B fill:#081828,stroke:#3b82f6,color:#93c5fd
    style D fill:#081828,stroke:#3b82f6,color:#93c5fd
    style J fill:#131e2e,stroke:#334155,color:#94a3b8
    style F fill:#0e1f3a,stroke:#3b82f6,color:#93c5fd
    style G fill:#0e1f3a,stroke:#3b82f6,color:#93c5fd
    style H fill:#281d0a,stroke:#f59e0b,color:#fcd34d
    style I fill:#0d2018,stroke:#22c55e,color:#86efac
    style K fill:#0e1f3a,stroke:#3b82f6,color:#93c5fd
    style L fill:#1c0f0f,stroke:#ef4444,color:#fca5a5
    style M fill:#281d0a,stroke:#f59e0b,color:#fcd34d
    style N fill:#141a28,stroke:#64748b,color:#94a3b8
    style P fill:#281d0a,stroke:#f59e0b,color:#fcd34d
    style Q fill:#0d2018,stroke:#22c55e,color:#86efac
    style R fill:#1c1030,stroke:#a855f7,color:#d8b4fe
    style S fill:#1c1030,stroke:#a855f7,color:#d8b4fe
    style T fill:#141a28,stroke:#64748b,color:#94a3b8
    style U fill:#0d2018,stroke:#22c55e,color:#86efac
```

---

## Platform Features Used

| #  | Feature              |
|----|----------------------|
| 01 | Scoped Application   |
| 02 | Tables & Forms       |
| 03 | UI Policies          |
| 04 | Roles & ACLs         |
| 05 | Record Producer      |
| 06 | Service Catalog Item |
| 07 | Flow Designer        |
| 08 | Notifications        |
| 09 | Knowledge Articles   |
| 10 | Dashboard & Reports  |
| 11 | Source Control       |
| 12 | Client Scripts       |
| 13 | Business Rules       |

---

## Repository Structure

    ReturnFlow/
    │
    ├── README.md
    │
    ├── servicenow-config/
    │   ├── [app-hash-folder]/
    │   └── sn_source_control.properties
    │
    ├── docs/
    │   ├── business-requirements.md
    │   ├── technical-documentation.md
    │   └── user-guide.md
    │
    ├── scripts/
    │   ├── business-rule-validation.js
    │   ├── business-rule-order-date.js
    │   └── business-rule-requested-for.js
    │
    ├
    │
    │
    └── screenshots/
        ├── portal-homepage.png
        ├── return-form.png
        ├── warehouse-task.png
        ├── finance-task.png
        └── dashboard.png

---

## Documentation

- [Business Requirements](docs/business-requirements.md)
- [Technical Documentation](docs/technical-documentation.md)
- [User Guide](docs/user-guide.md)

---

## The Team

| Name                     | Role          |
|--------------------------|---------------|
| Emeka Iwu                | Project Lead  |
| Abiodun Alao             | Implementer   |
| Lawrence Egwuonwu        | Implementer   |
| Michael Ayeni            | Sys Admin     |
| Gauri Phapale            | Sys Admin     |
| Fiyinfoluwa Adebola Oriade | Sys Admin   |

---

## Screenshots

> Screenshots of the live application are in the `/screenshots` folder.

---
## Importing into ServiceNow

To import this application into a ServiceNow PDI:

1. Fork or clone this repository
2. In ServiceNow Studio, go to **Source Control → Import from Source Control**
3. Point to this repository using the **servicenow-config/** folder — 
   not the root of the repository
4. Use branch: **main**

> Note: Only the `servicenow-config/` folder contains the Studio 
> app export. Do not link to the parent folder.

---
*Built part-time. Shipped on time. Designed to give customers their wait time back.*
