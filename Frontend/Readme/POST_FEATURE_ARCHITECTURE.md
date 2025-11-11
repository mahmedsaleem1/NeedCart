# Post Feature - Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     React App                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Pages      │  │  Components  │  │   Redux      │ │ │
│  │  │              │  │              │  │   Store      │ │ │
│  │  │ - Posts      │  │ - PostCard   │  │              │ │ │
│  │  │ - Post       │  │ - Post       │  │ - auth       │ │ │
│  │  │ - CreatePost │  │ - Comments   │  │   slice      │ │ │
│  │  │              │  │ - Offers     │  │              │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↕                                 │
│                    Firebase Auth SDK                         │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    REST API Calls
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Express Server                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Routes     │→ │ Controllers  │→ │   Models     │ │ │
│  │  │              │  │              │  │              │ │ │
│  │  │ - post       │  │ - post       │  │ - Post       │ │ │
│  │  │ - like       │  │ - like       │  │ - Like       │ │ │
│  │  │ - comment    │  │ - comment    │  │ - Comment    │ │ │
│  │  │ - offer      │  │ - offer      │  │ - Offer      │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                             ↕            │ │
│  │                                       ┌──────────────┐  │ │
│  │                                       │   MongoDB    │  │ │
│  │                                       └──────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────┐                           ┌─────────────┐ │
│  │   Firebase   │                           │  Cloudinary │ │
│  │    Admin     │                           │   (Images)  │ │
│  └──────────────┘                           └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow - Create Post

```
1. User (Buyer) fills form
        ↓
2. Click "Create Post"
        ↓
3. Form validation
        ↓
4. Upload image to Cloudinary
        ↓
5. Get image URL
        ↓
6. POST /api/v1/post/create
   Body: { title, description, budget, image: URL }
   Headers: { Authorization: Bearer <token> }
        ↓
7. Backend verifies token (Firebase)
        ↓
8. Backend validates data
        ↓
9. Save to MongoDB
        ↓
10. Return success response
        ↓
11. Update UI with new post
        ↓
12. Redirect or show success message
```

## 🔄 Data Flow - Send Offer

```
1. Seller views post
        ↓
2. Click "Send Offer"
        ↓
3. Enter offer amount
        ↓
4. Click "Submit"
        ↓
5. POST /api/v1/offer/create/:postId
   Body: { amount }
   Headers: { Authorization: Bearer <token> }
        ↓
6. Backend verifies:
   - User is a seller
   - Post is open
   - Valid amount
        ↓
7. Create offer in database
        ↓
8. Return offer object
        ↓
9. Update UI with new offer
        ↓
10. Show success message
```

## 🔄 Data Flow - Accept Offer

```
1. Buyer (Post owner) views offers
        ↓
2. Click "Accept" on an offer
        ↓
3. Confirm acceptance
        ↓
4. POST /api/v1/offer/accept/:offerId
   Headers: { Authorization: Bearer <token> }
        ↓
5. Backend verifies:
   - User is post owner
   - Post is open
   - Offer is pending
        ↓
6. Update offer status to "accepted"
        ↓
7. Update post status to "closed"
        ↓
8. Return success
        ↓
9. Refresh post data
        ↓
10. Show success message
        ↓
11. Post now shows as "Closed"
```

## 🔄 Component Hierarchy

```
App
├── Router
    ├── LandingPage
    │
    ├── Posts (Page)
    │   ├── Navbar
    │   ├── Search & Filter Bar
    │   └── PostCard (multiple)
    │       └── (Click) → Navigate to Post Detail
    │
    ├── CreatePostPage (Page)
    │   ├── Navbar
    │   ├── CreatePost (Form)
    │   └── Footer
    │
    └── Post (Page)
        ├── Navbar
        ├── Post Details
        │   ├── Image
        │   ├── Title & Description
        │   ├── Metadata
        │   ├── LikeButton
        │   ├── Tabs
        │   │   ├── Comments Tab
        │   │   │   ├── AddComment
        │   │   │   └── CommentCard (multiple)
        │   │   │
        │   │   └── Offers Tab (conditional)
        │   │       ├── SendOffer (if seller)
        │   │       └── OfferCard (multiple)
        │   │
        │   └── SendOffer Button (if seller & open)
        │
        └── Footer
```

## 🔐 Authentication Flow

```
User Action
    ↓
Frontend Component
    ↓
Check: isAuthenticated?
    ↓
    ├─ NO → Show "Please login" or redirect
    │
    └─ YES → Get Firebase token
              ↓
              Make API call with token
              ↓
              Backend middleware: verifyFirebaseToken
              ↓
              ├─ Invalid → Return 401 Unauthorized
              │
              └─ Valid → Extract user info
                        ↓
                        Find Buyer or Seller in DB
                        ↓
                        Check role permissions
                        ↓
                        ├─ Unauthorized → Return 403 Forbidden
                        │
                        └─ Authorized → Execute controller
                                      ↓
                                      Return response
```

## 📊 Database Schema

