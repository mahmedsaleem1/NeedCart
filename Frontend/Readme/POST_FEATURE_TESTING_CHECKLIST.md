# Post Feature - Testing Checklist

## ✅ Pre-Testing Setup

- [ ] Backend server is running
- [ ] Frontend server is running
- [ ] Database is connected
- [ ] Firebase authentication is configured
- [ ] Cloudinary is configured for image uploads
- [ ] Environment variables are set (.env)
- [ ] At least one buyer and one seller account exists

## 📋 Feature Testing

### 1. Browse Posts Page (`/posts`)

#### As Guest (Not Logged In)
- [ ] Can view all posts
- [ ] Can see post cards with image, title, description, budget
- [ ] Can see post status (Open/Closed)
- [ ] Can use search functionality
- [ ] Can use status filter (All/Open/Closed)
- [ ] "Create Post" button is NOT visible
- [ ] Can click post card to view details

#### As Buyer
- [ ] Can view all posts
- [ ] "Create Post" button IS visible
- [ ] Can click "Create Post" to navigate to creation form
- [ ] All guest features work

#### As Seller
- [ ] Can view all posts
- [ ] "Create Post" button is NOT visible
- [ ] All guest features work

### 2. Create Post (`/create-post`)

#### Access Control
- [ ] Redirects to login if not authenticated
- [ ] Shows "Only buyers can create posts" for sellers
- [ ] Allows access for buyers

#### Form Functionality (As Buyer)
- [ ] Title field accepts text input
- [ ] Description textarea accepts text input
- [ ] Budget field accepts numbers only
- [ ] Image upload field works
- [ ] Required validation works (empty submit shows errors)
- [ ] Success message shows after creation
- [ ] Form clears after successful submission
- [ ] Redirects or updates UI after post creation
- [ ] Image uploads to Cloudinary successfully
- [ ] Post appears in posts list after creation

### 3. Post Details Page (`/post/:postId`)

#### General View (All Users)
- [ ] Post image displays correctly
- [ ] Title shows correctly
- [ ] Description is fully visible
- [ ] Budget displays in correct format (PKR)
- [ ] Status badge shows (Open/Closed)
- [ ] Buyer email displays
- [ ] Creation date displays correctly
- [ ] Page is responsive on mobile/tablet/desktop

#### Like Feature (Buyers Only)
- [ ] Like button shows for authenticated buyers
- [ ] Like button does NOT show for sellers
- [ ] Like button does NOT show for guests
- [ ] Can like a post (heart fills, count increases)
- [ ] Can unlike a post (heart empties, count decreases)
- [ ] Like count updates in real-time
- [ ] Loading state shows during like/unlike
- [ ] Error message shows if like fails

#### Comments Section
- [ ] Comment form shows for authenticated users
- [ ] Comment form does NOT show for guests
- [ ] "Please login to comment" shows for guests
- [ ] Can type in comment textarea
- [ ] Cannot submit empty comment
- [ ] Comment posts successfully
- [ ] New comment appears immediately
- [ ] Comment shows author email
- [ ] Comment shows timestamp
- [ ] Can delete own comments
- [ ] Cannot delete other users' comments
- [ ] Delete confirmation dialog appears
- [ ] Comment removes after deletion
- [ ] Comments sorted by newest first

#### Offers Section (Conditional Visibility)

**As Guest**
- [ ] Offers tab is NOT visible

**As Buyer (Not Post Owner)**
- [ ] Offers tab is NOT visible
- [ ] Cannot send offers

**As Buyer (Post Owner)**
- [ ] Offers tab IS visible
- [ ] Can see all received offers
- [ ] Each offer shows sender email, amount, status, timestamp
- [ ] Pending offers show Accept/Reject buttons
- [ ] Accepted offers show "Accepted" badge
- [ ] Rejected offers show "Rejected" badge
- [ ] Can accept an offer (confirmation dialog appears)
- [ ] Post status changes to "Closed" after acceptance
- [ ] Can reject an offer (confirmation dialog appears)
- [ ] Cannot accept/reject after post is closed
- [ ] Loading state shows during accept/reject

**As Seller (Not Post Owner, Open Post)**
- [ ] Offers tab IS visible
- [ ] Can see all offers on the post
- [ ] "Send Offer" button IS visible
- [ ] Can click "Send Offer" to show form
- [ ] Can enter offer amount
- [ ] Amount validation works (must be > 0)
- [ ] Can submit offer
- [ ] New offer appears in list immediately
- [ ] Can cancel offer form
- [ ] Cannot send offer on closed post
- [ ] "Send Offer" button does NOT show on closed posts

**As Seller (Post Owner)**
- [ ] Same as "Buyer (Post Owner)" - can manage offers

### 4. Search and Filter

#### Search Functionality
- [ ] Search bar accepts text input
- [ ] Searches by post title
- [ ] Searches by post description
- [ ] Results update in real-time
- [ ] Shows "No posts found" when no matches
- [ ] Case-insensitive search

#### Filter Functionality
- [ ] "All Posts" shows all posts
- [ ] "Open" shows only open posts
- [ ] "Closed" shows only closed posts
- [ ] Filter works with search together
- [ ] Results update immediately

### 5. Navigation and Routing

