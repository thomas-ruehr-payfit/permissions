# PayFit — Access & Permission Model
**Status: v1 working draft — pending peer review**

---

## Product context

PayFit is a payroll and HR SaaS. Everything is managed from a single **Organisation** which contains one or several **Entities** (legal companies). Clients range from single-entity small businesses to multi-entity mid-sized organisations.

---

## Core model

```
User access = [ Permission set × Perimeter ] + [ Permission set × Perimeter ] + …
```

A user can hold multiple pairs. Their total access is the union of all pairs. A permission set without an assigned perimeter grants no access — all access grants are explicit and purposeful.

### Permission set
Defines what a user can do and which objects they can access.

### Perimeter
Defines the scope a user can act on. Four types:

| Type | Definition |
|---|---|
| Org | All entities in the organisation |
| Entity | One or several specific legal entities |
| Group | A named population — team, location, department. Lives at org level, can span any number of entities including all. |
| Individual | A named employee (relationship-based) |

Perimeter types are not a hierarchy — they are independent ways to define scope.

---

## Object levels

Every object belongs to one of three levels, which determines how perimeter applies:

| Level | Example objects | Access logic |
|---|---|---|
| Org | Billing, integrations, templates | Role determines access — perimeter irrelevant |
| Entity | DSN, payroll settings, company configuration | Role + entity perimeter |
| Employee | Contracts, absences, payslips | Role + employee/group perimeter |

---

## Roles

### Assignable roles

**1. Organisation Admin** / Admin Organisation
- Full access to everything, no restrictions
- Only role that can add a new entity and invite or manage Organisation Admins and Entity Admins
- Perimeter: always org-wide, fixed

**2. Entity Admin** / Admin Établissement
- Full operational access within assigned entities
- Cannot add entities, cannot invite or manage any Admin role
- Perimeter: explicitly assigned — one entity, several, or all

**3. Payroll Manager** / Gestionnaire Paie
- Payroll objects only
- Perimeter: by entity

**4. HR Manager** / Gestionnaire RH
- HR objects only, including personal employee data and payslips
- Perimeter: by entity or group

**5. Accountant** / Comptable
- Read-oriented access to financial outputs: reports, exports, declarations, accounting data
- No access to employee personal data or payroll variables
- Perimeter: by entity

### Non-assignable

**Manager** / Manager
- Access to the manager space only: absences, 1:1s, objectives
- Not assigned — derived automatically from manager/managee relationships in the org chart
- Perimeter: individual relationships, including a whole team plus specific individuals from other teams
- Visible as read-only in the permissions UI, configured from the employee profile

---

## Key principles

- **Purposeful** — no implicit defaults. Every access grant is a conscious decision.
- **Composable** — access is additive. Multiple pairs stack to give broader access.
- **90/10** — standard roles cover 90% of users with no configuration. Custom roles and modifiers exist for the 10% who need precision.
