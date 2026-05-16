# Smart Leads Dashboard API Documentation

This document describes the REST API used by the Smart Leads Dashboard frontend.

## Base URL

Local backend:

```txt
http://127.0.0.1:5000/api/v1
```

Docker frontend proxy:

```txt
/api/v1
```

Production example:

```txt
https://your-backend-domain.vercel.app/api/v1
```

Health check is outside the API version prefix:

```txt
GET /health
```

## Authentication

Protected routes require a JWT access token in the `Authorization` header:

```txt
Authorization: Bearer <accessToken>
```

Public routes:

- `POST /auth/register`
- `POST /auth/login`
- `GET /health`

Protected routes:

- `GET /auth/me`
- all `/leads` routes

## Roles

| Role | Permissions |
| --- | --- |
| `Admin` | Create, view, update, delete, filter, paginate, and export leads |
| `Sales User` | Create, view, update, filter, paginate, and export leads. Cannot delete leads |

Public registration always creates a `Sales User`.

Seeded admin credentials:

```txt
Email: admin@company.com
Password: Admin@123
```

## Standard JSON Responses

Success response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

Some errors do not include the `errors` array:

```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

## Data Models

### Public User

```json
{
  "id": "665a1f1c0000000000000001",
  "name": "Company Admin",
  "email": "admin@company.com",
  "role": "Admin",
  "createdAt": "2026-05-17T10:00:00.000Z",
  "updatedAt": "2026-05-17T10:00:00.000Z"
}
```

### Public Lead

```json
{
  "id": "665a1f1c0000000000000002",
  "name": "Rahul Mehta",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Website",
  "createdAt": "2026-05-17T10:00:00.000Z",
  "updatedAt": "2026-05-17T10:00:00.000Z"
}
```

Allowed lead statuses:

```txt
New, Contacted, Qualified, Lost
```

Allowed lead sources:

```txt
Website, Instagram, Referral
```

## Auth Endpoints

### Register User

```txt
POST /auth/register
```

Creates a new `Sales User` account and returns an access token.

Request body:

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "Password123"
}
```

Validation rules:

| Field | Rules |
| --- | --- |
| `name` | Required, 2 to 80 characters |
| `email` | Required, valid email |
| `password` | Required, 8 to 72 characters, must include lowercase, uppercase, and number |

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "665a1f1c0000000000000001",
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "role": "Sales User",
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    },
    "accessToken": "jwt-token"
  }
}
```

Common errors:

| Status | Message |
| --- | --- |
| `400` | `Validation failed` |
| `409` | `An account with this email already exists` |

### Login User

```txt
POST /auth/login
```

Logs in a user and returns an access token.

Request body:

```json
{
  "email": "admin@company.com",
  "password": "Admin@123"
}
```

Success response:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "665a1f1c0000000000000001",
      "name": "Company Admin",
      "email": "admin@company.com",
      "role": "Admin",
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    },
    "accessToken": "jwt-token"
  }
}
```

Common errors:

| Status | Message |
| --- | --- |
| `400` | `Validation failed` |
| `401` | `Invalid email or password` |

### Get Current User

```txt
GET /auth/me
```

Requires authentication.

Headers:

```txt
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "success": true,
  "message": "Authenticated user fetched successfully",
  "data": {
    "id": "665a1f1c0000000000000001",
    "name": "Company Admin",
    "email": "admin@company.com",
    "role": "Admin",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

Common errors:

| Status | Message |
| --- | --- |
| `401` | `Authentication token is required` |
| `401` | `Invalid authentication token` |
| `401` | `Authentication token has expired` |

## Lead Endpoints

All lead endpoints require authentication.

Headers:

```txt
Authorization: Bearer <accessToken>
```

### Create Lead

```txt
POST /leads
```

Request body:

```json
{
  "name": "Rahul Mehta",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Website"
}
```

`status` is optional and defaults to `New`.

Validation rules:

| Field | Rules |
| --- | --- |
| `name` | Required, 2 to 100 characters |
| `email` | Required, valid email |
| `status` | Optional, one of `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | Required, one of `Website`, `Instagram`, `Referral` |

Success response:

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "665a1f1c0000000000000002",
    "name": "Rahul Mehta",
    "email": "rahul@example.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

### List Leads