- [ ] `/` - Lands on homepage
- [ ] `/posts` - Shows posts listing
- [ ] `/post/:postId` - Shows specific post
- [ ] `/create-post` - Shows create form (with guards)
- [ ] Back button works correctly
- [ ] Navigation between pages is smooth
- [ ] URLs are shareable (direct access works)

## 🎨 UI/UX Testing

### Visual Design
- [ ] Blue gradient theme consistent (#3772ff)
- [ ] 'Lemon Milk' font used for headings
- [ ] Rounded corners on cards
- [ ] Shadows on hover
- [ ] Smooth transitions and animations
- [ ] Dark mode works correctly
- [ ] Icons from Lucide React display properly

### Responsiveness
- [ ] Mobile (< 768px): Single column layout
- [ ] Tablet (768px - 1024px): Two column layout
- [ ] Desktop (> 1024px): Three column layout
- [ ] Touch interactions work on mobile
- [ ] Text is readable on all screen sizes
- [ ] Images scale properly
- [ ] Forms are usable on mobile

### Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Alt text on images
- [ ] Semantic HTML used
- [ ] Color contrast is sufficient
- [ ] Screen reader friendly

## 🔒 Security Testing

### Authentication
- [ ] Protected routes require login
- [ ] Token is sent with all authenticated requests
- [ ] Invalid token redirects to login
- [ ] Session persists across page refreshes
- [ ] Logout works correctly

### Authorization
- [ ] Buyers cannot send offers
- [ ] Sellers cannot create posts
- [ ] Sellers cannot like posts
- [ ] Users can only delete own comments
- [ ] Only post owners can accept/reject offers
- [ ] API returns proper error messages for unauthorized actions

## 🐛 Error Handling

### Network Errors
- [ ] Shows error message when API is down
- [ ] Shows loading state during requests
- [ ] Retry button works after error
- [ ] Graceful degradation without internet

### Validation Errors
- [ ] Form validation messages are clear
- [ ] Empty fields show appropriate errors
- [ ] Invalid data types are rejected
- [ ] File upload errors are handled

### Edge Cases
- [ ] Post with no image (if allowed)
- [ ] Very long titles/descriptions
- [ ] Special characters in text
- [ ] Very large numbers for budget
- [ ] Post with zero budget (if allowed)
- [ ] Multiple rapid clicks (debouncing)

## 📊 Data Integrity

### Post Creation
- [ ] Post saved to database
- [ ] All fields populated correctly
- [ ] Image URL stored correctly
- [ ] Timestamps are accurate
- [ ] Buyer ID is correct

### Like System
- [ ] Like count is accurate
- [ ] No duplicate likes from same user
- [ ] Unlike removes like from database
- [ ] Like count doesn't go negative

### Comments
- [ ] Comment saved to database
- [ ] Author ID is correct (buyer or seller)
- [ ] Timestamps are accurate
- [ ] Comment deletion removes from database

### Offers
- [ ] Offer saved to database
- [ ] Sender ID is correct (seller)
- [ ] Post ID is correct
- [ ] Status updates correctly
- [ ] Only one offer can be accepted per post
- [ ] Post status updates when offer accepted

## 🚀 Performance Testing

- [ ] Page loads in < 3 seconds
- [ ] Images load progressively
- [ ] No layout shift during loading
- [ ] Smooth scroll behavior
- [ ] No memory leaks
- [ ] API responses are quick
- [ ] Pagination works if implemented

## 🔄 Integration Testing

### Complete User Flows

#### Flow 1: Buyer Creates Post and Accepts Offer
1. [ ] Buyer logs in
2. [ ] Navigates to /posts
3. [ ] Clicks "Create Post"
4. [ ] Fills form completely
5. [ ] Submits successfully
6. [ ] Post appears in listing
7. [ ] Seller views post
8. [ ] Seller sends offer
9. [ ] Buyer views offer
10. [ ] Buyer accepts offer
11. [ ] Post status changes to closed

#### Flow 2: Seller Browses and Sends Offer
1. [ ] Seller logs in
2. [ ] Browses posts
3. [ ] Searches for relevant posts
4. [ ] Filters by "Open"
5. [ ] Clicks post to view
6. [ ] Reads description
7. [ ] Sends competitive offer
8. [ ] Offer appears in list

#### Flow 3: Community Interaction
1. [ ] User views post
2. [ ] Likes the post
3. [ ] Adds comment
4. [ ] Views other comments
5. [ ] Deletes own comment
6. [ ] Unlikes post

## 📱 Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## ✅ Final Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] All images load
- [ ] All fonts load
- [ ] No broken links
- [ ] No 404 errors
- [ ] API endpoints all work
- [ ] Database queries are optimized
- [ ] Code is clean and commented
- [ ] Documentation is complete

## 🎯 Success Criteria

- [ ] All critical paths work without errors
- [ ] Role-based access control is enforced
- [ ] UI matches design system
- [ ] Performance is acceptable
- [ ] Security measures are in place
- [ ] Error handling is robust
- [ ] User experience is smooth

---

## 📝 Notes Section

Use this space to note any issues found during testing:

**Issues Found:**
1. 
2. 
3. 

**Improvements Needed:**
1. 
2. 
3. 

**Questions:**
1. 
2. 
3.
