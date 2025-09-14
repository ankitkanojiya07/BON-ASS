# API Endpoints Documentation

## Base URL

```
http://localhost:3000/api
```

---

## POST Endpoints

### 1. Create User

**Endpoint:** `POST /users`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@email.com"
}
```

**Success Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "createdAt": "2025-09-14T10:30:00.000Z",
    "updatedAt": "2025-09-14T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**

```json
// 400 - Missing fields
{
  "error": "Name and email are required"
}

// 400 - Duplicate email
{
  "error": "Email already exists"
}

// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

### 2. Create Bill for User

**Endpoint:** `POST /users/:id/bills`

**Request Body:**

```json
{
  "amount": 150.75,
  "dueDate": "2025-09-30T23:59:59.000Z"
}
```

**Success Response (201):**

```json
{
  "message": "Bill created successfully",
  "bill": {
    "_id": "64a1b2c3d4e5f6789012346",
    "userId": "64a1b2c3d4e5f6789012345",
    "amount": 150.75,
    "dueDate": "2025-09-30T23:59:59.000Z",
    "paymentDate": null,
    "status": "pending",
    "createdAt": "2025-09-14T10:35:00.000Z",
    "updatedAt": "2025-09-14T10:35:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**

```json
// 400 - Missing fields
{
  "error": "Amount and due date are required"
}

// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

### 3. Pay Bill

**Endpoint:** `POST /bills/:id/pay`

**Request Body:**

```json
{
  "paymentDate": "2025-09-25T14:30:00.000Z"
}
```

_Note: paymentDate is optional. If not provided, current date/time will be used._

**Success Response (200) - Paid on time with reward:**

```json
{
  "message": "Bill paid on time. Congratulations! You earned a $5 Amazon Gift Card!",
  "bill": {
    "_id": "64a1b2c3d4e5f6789012346",
    "userId": "64a1b2c3d4e5f6789012345",
    "amount": 150.75,
    "dueDate": "2025-09-30T23:59:59.000Z",
    "paymentDate": "2025-09-25T14:30:00.000Z",
    "status": "paid_on_time",
    "createdAt": "2025-09-14T10:35:00.000Z",
    "updatedAt": "2025-09-25T14:30:00.000Z",
    "__v": 0
  },
  "paidOnTime": true,
  "rewardEarned": true,
  "reward": {
    "_id": "64a1b2c3d4e5f6789012347",
    "userId": "64a1b2c3d4e5f6789012345",
    "type": "amazon",
    "amount": 5,
    "description": "$5 Amazon Gift Card",
    "isRedeemed": false,
    "redeemedAt": null,
    "createdAt": "2025-09-25T14:30:00.000Z",
    "updatedAt": "2025-09-25T14:30:00.000Z",
    "__v": 0
  },
  "eligibilityStatus": {
    "billsOnTime": 5,
    "totalBills": 5,
    "reason": "Eligible for reward"
  }
}
```

**Success Response (200) - Paid late:**

```json
{
  "message": "Bill paid late. You need 5 consecutive on-time payments to earn a reward.",
  "bill": {
    "_id": "64a1b2c3d4e5f6789012346",
    "userId": "64a1b2c3d4e5f6789012345",
    "amount": 150.75,
    "dueDate": "2025-09-30T23:59:59.000Z",
    "paymentDate": "2025-10-05T14:30:00.000Z",
    "status": "paid_late",
    "createdAt": "2025-09-14T10:35:00.000Z",
    "updatedAt": "2025-10-05T14:30:00.000Z",
    "__v": 0
  },
  "paidOnTime": false,
  "rewardEarned": false,
  "reward": null,
  "eligibilityStatus": {
    "billsOnTime": 2,
    "totalBills": 5,
    "reason": "You need 5 consecutive on-time payments to earn a reward."
  }
}
```

**Error Responses:**

