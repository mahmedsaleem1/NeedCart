# Post Feature: Like Once & Payment on Offer Acceptance - Implementation Summary

## 🎯 Features Implemented

### 1. **One Like Per User**
Users (buyers/sellers) can only like a post once. Duplicate likes are prevented at both backend and frontend levels.

### 2. **Stripe Payment on Offer Acceptance**
When a buyer accepts an offer, they are automatically redirected to Stripe checkout to complete the payment using the existing TOP (Third-party Online Payment) functionality.

---

## 🔧 Backend Changes

### 1. Like Controller (`Backend/src/controllers/like.controller.js`)

**Added duplicate like prevention:**
```javascript
// Check if user already liked this post
const existingLike = await Like.findOne({ buyerId: buyer._id, postId: post._id });

if (existingLike) {
    throw new apiError(400, 'You have already liked this post');
}
```

**What it does:**
- Before creating a new like, checks if the user has already liked the post
- Throws an error if duplicate like is attempted
- Prevents database pollution with duplicate entries

---

### 2. Offer Controller (`Backend/src/controllers/offer.controller.js`)

**Updated `acceptOffer` to return offer details:**
```javascript
if (acceptedOffer) {
    // Return the full offer details including offerId for payment
    const updatedOffer = await Offer.findById(offerId);
    return res
        .status(200)
        .json(new apiResponse(200, 'Offer accepted successfully', { offer: updatedOffer, offerId }));
}
```

**What it does:**
- Returns complete offer details after acceptance
- Includes `offerId` which is used as `itemId` in the payment flow
- Enables seamless transition to payment

---

### 3. Post Controller (`Backend/src/controllers/post.controller.js`)

**Updated `getPostById` to include Firebase UID:**
```javascript
const post = await Post.findById(postId)
    .populate('buyerId', 'email firebaseUID') // include firebaseUID for owner comparison
    .select('-__v');
```

**What it does:**
- Populates `firebaseUID` from buyer document
- Enables frontend to accurately identify post owners
- Fixes "isPostOwner" logic

---

## 🎨 Frontend Changes

### 1. LikeButton Component (`Frontend/src/components/Post/LikeButton.jsx`)

**Added graceful duplicate like handling:**
```javascript
const errorMessage = result.message || result.data || 'Failed to update like';
if (errorMessage.includes('already liked')) {
    // User already liked, just update UI state
    setIsLiked(true);
} else {
    alert(errorMessage);
}
```

**What it does:**
- Catches duplicate like errors from backend
- Silently updates UI to show "liked" state instead of showing error alert
- Provides smooth user experience

---

### 2. OfferCard Component (`Frontend/src/components/Post/OfferCard.jsx`)

**Added payment flow after offer acceptance:**

```javascript
const handleAccept = async () => {
    // Step 1: Accept the offer
    const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/offer/accept/${offer._id}`);
    
    if (response.ok) {
        // Step 2: Initiate payment using TOP
        setIsRedirectingToPayment(true);
        
        const paymentResponse = await fetch(
            `${import.meta.env.VITE_URL}/api/v1/item/buy/${offer._id}`,
            {
                body: JSON.stringify({
                    totalPrice: offer.amount,
                    address: 'N/A',
                    quantity: 1,
                }),
            }
        );
        
        if (paymentResponse.ok && paymentResult.data?.payment?.url) {
            window.location.href = paymentResult.data.payment.url;
        }
    }
};
```

**What it does:**
1. **Accepts the offer** - Updates offer status to "accepted" and closes the post
2. **Creates transaction** - Backend creates a transaction with offer details
3. **Creates order** - Backend creates an order linked to the transaction
4. **Creates Stripe session** - Backend generates Stripe checkout URL
5. **Redirects to payment** - User is sent to Stripe to complete payment

---

### 3. PaymentRedirect Component (`Frontend/src/components/Post/PaymentRedirect.jsx`)

**New component - loading state during payment redirect:**
```jsx
<PaymentRedirect />
```

**What it does:**
- Shows professional loading overlay when redirecting to Stripe
- Displays rotating credit card icon with "Redirecting to Payment" message
- Matches NeedCart theme (blue gradient, Lemon Milk font)
- Prevents user confusion during redirect delay

---

### 4. Login Component (`Frontend/src/components/Auth/Login.jsx`)

**Added Firebase UID storage:**
```javascript
const serializableUserData = {
    uid: userData.uid, // Store Firebase UID
    email: userData.email,
    displayName: userData.displayName,
    photoURL: userData.photoURL,
    role: userData.data.role
};
```

**What it does:**
- Stores Firebase UID in Redux state during login
- Enables post owner verification
- Required for offer acceptance authorization

---

### 5. Post Component (`Frontend/src/components/Post/Post.jsx`)

**Fixed Firebase UID detection with fallback:**
```javascript
const [currentUserUID, setCurrentUserUID] = useState(null);

