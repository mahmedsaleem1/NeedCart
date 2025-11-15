# Payment Redirect Setup

## Environment Variable Required

Add this to your `Backend/.env` file:

```env
FRONTEND_URL=http://localhost:5173
```

This URL is used to redirect users back to the frontend after payment completion.

## How It Works

### Success Flow:
1. User accepts offer
2. Redirected to Stripe checkout
3. Completes payment
4. Stripe redirects to: `LOCAL_URL/item/success?session_id=xxx`
5. Backend updates transaction to "paid" and order to "confirmed"
6. Backend redirects to: `FRONTEND_URL/post/{postId}?payment=success`
7. Frontend shows success message and refreshed offer status

### Cancel Flow:
1. User accepts offer
2. Redirected to Stripe checkout
3. Clicks "Back" or cancels
4. Stripe redirects to: `LOCAL_URL/item/cancel?session_id=xxx`
5. Backend updates transaction to "failed" and order to "cancelled"
6. Backend redirects to: `FRONTEND_URL/post/{postId}?payment=cancel`
7. Frontend shows cancel message and offer remains "accepted"

## Testing

### Success Payment:
1. Accept an offer
2. Use test card: `4242 4242 4242 4242`
3. Complete payment
4. You'll be redirected back to the post with green success banner
5. Offer status will show "Accepted" with green badge

### Cancelled Payment:
1. Accept an offer
2. Click browser back button or "Cancel" in Stripe
3. You'll be redirected back to the post with red cancel banner
4. Offer status will still show "Accepted" (offer was already accepted before payment)

## Important Notes

- The offer is accepted BEFORE payment (business logic)
- Payment failure doesn't revert the offer acceptance
- If payment fails, the buyer needs to contact support or create a new payment manually
- Consider implementing a "Retry Payment" button for failed payments

## Production Setup

For production, update both:

```env
# Backend/.env
FRONTEND_URL=https://your-domain.com
LOCAL_URL=https://api.your-domain.com
```

Make sure Stripe webhook URLs are also updated in your Stripe Dashboard.
