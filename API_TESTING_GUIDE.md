# 🚀 Booking API Testing Guide

## 📋 Table of Contents
1. [API Overview](#api-overview)
2. [Base Configuration](#base-configuration)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Testing Scenarios](#testing-scenarios)
7. [Error Handling](#error-handling)
8. [Postman Collection](#postman-collection)

---

## 🌐 API Overview

**Base URL:** `http://localhost:5000`  
**Content-Type:** `application/json`  
**Database:** PostgreSQL with stored procedures

---

## ⚙️ Base Configuration

### Environment Variables
Create a `.env` file in your project root:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
PORT=5000
NODE_ENV=development
```

### Health Check
**GET** `/health`
```json
Response:
{
  "success": true,
  "message": "Booking API is running",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

## 🔐 Authentication
*Note: Currently no authentication is implemented. Add JWT or session-based auth as needed.*

---

## 📡 API Endpoints

### 1. Create Booking
**POST** `/api/bookings`

**Request Body:**
```json
{
  "user_id": 1,
  "service_id": 1,
  "start_time": "2025-01-15T10:00:00Z",
  "end_time": "2025-01-15T11:00:00Z",
  "booking_title": "House Cleaning Service",
  "booking_description": "Deep cleaning of 3-bedroom apartment",
  "service_address": "123 Main St, City, State 12345",
  "meeting_instructions": "Ring doorbell twice",
  "special_instructions": "Please use eco-friendly products",
  "booking_source": "web"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking_id": 123
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "User ID and Service ID are required"
}
```

---

### 2. Get Booking by ID
**GET** `/api/bookings/:id`

**Example:** `GET /api/bookings/123`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "booking_id": 123,
    "booking_ref": "BK1000123",
    "service_id": 1,
    "user_id": 1,
    "provider_id": 5,
    "booking_title": "House Cleaning Service",
    "booking_description": "Deep cleaning of 3-bedroom apartment",
    "service_price": 150.00,
    "platform_fee": 15.00,
    "taxes": 12.00,
    "total_amount": 177.00,
    "currency_code": "USD",
    "booking_date": "2025-01-15",
    "start_time": "2025-01-15T10:00:00Z",
    "end_time": "2025-01-15T11:00:00Z",
    "duration_minutes": 60,
    "service_address": "123 Main St, City, State 12345",
    "meeting_instructions": "Ring doorbell twice",
    "status": "pending",
    "booking_source": "web",
    "special_instructions": "Please use eco-friendly products",
    "created_at": "2025-01-15T09:30:00Z",
    "updated_at": "2025-01-15T09:30:00Z",
    "is_deleted": false
  }
}
```

---

### 3. Search Bookings
**GET** `/api/bookings/search`

**Query Parameters:**
- `user_id` (optional): Filter by user ID
- `provider_id` (optional): Filter by provider ID  
- `status` (optional): Filter by booking status
- `booking_date` (optional): Filter by booking date (YYYY-MM-DD)

**Examples:**
- `GET /api/bookings/search`
- `GET /api/bookings/search?user_id=1`
- `GET /api/bookings/search?status=pending&booking_date=2025-01-15`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": 123,
      "booking_ref": "BK1000123",
      "booking_date": "2025-01-15",
      "status": "pending"
    },
    {
      "booking_id": 124,
      "booking_ref": "BK1000124", 
      "booking_date": "2025-01-15",
      "status": "confirmed"
    }
  ]
}
```

---

### 4. Get Bookings by User
**GET** `/api/bookings/user/:userId`

**Query Parameters:**
- `limit` (optional): Number of records (default: 10)
- `offset` (optional): Number of records to skip (default: 0)

**Example:** `GET /api/bookings/user/1?limit=5&offset=0`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": 123,
      "booking_ref": "BK1000123",
      "booking_date": "2025-01-15",
      "status": "pending"
    }
  ]
}
```

---

### 5. Get Bookings by Provider
**GET** `/api/bookings/provider/:providerId`

**Query Parameters:**
- `limit` (optional): Number of records (default: 10)
- `offset` (optional): Number of records to skip (default: 0)

**Example:** `GET /api/bookings/provider/5?limit=10&offset=0`

---

### 6. Confirm Booking
**PUT** `/api/bookings/:id/confirm`

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Booking confirmed successfully"
}
```

---

### 7. Complete Booking
**PUT** `/api/bookings/:id/complete`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Booking completed successfully"
}
```

---

### 8. Start Service
**PUT** `/api/bookings/:id/start`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Service started successfully"
}
```

---

### 9. Update Booking
**PUT** `/api/bookings/:id`

**Request Body:**
```json
{
  "booking_title": "Updated House Cleaning Service",
  "booking_description": "Updated description",
  "service_address": "456 New St, City, State 12345",
  "meeting_instructions": "Updated instructions",
  "special_instructions": "Updated special instructions",
  "provider_notes": "Provider notes here",
  "user_notes": "User notes here"
}
```

---

### 10. Cancel Booking
**DELETE** `/api/bookings/:id`

