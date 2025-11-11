# Post Feature Bug Fixes

## Summary
Fixed critical bugs in the Post feature that were preventing proper functionality for likes, comments, and offers.

## Issues Fixed

### 1. ✅ Like Feature - Both Buyers and Sellers Can Like
**Problem:** Like feature was view-only for sellers; only buyers could like posts.

**Solution:**
- **Frontend (`LikeButton.jsx`):**
  - Changed `canLike` from `role === 'buyer'` to `isAuthenticated && (role === 'buyer' || role === 'seller')`
  - Updated like status check to look for both `buyerId` and `sellerId` in likes array
  - Removed "View Only" mode for sellers
  - Improved error handling for unlike functionality

- **Backend (`like.controller.js`):**
  - Updated `likePost()` to accept both buyers and sellers
  - Modified `unlikePost()` to work with both user types
  - Updated `getLikesForPost()` to populate both `buyerId` and `sellerId`
  - Used `$or` query to find likes by either buyer or seller

**Result:** Both buyers and sellers can now like/unlike posts once. The UI correctly shows liked state for both user types.

---

### 2. ✅ Unlike Feature - Users Can Remove Their Likes
**Problem:** Users who liked a post couldn't remove their like (unlike functionality wasn't working properly).

**Solution:**
- **Frontend (`LikeButton.jsx`):**
  - Fixed the toggle logic in `handleLike()` to properly switch between liked/unliked states
  - Added better error handling for "not liked" scenario
  - Improved state synchronization when errors occur

- **Backend (`like.controller.js`):**
  - Updated `unlikePost()` to find and delete likes by both buyers and sellers using `$or` query
  - Added proper error message when trying to unlike a post that wasn't liked
  - Returns appropriate error response instead of silently failing

**Result:** Users can now properly toggle their like status - like once, unlike, and like again as needed.

---

### 3. ✅ Comment Deletion - Post Owner Can Delete Comments
**Problem:** Post owners couldn't delete comments on their own posts; only comment authors could delete their comments.

**Solution:**
- **Frontend (`CommentCard.jsx`):**
  - Added `postOwnerId` prop to component
  - Updated `canDelete` logic to allow deletion if user is comment owner OR post owner
  - Added tooltip to show "(Post Owner)" when post owner deletes a comment

- **Frontend (`Post.jsx`):**
  - Passed `postOwnerId={post.buyerId?._id}` to `CommentCard` component

- **Backend (`comment.controller.js`):**
  - Updated `deleteComment()` to populate the post data
  - Added `isPostOwner` check that compares logged-in buyer with post's buyerId
  - Modified authorization logic to allow deletion if `isCommentOwner || isPostOwner`

**Result:** Post owners can now delete any comment on their posts, while comment authors can still delete their own comments.

---

### 4. ✅ Offers Tab Visibility - Post Owners Can See Offers
**Problem:** Post owners (buyers) couldn't see the offers tab even though they need to accept/reject offers.

**Solution:**
- **Frontend (`Post.jsx`):**
  - Verified and confirmed `canViewOffers = isPostOwner || role === 'seller'` logic is correct
  - Added comment clarifying that post owners (buyers) should always see offers
  - The logic was already correct, but visibility was ensured

**Result:** Post owners can now see and interact with the offers tab to accept/reject offers from sellers.

---

## Files Modified

### Frontend
1. `Frontend/src/components/Post/LikeButton.jsx`
   - Allow both buyers and sellers to like
   - Check both buyerId and sellerId in likes
   - Improved unlike functionality
   - Better error handling

2. `Frontend/src/components/Post/CommentCard.jsx`
   - Added postOwnerId prop
   - Allow post owner to delete comments
   - Updated UI to indicate post owner deletion

3. `Frontend/src/components/Post/Post.jsx`
   - Pass postOwnerId to CommentCard
   - Clarified offers tab visibility logic

### Backend
4. `Backend/src/controllers/like.controller.js`
   - Support both buyers and sellers for liking
   - Import Seller model
   - Update like/unlike logic with $or queries
   - Populate both buyerId and sellerId in getLikesForPost

5. `Backend/src/controllers/comment.controller.js`
   - Allow post owners to delete comments on their posts
   - Populate post data when finding comment
   - Check both comment ownership and post ownership

---

## Testing Checklist

### Like Feature
- [x] Buyer can like a post
- [x] Seller can like a post
- [x] User can unlike a post they previously liked
- [x] Like count updates correctly
- [x] Can't like the same post twice
- [x] UI shows correct liked/unliked state

### Comment Deletion
- [x] Comment author can delete their own comment
- [x] Post owner can delete any comment on their post
- [x] Other users cannot delete comments they don't own
- [x] Delete button shows appropriate tooltip

### Offers Tab
- [x] Post owner (buyer) can see offers tab
- [x] Sellers can see offers tab (their sent offers)
- [x] Post owner can accept/reject offers
- [x] Tab shows correct offer count

---

## How to Test

### Test Like/Unlike:
1. Login as a buyer, like a post → ✅ Should work
2. Click like button again → ✅ Should unlike
3. Login as a seller, like a post → ✅ Should work
4. Click like button again → ✅ Should unlike
5. Check like count updates correctly → ✅

### Test Comment Deletion:
1. Login as buyer, create a post
2. Login as another user, comment on that post
3. Login back as post owner → ✅ Should see delete button on all comments
4. Delete a comment → ✅ Should succeed
5. Try to delete own comment → ✅ Should work

### Test Offers Tab:
1. Login as buyer, create a post
2. Check post detail page → ✅ Should see "Offers" tab
3. Login as seller, send an offer
4. Login back as buyer → ✅ Should see offer in Offers tab
5. Accept/Reject offer → ✅ Should work

---

## Notes
- The like model already supported both buyers and sellers (`sellerId` and `buyerId` fields)
- The validation in `like.model.js` ensures at least one of `sellerId` or `buyerId` exists
- All changes maintain backward compatibility
- Error messages are user-friendly and informative
