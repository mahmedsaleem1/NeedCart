# Quick Reference: Like & Payment Features

## 🚀 Testing the Features

### Test Like Feature

1. **Login as a buyer or seller**
2. **Navigate to any post** (`/post/:postId`)
3. **Click the heart icon** - Post gets liked
4. **Click again** - Post gets unliked
5. **Try to like again** - Should work (unlike → like)
6. **Refresh page** - Like state should persist

### Test Payment Feature

1. **Login as a buyer** (the one who created the post)
2. **Have a seller send an offer** to your post
3. **Navigate to your post** (`/post/:postId`)
4. **Click "Offers" tab** - You should see the offer
5. **Click "Accept" button**
6. **Confirm the dialog** - "You will be redirected to payment"
7. **Payment redirect modal appears** with spinning credit card
8. **Stripe checkout opens** - Complete payment with test card
   - Card Number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
9. **After payment** - You'll be redirected back
10. **Check database** - Order status should be "confirmed"

---

## 🔑 API Endpoints Used

### Like Endpoints
```
POST /like/do-like
POST /like/do-unlike
GET  /like/get-likes/:postId
```

### Offer & Payment Endpoints
```
POST /offer/accept/:offerId
POST /item/buy/:itemId (offerId)
GET  /item/success?session_id=xxx
GET  /item/cancel?session_id=xxx
```

---

## 🎯 Key Functions

### Backend
- `likePost()` - Creates like with duplicate check
- `acceptOffer()` - Updates offer status and closes post
- `performTOP()` - Orchestrates Transaction → Order → Payment
- `createCheckoutSession_INTERNAL()` - Creates Stripe session

### Frontend
- `LikeButton.handleLike()` - Toggles like/unlike
- `OfferCard.handleAccept()` - Accepts offer and redirects to payment
- `Post.fetchPostData()` - Fetches post, comments, likes, offers

---

## 🛠️ Troubleshooting

### "Already liked this post" error keeps showing
- **Backend is preventing duplicate** - This is correct behavior
- **Frontend should update UI silently** - Check LikeButton.jsx error handling

### Payment redirect not working
- **Check Stripe credentials** in `.env`
- **Verify VITE_URL** is correct
- **Check browser console** for network errors
- **Ensure offer._id is valid** - Check OfferCard props

### isPostOwner is false even though I'm the owner
- **Log out and log back in** to get Firebase UID in Redux
- **OR** - The fallback in Post.jsx should fetch UID from Firebase Auth

### Offers tab not visible
- **Check role** - Must be post owner or seller
- **Check console logs** - Look for "Can View Offers: false"
- **Verify Firebase UID** is being fetched correctly

---

## 📊 Database Queries to Verify

### Check if like exists
```javascript
db.likes.findOne({ buyerId: ObjectId("..."), postId: ObjectId("...") })
```

### Check transaction status
```javascript
db.transactions.find({ offerId: ObjectId("...") })
```

### Check order status
```javascript
db.orders.find({ postId: ObjectId("...") })
```

### Check offer status
```javascript
db.offers.findOne({ _id: ObjectId("...") })
// Should have status: 'accepted'
```

---

## 🎨 UI States

### LikeButton States
- ✅ **Liked**: Red background, filled heart icon
- ⭕ **Not Liked**: Gray background, outline heart icon
- ⏳ **Loading**: Disabled, opacity reduced

### OfferCard States
- 🟡 **Pending**: Yellow badge, Accept/Reject buttons visible
- 🟢 **Accepted**: Green badge, success message shown
- 🔴 **Rejected**: Red badge, rejection message shown
- 💳 **Processing Payment**: Payment redirect modal visible

---

## 🔄 State Flow Diagrams

### Like Flow
```
User clicks Like
    ↓
Check if authenticated
    ↓
Send POST /like/do-like
    ↓
Backend checks for duplicate
    ↓
If duplicate → Return error
If not → Create like
    ↓
Frontend updates UI
    ↓
Like count increments
Heart icon fills with red
```

### Payment Flow
```
Buyer clicks Accept Offer
    ↓
Confirm dialog shown
    ↓
POST /offer/accept/:offerId
    ↓
Offer status → 'accepted'
Post status → 'closed'
    ↓
POST /item/buy/:offerId
    ↓
Transaction created (pending)
Order created (pending)
Stripe session created
    ↓
Redirect to Stripe checkout
    ↓
User completes payment
    ↓
Stripe redirects to success URL
    ↓
Transaction status → 'paid'
Order status → 'confirmed'
```

---

## ⚡ Quick Fixes

### Reset like state if stuck
```javascript
// In browser console
fetch('http://localhost:3000/like/do-unlike', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postId: 'POST_ID_HERE' })
})
```

### Check Firebase UID in console
```javascript
// In browser console
console.log('Redux User:', store.getState().auth.user);
console.log('Firebase User:', auth.currentUser);
```

### Clear Redux persist state
```javascript
// In browser console
localStorage.clear();
location.reload();
```

---

## 📝 Component Props Reference

### LikeButton
```jsx
<LikeButton 
    postId="690cc1b73e941041ed8c7c03"
    initialLikes={[
        { _id: "...", buyerId: { email: "..." } }
    ]}
/>
```

### OfferCard
```jsx
<OfferCard
    offer={{
        _id: "...",
        senderId: { email: "..." },
        amount: 5000,
        status: "pending",
        createdAt: "2025-11-06T..."
    }}
    isPostOwner={true}
    postStatus="open"
    onOfferUpdated={() => fetchPostData()}
/>
```

### PaymentRedirect
```jsx
{isRedirectingToPayment && <PaymentRedirect />}
```

---

## 🎯 Success Criteria

### Like Feature
- ✅ Users can like/unlike posts
- ✅ Duplicate likes are prevented
- ✅ UI updates in real-time
- ✅ Like count is accurate
- ✅ No error alerts for duplicate likes

### Payment Feature
- ✅ Offer acceptance triggers payment
- ✅ Stripe checkout session is created
- ✅ User is redirected to Stripe
- ✅ Payment completion creates order
- ✅ Post closes after offer acceptance
- ✅ Transaction and order are tracked

---

**Quick Start Commands:**
```bash
# Backend
cd Backend
npm start

# Frontend
cd Frontend
npm run dev
```

**Environment Files:**
```bash
# Backend/.env
STRIPE_SECRET_KEY=sk_test_...
LOCAL_URL=http://localhost:3000

# Frontend/.env
VITE_URL=http://localhost:3000
```