**Request Body:**
```json
{
  "cancelled_by": 1,
  "reason": "user_request",
  "notes": "Change of plans"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

## 📊 Data Models

### Booking Status Enum
```typescript
enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed', 
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED_USER = 'cancelled_user',
  CANCELLED_PROVIDER = 'cancelled_provider',
  NO_SHOW_USER = 'no_show_user',
  NO_SHOW_PROVIDER = 'no_show_provider',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded'
}
```

### Booking Source Enum
```typescript
enum BookingSource {
  WEB = 'web',
  MOBILE_APP = 'mobile_app',
  API = 'api',
  ADMIN_PANEL = 'admin_panel'
}
```

### Cancellation Reason Enum
```typescript
enum CancellationReason {
  USER_REQUEST = 'user_request',
  PROVIDER_UNAVAILABLE = 'provider_unavailable',
  WEATHER = 'weather',
  EMERGENCY = 'emergency',
  PAYMENT_FAILED = 'payment_failed',
  SERVICE_NOT_AVAILABLE = 'service_not_available',
  OTHER = 'other'
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Booking Lifecycle
1. **Create Booking** → Status: `pending`
2. **Confirm Booking** → Status: `confirmed`
3. **Start Service** → Status: `in_progress`
4. **Complete Booking** → Status: `completed`

### Scenario 2: Booking Cancellation
1. **Create Booking** → Status: `pending`
2. **Cancel Booking** → Status: `cancelled_user`

### Scenario 3: Search and Filter
1. **Create Multiple Bookings** with different users/providers
2. **Search by User ID**
3. **Search by Provider ID**
4. **Search by Status**
5. **Search by Date**

---

## ❌ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "User ID and Service ID are required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Booking not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Database Connection Error:**
```json
{
  "success": false,
  "message": "schema \"booking\" does not exist"
}
```

---

## 📮 Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Booking API",
    "description": "Complete booking system API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Create Booking",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"user_id\": 1,\n  \"service_id\": 1,\n  \"start_time\": \"2025-01-15T10:00:00Z\",\n  \"end_time\": \"2025-01-15T11:00:00Z\",\n  \"booking_title\": \"House Cleaning Service\",\n  \"booking_description\": \"Deep cleaning of 3-bedroom apartment\",\n  \"service_address\": \"123 Main St, City, State 12345\",\n  \"meeting_instructions\": \"Ring doorbell twice\",\n  \"special_instructions\": \"Please use eco-friendly products\",\n  \"booking_source\": \"web\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/bookings",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings"]
        }
      }
    },
    {
      "name": "Get Booking by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/bookings/123",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "123"]
        }
      }
    },
    {
      "name": "Search Bookings",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/bookings/search?user_id=1&status=pending",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "search"],
          "query": [
            {
              "key": "user_id",
              "value": "1"
            },
            {
              "key": "status",
              "value": "pending"
            }
          ]
        }
      }
    },
    {
      "name": "Get Bookings by User",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/bookings/user/1?limit=10&offset=0",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "user", "1"],
          "query": [
            {
              "key": "limit",
              "value": "10"
            },
            {
              "key": "offset",
              "value": "0"
            }
          ]
        }
      }
    },
    {
      "name": "Get Bookings by Provider",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/bookings/provider/5?limit=10&offset=0",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "provider", "5"],
          "query": [
            {
              "key": "limit",
              "value": "10"
            },
            {
              "key": "offset",
              "value": "0"
            }
          ]
        }
      }
    },
    {
      "name": "Confirm Booking",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"user_id\": 1\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/bookings/123/confirm",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "123", "confirm"]
        }
      }
    },
    {
      "name": "Start Service",
      "request": {
        "method": "PUT",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/bookings/123/start",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "123", "start"]
        }
      }
    },
    {
      "name": "Complete Booking",
      "request": {
        "method": "PUT",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/bookings/123/complete",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "123", "complete"]
        }
      }
    },
    {
      "name": "Update Booking",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"booking_title\": \"Updated House Cleaning Service\",\n  \"booking_description\": \"Updated description\",\n  \"service_address\": \"456 New St, City, State 12345\",\n  \"meeting_instructions\": \"Updated instructions\",\n  \"special_instructions\": \"Updated special instructions\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/bookings/123",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "123"]
        }
      }
    },
    {
      "name": "Cancel Booking",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"cancelled_by\": 1,\n  \"reason\": \"user_request\",\n  \"notes\": \"Change of plans\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/bookings/123",
          "host": ["{{baseUrl}}"],
          "path": ["api", "bookings", "123"]
        }
      }
    }
  ]
}
```

---

## 🚀 Quick Start Testing

1. **Start your server:** `npm run dev`
2. **Import the Postman collection** above
3. **Set the baseUrl variable** to `http://localhost:5000`
4. **Test the health endpoint** first
5. **Create a booking** using the POST endpoint
6. **Test other endpoints** using the returned booking ID

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary amounts are in decimal format (e.g., 150.00)
- The API uses stored procedures for database operations
- Make sure your PostgreSQL database schema is set up before testing
- The `booking_source` defaults to "web" if not provided
- All endpoints return consistent JSON responses with `success` and `message` fields

---

**Happy Testing! 🎉**

