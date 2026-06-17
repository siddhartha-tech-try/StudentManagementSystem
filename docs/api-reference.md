# API Reference

Base URL: `http://localhost:4000/api`

## Health

### `GET /health`

Returns API status.

```json
{
  "status": "ok",
  "service": "student-management-api"
}
```

## Students

### `GET /students`

Fetches students with server-side pagination, search, filters, and sorting.

Query parameters:

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `search` | string | empty | Searches admission number, name, email, and mobile |
| `course` | string | empty | Partial course match |
| `year` | number | empty | Valid range: 1 to 8 |
| `gender` | string | empty | `MALE`, `FEMALE`, or `OTHER` |
| `page` | number | `1` | 1-based page number |
| `limit` | number | `10` | Max 100 |
| `sortBy` | string | `createdAt` | `createdAt`, `updatedAt`, `name`, `course`, `year`, `admissionNumber` |
| `sortOrder` | string | `desc` | `asc` or `desc` |

Sample response:

```json
{
  "data": [
    {
      "id": "e9e01b1c-9d8d-4d87-b88c-426b2f8404a3",
      "admissionNumber": "ADM-2026-000001",
      "name": "Aarav Sharma",
      "course": "Computer Science",
      "year": 2,
      "dateOfBirth": "2005-03-12T00:00:00.000Z",
      "email": "aarav.sharma@example.com",
      "mobileNo": "9876543210",
      "gender": "MALE",
      "address": "18 Park Street, Delhi",
      "photoUrl": "/uploads/students/1718620000000-photo.webp",
      "createdAt": "2026-06-17T16:30:00.000Z",
      "updatedAt": "2026-06-17T16:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### `GET /students/:id`

Fetches one student by UUID.

```json
{
  "data": {
    "id": "e9e01b1c-9d8d-4d87-b88c-426b2f8404a3",
    "admissionNumber": "ADM-2026-000001",
    "name": "Aarav Sharma",
    "course": "Computer Science",
    "year": 2,
    "dateOfBirth": "2005-03-12T00:00:00.000Z",
    "email": "aarav.sharma@example.com",
    "mobileNo": "9876543210",
    "gender": "MALE",
    "address": "18 Park Street, Delhi",
    "photoUrl": null,
    "createdAt": "2026-06-17T16:30:00.000Z",
    "updatedAt": "2026-06-17T16:30:00.000Z"
  }
}
```

### `POST /students`

Creates a student. Use `multipart/form-data`.

Fields:

| Name | Required | Notes |
| --- | --- | --- |
| `name` | yes | Max 120 characters |
| `course` | yes | Max 120 characters |
| `year` | yes | Integer from 1 to 8 |
| `dateOfBirth` | yes | Date string, cannot be future |
| `email` | yes | Valid email |
| `mobileNo` | yes | 10 to 15 digits, optional leading `+` |
| `gender` | yes | `MALE`, `FEMALE`, or `OTHER` |
| `address` | yes | Max 500 characters |
| `photo` | no | JPG, PNG, or WEBP |

Sample response:

```json
{
  "message": "Student created successfully",
  "data": {
    "id": "e9e01b1c-9d8d-4d87-b88c-426b2f8404a3",
    "admissionNumber": "ADM-2026-000001",
    "name": "Aarav Sharma"
  }
}
```

### `PUT /students/:id`

Updates a student. Use `multipart/form-data` with the same fields as create. Passing a new `photo` replaces the previous photo.

### `DELETE /students/:id`

Hard deletes a student and records the delete action in the activity log.

```json
{
  "message": "Student deleted successfully"
}
```

## Analytics

### `GET /analytics/students`

Returns student totals and grouped counts.

```json
{
  "data": {
    "totalStudents": 18,
    "recentStudentCount": 4,
    "courseCounts": [{ "course": "Computer Science", "count": 8 }],
    "yearCounts": [{ "year": 1, "count": 5 }],
    "genderCounts": [{ "gender": "FEMALE", "count": 9 }]
  }
}
```

## Activity

### `GET /activities?limit=20`

Returns recent create, update, and delete activity logs.

```json
{
  "data": [
    {
      "id": "2b6123a7-2f01-46cb-97b0-7d906c3d7140",
      "action": "CREATE",
      "entityType": "Student",
      "entityId": "e9e01b1c-9d8d-4d87-b88c-426b2f8404a3",
      "admissionNumber": "ADM-2026-000001",
      "message": "Created student Aarav Sharma",
      "metadata": {
        "name": "Aarav Sharma",
        "course": "Computer Science",
        "year": 2
      },
      "createdAt": "2026-06-17T16:30:00.000Z"
    }
  ]
}
```
