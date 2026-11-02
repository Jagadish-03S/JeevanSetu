# JEEVANSETU - PostgreSQL Database Schema Reference

The platform utilizes a normalized PostgreSQL 14+ database architecture with 18 specialized tables, UUID primary keys, and strict relational integrity constraints.

## Table Inventory

| # | Table Name | Purpose | Key Constraints |
| :--- | :--- | :--- | :--- |
| 1 | `roles` | System roles (visitor, donor, requester, hospital, bloodbank, admin) | Primary Key: `id` |
| 2 | `users` | User accounts, credentials, and verification status | Unique: `email`, Hash: bcrypt |
| 3 | `user_roles` | Junction table for many-to-many user-role mappings | Composite PK: `(user_id, role_id)` |
| 4 | `hospitals` | Registered hospitals and health institutions | Unique: `registration_number` |
| 5 | `blood_banks` | CDSCO/SBTC licensed blood centres | Unique: `license_number` |
| 6 | `donor_profiles` | Voluntary donor profiles (approximate locality, no raw addresses) | FK: `users(id)`, Check: `age >= 18` |
| 7 | `donor_availability` | Availability status and alert preferences | FK: `donor_profiles(id)` |
| 8 | `blood_requests` | Verified requisitions with urgency tier and units | Unique: `tracking_code` |
| 9 | `request_documents` | Requisition slip uploads and medical proofs | FK: `blood_requests(id)` |
| 10 | `blood_inventory` | Real-time component stock (PRBC, Platelets, FFP, Whole Blood) | Unique: `(blood_bank_id, group, component)` |
| 11 | `donor_matches` | Screened candidate matches for requisitions | Unique: `(request_id, donor_id)` |
| 12 | `request_status_history` | 8-stage audit log of requisition lifecycle changes | FK: `blood_requests(id)` |
| 13 | `notifications` | In-app notification queue | FK: `users(id)` |
| 14 | `device_tokens` | Web and mobile push tokens (FCM) | Unique: `(user_id, fcm_token)` |
| 15 | `consent_records` | Cryptographic double-opt-in consent records (DPDP compliance) | FK: `users(id)` |
| 16 | `verification_records` | Formal license and requisition approval checklists | FK: `users(id)` |
| 17 | `abuse_reports` | AI and user-flagged duplicate or suspicious requests | FK: `users(id)` |
| 18 | `audit_logs` | Immutable system event log for regulatory compliance | Index: `(action, created_at)` |

---

## Entity Relationship Overview

```
[ users ] ──────────┬──────────< [ user_roles ] >────────── [ roles ]
                    │
                    ├──────────< [ donor_profiles ] ─────── [ donor_availability ]
                    │                    │
                    │                    ▼
                    │            [ donor_matches ] >────────┐
                    │                                       │
                    ├──────────< [ blood_requests ] <───────┤
                    │                    │                  │
                    │                    ├──< [ request_documents ]
                    │                    └──< [ request_status_history ]
                    │
                    ├──────────< [ hospitals ]
                    │                    │
                    │                    └──< [ blood_banks ] ──< [ blood_inventory ]
                    │
                    ├──────────< [ consent_records ]
                    ├──────────< [ verification_records ]
                    ├──────────< [ notifications ]
                    └──────────< [ audit_logs ]
```