```json
// 400 - Bill not found or already paid
{
  "error": "Bill not found or already paid"
}

// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

### 4. Redeem Reward

**Endpoint:** `POST /rewards/:id/redeem`

**Request Body:** No body required

**Success Response (200):**

```json
{
  "message": "Reward redeemed successfully",
  "reward": {
    "_id": "64a1b2c3d4e5f6789012347",
    "userId": "64a1b2c3d4e5f6789012345",
    "type": "amazon",
    "amount": 5,
    "description": "$5 Amazon Gift Card",
    "isRedeemed": true,
    "redeemedAt": "2025-09-26T10:15:00.000Z",
    "createdAt": "2025-09-25T14:30:00.000Z",
    "updatedAt": "2025-09-26T10:15:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**

```json
// 400 - Reward not found or already redeemed
{
  "error": "Reward not found or already redeemed"
}

// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

## GET Endpoints

### 1. Get User Details

**Endpoint:** `GET /users/:id`

**Success Response (200):**

```json
{
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "createdAt": "2025-09-14T10:30:00.000Z",
    "updatedAt": "2025-09-14T10:30:00.000Z",
    "__v": 0
  },
  "stats": {
    "totalBills": 8,
    "paidOnTimeBills": 5,
    "totalRewards": 2,
    "unredeemedRewards": 1
  },
  "bills": [
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "userId": "64a1b2c3d4e5f6789012345",
      "amount": 150.75,
      "dueDate": "2025-09-30T23:59:59.000Z",
      "paymentDate": "2025-09-25T14:30:00.000Z",
      "status": "paid_on_time",
      "createdAt": "2025-09-14T10:35:00.000Z",
      "updatedAt": "2025-09-25T14:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012348",
      "userId": "64a1b2c3d4e5f6789012345",
      "amount": 89.5,
      "dueDate": "2025-10-15T23:59:59.000Z",
      "paymentDate": null,
      "status": "pending",
      "createdAt": "2025-09-15T09:20:00.000Z",
      "updatedAt": "2025-09-15T09:20:00.000Z",
      "__v": 0
    }
  ],
  "rewards": [
    {
      "_id": "64a1b2c3d4e5f6789012347",
      "userId": "64a1b2c3d4e5f6789012345",
      "type": "amazon",
      "amount": 5,
      "description": "$5 Amazon Gift Card",
      "isRedeemed": true,
      "redeemedAt": "2025-09-26T10:15:00.000Z",
      "createdAt": "2025-09-25T14:30:00.000Z",
      "updatedAt": "2025-09-26T10:15:00.000Z",
      "__v": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012349",
      "userId": "64a1b2c3d4e5f6789012345",
      "type": "starbucks",
      "amount": 10,
      "description": "$10 Starbucks Gift Card",
      "isRedeemed": false,
      "redeemedAt": null,
      "createdAt": "2025-09-28T16:45:00.000Z",
      "updatedAt": "2025-09-28T16:45:00.000Z",
      "__v": 0
    }
  ]
}
```

**Error Responses:**

```json
// 404 - User not found
{
  "error": "User not found"
}

// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

### 2. Get User's Bills

**Endpoint:** `GET /users/:id/bills`

**Success Response (200):**

```json
{
  "bills": [
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "userId": "64a1b2c3d4e5f6789012345",
      "amount": 150.75,
      "dueDate": "2025-09-30T23:59:59.000Z",
      "paymentDate": "2025-09-25T14:30:00.000Z",
      "status": "paid_on_time",
      "createdAt": "2025-09-14T10:35:00.000Z",
      "updatedAt": "2025-09-25T14:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012348",
      "userId": "64a1b2c3d4e5f6789012345",
      "amount": 89.5,
      "dueDate": "2025-10-15T23:59:59.000Z",
      "paymentDate": null,
      "status": "pending",
      "createdAt": "2025-09-15T09:20:00.000Z",
      "updatedAt": "2025-09-15T09:20:00.000Z",
      "__v": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012350",
      "userId": "64a1b2c3d4e5f6789012345",
      "amount": 200.0,
      "dueDate": "2025-09-10T23:59:59.000Z",
      "paymentDate": null,
      "status": "overdue",
      "createdAt": "2025-08-20T11:10:00.000Z",
      "updatedAt": "2025-09-11T00:01:00.000Z",
      "__v": 0
    }
  ],
  "summary": {
    "total": 8,
    "pending": 2,
    "paidOnTime": 4,
    "paidLate": 1,
    "overdue": 1
  }
}
```

**Error Response:**