```txt
GET /leads
```

Returns paginated leads. Pagination size is fixed at 10 leads per page.

Query parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `page` | No | Page number. Defaults to `1` |
| `status` | No | Filter by lead status |
| `source` | No | Filter by lead source |
| `search` | No | Search by name or email |
| `sort` | No | `latest` or `oldest`. Defaults to `latest` |

Example:

```txt
GET /leads?page=1&status=New&source=Website&search=rahul&sort=latest
```

Success response:

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": {
    "leads": [
      {
        "id": "665a1f1c0000000000000002",
        "name": "Rahul Mehta",
        "email": "rahul@example.com",
        "status": "New",
        "source": "Website",
        "createdAt": "2026-05-17T10:00:00.000Z",
        "updatedAt": "2026-05-17T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalRecords": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### Get Lead By ID

```txt
GET /leads/:id
```

Example:

```txt
GET /leads/665a1f1c0000000000000002
```

Success response:

```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "id": "665a1f1c0000000000000002",
    "name": "Rahul Mehta",
    "email": "rahul@example.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

Common errors:

| Status | Message |
| --- | --- |
| `400` | `Invalid lead identifier` |
| `404` | `Lead not found` |

### Update Lead

```txt
PATCH /leads/:id
```

Updates one or more lead fields.

Request body:

```json
{
  "name": "Rahul Mehta",
  "email": "rahul.mehta@example.com",
  "status": "Qualified",
  "source": "Referral"
}
```

All fields are optional, but at least one field must be provided.

Success response:

```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "id": "665a1f1c0000000000000002",
    "name": "Rahul Mehta",
    "email": "rahul.mehta@example.com",
    "status": "Qualified",
    "source": "Referral",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:15:00.000Z"
  }
}
```

Common errors:

| Status | Message |
| --- | --- |
| `400` | `Validation failed` |
| `400` | `Invalid lead identifier` |
| `404` | `Lead not found` |

### Delete Lead

```txt
DELETE /leads/:id
```

Requires `Admin` role.

Example:

```txt
DELETE /leads/665a1f1c0000000000000002
```

Success response:

```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": {
    "id": "665a1f1c0000000000000002",
    "name": "Rahul Mehta",
    "email": "rahul@example.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

Common errors:

| Status | Message |
| --- | --- |
| `400` | `Invalid lead identifier` |
| `401` | `Authentication token is required` |
| `403` | `You do not have permission to access this resource` |
| `404` | `Lead not found` |

### Export Leads CSV

```txt
GET /leads/export/csv
```

Exports all matching leads as a CSV file. This endpoint does not use pagination.

Query parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `status` | No | Filter by lead status |
| `source` | No | Filter by lead source |
| `search` | No | Search by name or email |
| `sort` | No | `latest` or `oldest`. Defaults to `latest` |

Example:

```txt
GET /leads/export/csv?status=Qualified&source=Referral&sort=latest
```

Response headers:

```txt
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="leads-export-2026-05-17T10-00-00-000Z.csv"
```

CSV columns:

```csv
Name,Email,Status,Source,Created At
Rahul Mehta,rahul@example.com,Qualified,Referral,2026-05-17T10:00:00.000Z
```

## Health Check

```txt
GET /health
```

Success response:

```json
{
  "success": true,
  "message": "Smart Leads API is running"
}
```

## HTTP Status Codes

| Status | Meaning |
| --- | --- |
| `200` | Request succeeded |
| `201` | Resource created |
| `400` | Invalid request or validation failed |
| `401` | Missing, invalid, or expired authentication token |
| `403` | Authenticated user does not have permission |
| `404` | Route or resource not found |
| `409` | Duplicate value conflict |
| `500` | Server error |

## Example cURL Requests

Login:

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin@123"}'
```

List leads:

```bash
curl "http://127.0.0.1:5000/api/v1/leads?page=1&sort=latest" \
  -H "Authorization: Bearer <accessToken>"
```

Create lead:

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/leads" \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Mehta","email":"rahul@example.com","status":"New","source":"Website"}'
```

Export CSV:

```bash
curl "http://127.0.0.1:5000/api/v1/leads/export/csv?sort=latest" \
  -H "Authorization: Bearer <accessToken>" \
  -o leads.csv
```
