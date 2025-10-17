# 📊 Sample Test Data for Booking API

## 🧪 Test Data Sets

### 1. Sample Users
```json
{
  "users": [
    {
      "user_id": 1,
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phone": "+1-555-0123"
    },
    {
      "user_id": 2,
      "name": "Jane Smith", 
      "email": "jane.smith@email.com",
      "phone": "+1-555-0124"
    },
    {
      "user_id": 3,
      "name": "Bob Johnson",
      "email": "bob.johnson@email.com", 
      "phone": "+1-555-0125"
    }
  ]
}
```

### 2. Sample Services
```json
{
  "services": [
    {
      "service_id": 1,
      "name": "House Cleaning",
      "description": "Deep cleaning service for residential properties",
      "duration_minutes": 120,
      "price": 150.00,
      "provider_id": 5
    },
    {
      "service_id": 2,
      "name": "Lawn Mowing",
      "description": "Regular lawn maintenance and mowing",
      "duration_minutes": 60,
      "price": 75.00,
      "provider_id": 6
    },
    {
      "service_id": 3,
      "name": "Plumbing Repair",
      "description": "Emergency plumbing services",
      "duration_minutes": 90,
      "price": 200.00,
      "provider_id": 7
    }
  ]
}
```

### 3. Sample Providers
```json
{
  "providers": [
    {
      "provider_id": 5,
      "name": "CleanPro Services",
      "email": "info@cleanpro.com",
      "phone": "+1-555-0200"
    },
    {
      "provider_id": 6,
      "name": "GreenLawn Care",
      "email": "contact@greenlawn.com", 
      "phone": "+1-555-0201"
    },
    {
      "provider_id": 7,
      "name": "FixIt Plumbing",
      "email": "service@fixitplumbing.com",
      "phone": "+1-555-0202"
    }
  ]
}
```

---

## 📝 Sample API Requests

### 1. Create Booking - House Cleaning
```json
POST /api/bookings
{
  "user_id": 1,
  "service_id": 1,
  "start_time": "2025-01-15T10:00:00Z",
  "end_time": "2025-01-15T12:00:00Z",
  "booking_title": "Weekly House Cleaning",
  "booking_description": "Deep cleaning of 3-bedroom apartment including kitchen and bathrooms",
  "service_address": "123 Main Street, Apartment 4B, New York, NY 10001",
  "meeting_instructions": "Ring doorbell twice, I'll be home",
  "special_instructions": "Please use eco-friendly products only",
  "booking_source": "web"
}
```

### 2. Create Booking - Lawn Mowing
```json
POST /api/bookings
{
  "user_id": 2,
  "service_id": 2,
  "start_time": "2025-01-16T09:00:00Z",
  "end_time": "2025-01-16T10:00:00Z",
  "booking_title": "Regular Lawn Maintenance",
  "booking_description": "Weekly lawn mowing and edge trimming",
  "service_address": "456 Oak Avenue, Suburb, CA 90210",
  "meeting_instructions": "Gate code is 1234, please close gate when done",
  "special_instructions": "Please bag the clippings",
  "booking_source": "mobile_app"
}
```

### 3. Create Booking - Plumbing Emergency
```json
POST /api/bookings
{
  "user_id": 3,
  "service_id": 3,
  "start_time": "2025-01-15T14:30:00Z",
  "end_time": "2025-01-15T16:00:00Z",
  "booking_title": "Kitchen Sink Repair",
  "booking_description": "Kitchen sink is clogged and water is backing up",
  "service_address": "789 Pine Street, Unit 12, Seattle, WA 98101",
  "meeting_instructions": "Call when you arrive, I'll let you in",
  "special_instructions": "This is urgent - water is backing up into the kitchen",
  "booking_source": "api"
}
```

---

## 🔄 Complete Test Scenarios

### Scenario 1: Successful Booking Lifecycle
1. **Create Booking** → Status: `pending`
2. **Confirm Booking** → Status: `confirmed` 
3. **Start Service** → Status: `in_progress`
4. **Complete Booking** → Status: `completed`

### Scenario 2: User Cancellation
1. **Create Booking** → Status: `pending`
2. **Cancel Booking** (user_request) → Status: `cancelled_user`

### Scenario 3: Provider Cancellation
1. **Create Booking** → Status: `pending`
2. **Confirm Booking** → Status: `confirmed`
3. **Cancel Booking** (provider_unavailable) → Status: `cancelled_provider`

### Scenario 4: Weather Cancellation
1. **Create Booking** → Status: `pending`
2. **Cancel Booking** (weather) → Status: `cancelled_user`

---

## 📊 Search Test Cases

### Search by User ID
```
GET /api/bookings/search?user_id=1
```

### Search by Provider ID
```
GET /api/bookings/search?provider_id=5
```

### Search by Status
```
GET /api/bookings/search?status=pending
GET /api/bookings/search?status=confirmed
GET /api/bookings/search?status=completed
```

### Search by Date
```
GET /api/bookings/search?booking_date=2025-01-15
```

### Combined Search
```
GET /api/bookings/search?user_id=1&status=pending&booking_date=2025-01-15
```

---

## ❌ Error Test Cases

### 1. Missing Required Fields
```json
POST /api/bookings
{
  "booking_title": "Invalid Booking"
}
```
**Expected Response:**
```json
{
  "success": false,
  "message": "User ID and Service ID are required"
}
```

### 2. Invalid Booking ID
```
GET /api/bookings/99999
```
**Expected Response:**
```json
{
  "success": false,
  "message": "Booking not found"
}
```

### 3. Invalid User ID Format
```
GET /api/bookings/user/invalid
```
**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid user ID"
}
```

### 4. Missing Cancellation Reason
```json
DELETE /api/bookings/123
{
  "cancelled_by": 1
}
```
**Expected Response:**
```json
{
  "success": false,
  "message": "Cancellation reason is required"
}
```

---

## 🎯 Quick Test Checklist

- [ ] Health check endpoint works
- [ ] Create booking with all required fields
- [ ] Create booking with missing required fields (should fail)
- [ ] Get booking by valid ID
- [ ] Get booking by invalid ID (should fail)
- [ ] Search all bookings
- [ ] Search by user ID
- [ ] Search by provider ID
- [ ] Search by status
- [ ] Search by date
- [ ] Get user bookings with pagination
- [ ] Get provider bookings with pagination
- [ ] Confirm booking
- [ ] Start service
- [ ] Complete booking
- [ ] Update booking details
- [ ] Cancel booking (user request)
- [ ] Cancel booking (provider unavailable)
- [ ] Cancel booking (weather)
- [ ] Cancel booking (emergency)

---

## 📱 Postman Environment Variables

Set these variables in your Postman environment:

```json
{
  "baseUrl": "http://localhost:5000",
  "userId": "1",
  "serviceId": "1", 
  "providerId": "5",
  "bookingId": ""
}
```

The `bookingId` will be automatically set when you create a booking using the Postman collection.

---

**Happy Testing! 🚀**