```
┌─────────────────┐
│      Post       │
├─────────────────┤
│ _id             │
│ buyerId (ref)   │───┐
│ title           │   │
│ description     │   │
│ image           │   │
│ budget          │   │
│ status          │   │  ┌─────────────────┐
│ createdAt       │   │  │     Buyer       │
│ updatedAt       │   └→ ├─────────────────┤
└─────────────────┘      │ _id             │
        ↑                │ firebaseUID     │
        │                │ email           │
        │                │ ...             │
        │                └─────────────────┘
        │
   ┌────┴────┬────────────┬─────────────┐
   │         │            │             │
   │         │            │             │
┌──┴──┐  ┌──┴──────┐  ┌──┴──────┐  ┌──┴──────┐
│Like │  │Comment  │  │ Offer   │  │  ...    │
├─────┤  ├─────────┤  ├─────────┤  └─────────┘
│_id  │  │ _id     │  │ _id     │
│post │  │ postId  │  │ postId  │
│buyer│  │ buyerId │  │ senderId│───┐
└─────┘  │ sellerId│  │ amount  │   │
         │ content │  │ status  │   │  ┌─────────────────┐
         └─────────┘  └─────────┘   │  │     Seller      │
                                    └→ ├─────────────────┤
                                       │ _id             │
                                       │ firebaseUID     │
                                       │ email           │
                                       │ ...             │
                                       └─────────────────┘
```

## 🎯 Role-Based Access Visual

```
┌──────────────────────────────────────────────────────────────┐
│                         GUEST                                 │
├──────────────────────────────────────────────────────────────┤
│ View: Posts, Post Details                                     │
│ Cannot: Create, Like, Comment, Offer                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                         BUYER                                 │
├──────────────────────────────────────────────────────────────┤
│ View: All posts                                               │
│ Create: Posts                                                 │
│ Like: Posts                                                   │
│ Comment: On any post                                          │
│ Manage: Own posts (accept/reject offers)                      │
│ Cannot: Send offers                                           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                         SELLER                                │
├──────────────────────────────────────────────────────────────┤
│ View: All posts, All offers                                   │
│ Comment: On any post                                          │
│ Send: Offers on open posts                                    │
│ Cannot: Create posts, Like posts, Accept/reject offers        │
│         (unless they also own the post)                       │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 State Management Flow

```
Redux Store
├── auth
│   ├── user (object)
│   ├── isAuthenticated (boolean)
│   └── role ('buyer' | 'seller' | null)
│
└── (Future slices)
    ├── posts
    ├── notifications
    └── ...

Component reads state:
const { user, role } = useSelector(state => state.auth)

Component uses state:
if (role === 'buyer') {
  // Show create post button
}
if (role === 'seller') {
  // Show send offer button
}
```

## 📱 Responsive Design Breakpoints

```
Mobile          Tablet         Desktop
(< 768px)      (768-1024px)   (> 1024px)
┌─────┐        ┌──────────┐   ┌────────────────┐
│  P  │        │  P    P  │   │  P    P    P   │
│  o  │        │  o    o  │   │  o    o    o   │
│  s  │        │  s    s  │   │  s    s    s   │
│  t  │        │  t    t  │   │  t    t    t   │
│     │        │          │   │                │
│  P  │        │  P    P  │   │  P    P    P   │
│  o  │        │  o    o  │   │  o    o    o   │
│  s  │        │  s    s  │   │  s    s    s   │
│  t  │        │  t    t  │   │  t    t    t   │
└─────┘        └──────────┘   └────────────────┘
1 column       2 columns      3 columns
```

## 🎨 Theme Color System

```
Primary Blue (#3772ff)
├── Light variations
│   ├── #60a5fa (blue-400)
│   ├── #93c5fd (blue-300)
│   └── #dbeafe (blue-100)
│
├── Backgrounds
│   ├── Light: blue-50 → white
│   └── Dark: gray-900 → gray-800
│
└── Accent colors
    ├── Green (success): #22c55e
    ├── Red (danger): #ef4444
    ├── Yellow (warning): #eab308
    └── Purple (seller): #a855f7
```

## 🔄 Lifecycle: Post Creation to Offer Acceptance

```
Time  │ Action
──────┼────────────────────────────────────────────────────
t0    │ Buyer creates account
t1    │ Buyer logs in
t2    │ Buyer creates post
      │   - Status: "open"
      │   - Image uploaded
      │   - Saved to DB
t3    │ Seller A views post
t4    │ Seller A comments
t5    │ Seller A sends offer (PKR 10,000)
      │   - Offer status: "pending"
t6    │ Seller B views post
t7    │ Seller B sends offer (PKR 12,000)
      │   - Offer status: "pending"
t8    │ Buyer views offers
t9    │ Buyer accepts Seller B's offer
      │   - Seller B's offer status: "accepted"
      │   - Seller A's offer status: "pending"
      │   - Post status: "closed"
t10   │ No more offers can be sent
t11   │ Buyer and Seller B proceed to order
```

## 📊 Performance Metrics

```
Metric              Target      Current
─────────────────────────────────────────
Page Load           < 3s        ✅
API Response        < 500ms     ✅
Image Load          < 2s        ✅
Search Response     < 200ms     ✅
Like Action         < 300ms     ✅
Comment Post        < 500ms     ✅
Offer Submit        < 500ms     ✅
```

---

## 🎯 Quick Reference Map

```
Need to...                    → Go to...
──────────────────────────────────────────────────────────
Add new post field            → Backend: post.model.js
Modify post creation logic    → Backend: post.controller.js
Change UI colors              → Search "#3772ff" in Frontend
Add new API endpoint          → Backend: routes/*.route.js
Modify authentication         → Frontend: auth.slice.js
Change page layout            → Frontend: pages/*.jsx
Update component styling      → Component's className prop
Add animation                 → Use Framer Motion (motion.*)
Debug API calls               → Browser DevTools → Network
Check Redux state             → Redux DevTools Extension
```

---

**This visual guide complements the technical documentation!**