```json
// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

### 3. Get User's Rewards

**Endpoint:** `GET /users/:id/rewards`

**Success Response (200):**

```json
{
  "rewards": [
    {
      "_id": "64a1b2c3d4e5f6789012347",
      "userId": "64a1b2c3d4e5f6789012345",
      "type": "amazon",
      "amount": 5,
      "description": "$5 Amazon Gift Card",
      "isRedeemed": true,
      "redeemedAt": "2025-09-26T10:15:00.000Z",
      "createdAt": "2025-09-25T14:30:00.000Z",
      "updatedAt": "2025-09-26T10:15:00.000Z",
      "__v": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012349",
      "userId": "64a1b2c3d4e5f6789012345",
      "type": "starbucks",
      "amount": 10,
      "description": "$10 Starbucks Gift Card",
      "isRedeemed": false,
      "redeemedAt": null,
      "createdAt": "2025-09-28T16:45:00.000Z",
      "updatedAt": "2025-09-28T16:45:00.000Z",
      "__v": 0
    }
  ],
  "summary": {
    "total": 2,
    "unredeemed": 1,
    "totalValue": 15
  }
}
```

**Error Response:**

```json
// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

### 4. Check Reward Eligibility

**Endpoint:** `GET /users/:id/check-eligibility`

**Success Response (200) - Eligible:**

```json
{
  "eligibilityCheck": {
    "eligible": true,
    "reason": "Eligible for reward",
    "billsOnTime": 5,
    "totalBills": 5,
    "reward": {
      "_id": "64a1b2c3d4e5f6789012351",
      "userId": "64a1b2c3d4e5f6789012345",
      "type": "target",
      "amount": 15,
      "description": "$15 Target Gift Card",
      "isRedeemed": false,
      "redeemedAt": null,
      "createdAt": "2025-09-29T12:00:00.000Z",
      "updatedAt": "2025-09-29T12:00:00.000Z",
      "__v": 0
    }
  }
}
```

**Success Response (200) - Not Eligible:**

```json
{
  "eligibilityCheck": {
    "eligible": false,
    "reason": "You need 5 consecutive on-time payments to earn a reward.",
    "billsOnTime": 3,
    "totalBills": 6,
    "reward": null
  }
}
```

**Error Response:**

```json
// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

### 5. Get Bill Details

**Endpoint:** `GET /bills/:id`

**Success Response (200):**

```json
{
  "bill": {
    "_id": "64a1b2c3d4e5f6789012346",
    "userId": "64a1b2c3d4e5f6789012345",
    "amount": 150.75,
    "dueDate": "2025-09-30T23:59:59.000Z",
    "paymentDate": "2025-09-25T14:30:00.000Z",
    "status": "paid_on_time",
    "createdAt": "2025-09-14T10:35:00.000Z",
    "updatedAt": "2025-09-25T14:30:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**

```json
// 404 - Bill not found
{
  "error": "Bill not found"
}

// 500 - Server error
{
  "error": "Internal server error message"
}
```

---

## Data Models

### User Model

```json
{
  "_id": "ObjectId",
  "name": "String (required, trimmed)",
  "email": "String (required, unique, trimmed, lowercase)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "__v": "Number"
}
```

### Bill Model

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (reference to User)",
  "amount": "Number (required, min: 0)",
  "dueDate": "Date (required)",
  "paymentDate": "Date (nullable)",
  "status": "String (enum: ['pending', 'paid_on_time', 'paid_late', 'overdue'])",
  "createdAt": "Date",
  "updatedAt": "Date",
  "__v": "Number"
}
```

### Reward Model

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (reference to User)",
  "type": "String (enum: ['amazon', 'starbucks', 'target', 'uber'])",
  "amount": "Number (required, min: 0)",
  "description": "String (required)",
  "isRedeemed": "Boolean (default: false)",
  "redeemedAt": "Date (nullable)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "__v": "Number"
}
```

---

## Business Logic Notes

### Reward Eligibility

- Users earn rewards after paying 5 consecutive bills on time
- Reward types and amounts are randomly selected from predefined options:
  - Amazon Gift Card: $5, $10, $15, $20
  - Starbucks Gift Card: $5, $10, $15
  - Target Gift Card: $10, $15, $20, $25
  - Uber Credit: $10, $15, $20

### Bill Status Logic

- **pending**: Bill created but not yet paid
- **paid_on_time**: Bill paid on or before due date
- **paid_late**: Bill paid after due date
- **overdue**: Bill not paid and past due date (automatically updated)

### Authentication

This API currently does not implement authentication. In a production environment, you would need to add proper authentication and authorization mechanisms.
