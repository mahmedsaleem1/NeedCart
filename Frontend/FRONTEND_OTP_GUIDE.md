# Frontend OTP Verification Implementation Guide

This guide shows how to implement the OTP verification UI in your React frontend.

## Required Pages/Components

1. **Registration Page** - Initial signup form
2. **OTP Verification Modal/Page** - Enter OTP
3. **API Service** - Handle backend communication

---

## Example Implementation

### 1. Registration Form Component

```jsx
import { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer' // or 'seller'
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Show OTP verification modal
        setShowOTPModal(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Register'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {showOTPModal && (
        <OTPVerificationModal
          email={formData.email}
          onClose={() => setShowOTPModal(false)}
          onSuccess={() => {
            // Navigate to login or dashboard
            window.location.href = '/login';
          }}
        />
      )}
    </div>
  );
};

export default RegisterForm;
```

---

### 2. OTP Verification Modal Component

```jsx
import { useState, useEffect } from 'react';

const OTPVerificationModal = ({ email, onClose, onSuccess }) => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Invalid OTP');
        setOTP(['', '', '', '', '', '']);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setTimer(600); // Reset timer
        setCanResend(false);
        setOTP(['', '', '', '', '', '']);
        alert('New OTP sent to your email');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit OTP to {email}</p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !digit && index > 0) {
                  document.getElementById(`otp-${index - 1}`).focus();
                }
              }}
            />
          ))}
        </div>

        {error && <div className="error">{error}</div>}

        <div className="timer">
          Time remaining: {formatTime(timer)}
        </div>

        <button onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {canResend ? (
          <button onClick={handleResend} disabled={loading}>
            Resend OTP
          </button>
        ) : (
          <p className="resend-hint">
            Didn't receive OTP? Resend available in {formatTime(timer)}
          </p>
        )}

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
```

---

### 3. CSS Styling Example

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

/* OTP Input Styling */
.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 30px 0;
}

.otp-inputs input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.otp-inputs input:focus {
  border-color: #4CAF50;
  outline: none;
}

/* Timer */
.timer {
  margin: 20px 0;
  font-size: 14px;
  color: #666;
}

/* Error Message */
.error {
  color: #f44336;
  margin: 10px 0;
  padding: 10px;
  background: #ffebee;
  border-radius: 5px;
}

/* Buttons */
button {
  padding: 12px 24px;
  margin: 10px 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:first-of-type {
  background-color: #4CAF50;
  color: white;
}

button:first-of-type:hover:not(:disabled) {
  background-color: #45a049;
}
```

---

### 4. API Service (Optional)

```javascript
// services/authService.js

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const authService = {
  // Register and send OTP
  register: async (email, password, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return response.json();
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return response.json();
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  }
};
```

---

## User Flow

1. User fills registration form (email, password, role)
2. Click "Register" button
3. Backend sends OTP to email
4. OTP modal appears
5. User checks email and enters 6-digit OTP
6. User clicks "Verify OTP"
7. If correct: Account created, redirect to login
8. If incorrect: Show error, allow retry
9. If expired: User can click "Resend OTP"

---

## Tips

1. **Auto-focus**: Automatically move to next input when user types
2. **Paste support**: Allow pasting full OTP code
3. **Keyboard navigation**: Support backspace to go to previous input
4. **Timer display**: Show countdown for OTP expiration
5. **Resend logic**: Enable resend button only after some time
6. **Error handling**: Clear and specific error messages
7. **Loading states**: Show loading indicators during API calls

---

## Testing Checklist

- [ ] Registration form validation works
- [ ] OTP sent successfully
- [ ] OTP modal displays correctly
- [ ] Can enter 6-digit OTP
- [ ] Verification works with correct OTP
- [ ] Error shown for incorrect OTP
- [ ] Timer counts down correctly
- [ ] Resend OTP works
- [ ] Can cancel/close modal
- [ ] Success redirects to correct page

---

## Notes

- Update `API_BASE_URL` based on your backend URL
- Consider adding loading spinners
- Add proper form validation
- Implement responsive design for mobile
- Consider accessibility (ARIA labels, keyboard navigation)