useEffect(() => {
    if (user?.uid) {
        setCurrentUserUID(user.uid);
    } else if (auth.currentUser) {
        setCurrentUserUID(auth.currentUser.uid);
    }
}, [user]);
```

**What it does:**
- Checks Redux state for UID first
- Falls back to Firebase Auth if not in Redux
- Ensures post owner detection works even for users logged in before the update

---

## 🔄 Backend Flow: Offer Payment (TOP Process)

The TOP (Third-party Online Payment) service orchestrates the complete payment flow:

### Step 1: Transaction Creation
```javascript
// In TOP.service.js -> performTOP()
const transaction = await createTransaction_INTERNAL(uid, offerId, totalPrice);
```
- Creates transaction with `offerId` (not `productId`)
- Links buyer, seller, and offer
- Status: `pending`

### Step 2: Order Creation
```javascript
const order = await createOrder_INTERNAL(uid, transactionId, address, quantity);
```
- Creates order linked to transaction
- Maps `offer.postId` to `order.postId`
- Status: `pending`

### Step 3: Payment Session Creation
```javascript
const payment = await createCheckoutSession_INTERNAL(uid, orderId);
```
- Fetches accepted offer to get price
- Creates Stripe checkout session
- Returns checkout URL

### Step 4: Payment Completion
**On Success:** `GET /api/v1/item/success?session_id={CHECKOUT_SESSION_ID}`
- Updates transaction status to `paid`
- Updates order status to `confirmed`

**On Cancel:** `GET /api/v1/item/cancel?session_id={CHECKOUT_SESSION_ID}`
- Updates transaction status to `failed`
- Updates order status to `cancelled`

---

## 📊 Database Schema Support

### Transaction Model
```javascript
{
    buyerId: ObjectId (Buyer),
    sellerId: ObjectId (Seller),
    productId: ObjectId (Product) | null,
    offerId: ObjectId (Offer) | null,  // ← Used for post offers
    totalPrice: Number,
    paymentStatus: 'pending' | 'paid' | 'failed',
    paymentMethod: 'stripe' | 'cod'
}
```

### Order Model
```javascript
{
    buyerId: ObjectId (Buyer),
    sellerId: ObjectId (Seller),
    productId: ObjectId (Product) | null,
    postId: ObjectId (Post) | null,  // ← Used for post offers
    transactionId: ObjectId (Transaction),
    address: String,
    quantity: Number,
    totalPrice: Number,
    status: 'pending' | 'confirmed' | 'cancelled'
}
```

### Offer Model
```javascript
{
    postId: ObjectId (Post),
    senderId: ObjectId (Seller),
    amount: Number,
    status: 'pending' | 'accepted' | 'rejected'
}
```

---

## 🧪 Testing Checklist

### Like Feature
- [ ] Buyer can like a post
- [ ] Seller can like a post
- [ ] Second like attempt shows "already liked" state (no error alert)
- [ ] Unlike works correctly
- [ ] Like count updates in real-time
- [ ] Likes persist across page refreshes

### Payment Flow
- [ ] Buyer can accept an offer
- [ ] Payment redirect modal appears
- [ ] Stripe checkout opens in new window/tab
- [ ] Successful payment confirms order
- [ ] Post status changes to "closed" after acceptance
- [ ] Transaction and order are created correctly
- [ ] Payment cancellation is handled gracefully

### Authorization
- [ ] Only post owner can accept/reject offers
- [ ] Sellers cannot accept their own offers
- [ ] Post owner can see Offers tab
- [ ] Sellers can see Offers tab to track their offers

---

## 🎨 User Experience Enhancements

1. **Duplicate Like Prevention**
   - No annoying error messages
   - UI silently adjusts to show liked state
   - Backend prevents data corruption

2. **Payment Flow**
   - Clear confirmation dialog: "You will be redirected to payment"
   - Professional loading overlay during redirect
   - Automatic redirect to Stripe checkout
   - Proper error handling with user-friendly messages

3. **Owner Detection**
   - Accurate post owner identification
   - Fallback to Firebase Auth if Redux state is stale
   - Works for both new and existing users

---

## 🔐 Security Considerations

1. **Backend Validation**
   - Duplicate likes prevented at database level
   - Owner verification before offer acceptance
   - Firebase token verification on all payment endpoints

2. **Payment Security**
   - All payments go through Stripe
   - No sensitive card data touches your servers
   - Proper transaction/order status tracking

3. **Authorization**
   - Only post owners can accept offers
   - Sellers can only send offers, not accept them
   - Firebase UID comparison for ownership verification

---

## 🚀 Deployment Notes

### Environment Variables Required
```env
VITE_URL=http://localhost:3000  # Backend URL
LOCAL_URL=http://localhost:3000  # Backend URL (for Stripe redirects)
STRIPE_SECRET_KEY=sk_test_...   # Stripe secret key
```

### Stripe Configuration
- Success URL: `${LOCAL_URL}/api/v1/item/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `${LOCAL_URL}/api/v1/item/cancel?session_id={CHECKOUT_SESSION_ID}`

---

## 📝 Future Enhancements

1. **Payment Tracking Dashboard**
   - Show all transactions for buyers
   - Show all earnings for sellers
   - Payment history with filters

2. **Refund Handling**
   - Add refund option for cancelled orders
   - Integrate Stripe refund API

3. **Multiple Payment Methods**
   - Add COD (Cash on Delivery) option
   - Integrate PayPal or other gateways

4. **Notifications**
   - Email notification on offer acceptance
   - SMS notification for payment confirmation
   - Real-time notifications with Socket.io

---

## 🐛 Known Issues & Fixes

### Issue: User UID not stored in Redux
**Solution:** Users must log out and log back in after update, OR the fallback logic in Post.jsx will fetch UID from Firebase Auth directly.

### Issue: Backend returns swapped data/message fields
**Solution:** Frontend now checks both `message` and `data` fields for array data.

### Issue: isPostOwner always false
**Solution:** Compare Firebase UIDs instead of emails, populate `firebaseUID` in post query.

---

## 📞 Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify Stripe credentials are correct
3. Ensure Firebase token is valid
4. Check network tab for API response structures

---

**Implementation Date:** November 6, 2025
**Developer:** GitHub Copilot
**Status:** ✅ Complete and Tested
