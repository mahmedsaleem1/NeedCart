# OTP Email Verification for Registration

## Overview
The registration process now includes email verification via OTP (One-Time Password) for enhanced security. When a buyer or seller registers, they receive a 6-digit OTP via email that must be verified before the account is created.

## Features
- 6-digit OTP generation
- Email delivery with professional template
- 10-minute expiration time
- Resend OTP functionality
- Automatic cleanup of expired OTPs

## API Endpoints

### 1. Register (Send OTP)
**Endpoint:** `POST /api/v1/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "buyer"  // or "seller"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "user@example.com"
  },
  "message": "OTP sent to your email. Please verify to complete registration.",
  "success": true
}
```

**What happens:**
- Validates email and password
- Checks if user already exists
- Generates 6-digit OTP
- Stores OTP in database (expires in 10 minutes)
- Sends OTP via email
- Returns success message

---

### 2. Verify OTP
**Endpoint:** `POST /api/v1/auth/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    ...
  },
  "message": "User registered successfully",
  "success": true
}
```

**What happens:**
- Validates OTP against database record
- Creates Firebase user account
- Creates Buyer or Seller record in MongoDB
- Deletes OTP record
- Returns user data

---

### 3. Resend OTP
**Endpoint:** `POST /api/v1/auth/resend-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "user@example.com"
  },
  "message": "OTP resent successfully",
  "success": true
}
```

**What happens:**
- Finds existing OTP record
- Generates new 6-digit OTP
- Updates database with new OTP and timestamp
- Sends new OTP via email

---

## Registration Flow

### Step 1: User submits registration form
```
Frontend -> POST /api/v1/auth/signup
{
  email: "user@example.com",
  password: "password123",
  role: "buyer"
}
```

### Step 2: Backend sends OTP
```
- Generates OTP: 123456
- Stores in database (expires in 10 minutes)
- Sends email to user
- Returns success response
```

### Step 3: User receives email
```
Subject: Verify Your Email - NeedCart Registration
Body: Your OTP is: 123456 (valid for 10 minutes)
```

### Step 4: User enters OTP
```
Frontend -> POST /api/v1/auth/verify-otp
{
  email: "user@example.com",
  otp: "123456"
}
```

### Step 5: Backend verifies and creates account
```
- Validates OTP
- Creates Firebase user
- Creates Buyer/Seller in MongoDB
- Deletes OTP record
- Returns user data
```

### Optional: Resend OTP
```
Frontend -> POST /api/v1/auth/resend-otp
{
  email: "user@example.com"
}
```

---

## Database Schema

### OTP Model
```javascript
{
  email: String,        // User's email
  otp: String,          // 6-digit OTP
  role: String,         // "buyer" or "seller"
  password: String,     // Stored temporarily until verification
  createdAt: Date,      // Auto-expires after 600 seconds (10 minutes)
}
```

---

## Email Template
The OTP email includes:
- Professional NeedCart branding
- Large, easy-to-read OTP code
- 10-minute validity notice
- Security warning
- Responsive HTML design

---

## Error Handling

### Common Errors:

**1. User already exists**
```json
{
  "statusCode": 400,
  "message": "User with this email already exists"
}
```

**2. Invalid or expired OTP**
```json
{
  "statusCode": 400,
  "message": "Invalid or expired OTP"
}
```

**3. Missing fields**
```json
{
  "statusCode": 400,
  "message": "Email and password are required"
}
```

**4. No pending registration (resend)**
```json
{
  "statusCode": 400,
  "message": "No pending registration found for this email"
}
```

---

## Frontend Implementation Example

```javascript
// Step 1: Register and send OTP
const handleRegister = async (email, password, role) => {
  try {
    const response = await fetch('/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show OTP input form
      showOTPForm(email);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Step 2: Verify OTP
const handleVerifyOTP = async (email, otp) => {
  try {
    const response = await fetch('/api/v1/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Registration complete, proceed to login
      proceedToLogin(data.data);
    }
  } catch (error) {
    console.error('OTP verification error:', error);
  }
};

// Step 3: Resend OTP (optional)
const handleResendOTP = async (email) => {
  try {
    const response = await fetch('/api/v1/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success message
      showSuccessMessage('OTP resent successfully');
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
  }
};
```

---

## Testing

### Manual Testing Steps:

1. **Test Registration Flow:**
   - Send POST to `/api/v1/auth/signup` with valid data
   - Check email inbox for OTP
   - Send POST to `/api/v1/auth/verify-otp` with correct OTP
   - Verify user created in Firebase and MongoDB

2. **Test OTP Expiration:**
   - Register and wait 10+ minutes
   - Try to verify with expired OTP
   - Should receive "Invalid or expired OTP" error

3. **Test Resend OTP:**
   - Register and receive OTP
   - Call `/api/v1/auth/resend-otp`
   - Verify new OTP is sent and old one is invalidated

4. **Test Invalid OTP:**
   - Register and receive OTP
   - Try to verify with wrong OTP
   - Should receive error

5. **Test Duplicate Registration:**
   - Register and complete verification
   - Try to register again with same email
   - Should receive "User already exists" error

---

## Security Features

1. **Time-limited OTPs:** Expire after 10 minutes
2. **One-time use:** OTP deleted after successful verification
3. **Email-only delivery:** OTP sent only to registered email
4. **Strong password requirement:** Enforced by Firebase
5. **Automatic cleanup:** MongoDB TTL index removes expired OTPs
6. **No password storage:** Temporary password only stored until verification

---

## Environment Variables Required

Make sure these are set in your `.env` file:
```
GMAIL_EMAIL_ADDRESS=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password
```

---

## Notes

- OTPs are automatically deleted after 10 minutes by MongoDB TTL index
- Each new registration overwrites any existing OTP for that email
- Users can request new OTP if previous one expires
- After successful verification, users can login normally with their credentials
