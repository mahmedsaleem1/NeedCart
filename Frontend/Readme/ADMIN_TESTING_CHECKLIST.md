# Admin Dashboard Testing Checklist

## ✅ Pre-Testing Setup

- [ ] Backend server is running (`npm start` in Backend folder)
- [ ] Frontend dev server is running (`npm run dev` in Frontend folder)
- [ ] recharts installed (`npm install recharts` in Frontend folder)
- [ ] Admin user exists in MongoDB Admin collection
- [ ] Admin user authenticated in Firebase
- [ ] Environment variables configured (.env file)

## 🔐 Authentication Testing

### Login Flow
- [ ] Navigate to `/login`
- [ ] Login with admin credentials
- [ ] Verify JWT token is stored
- [ ] Navigate to `/admin/dashboard`
- [ ] Dashboard loads without redirect

### Authorization
- [ ] All admin routes accessible
- [ ] API requests include Authorization header
- [ ] Non-admin users cannot access admin routes
- [ ] Logout works correctly

## 📊 Dashboard Testing (`/admin/dashboard`)

### Visual Elements
- [ ] Page loads without errors
- [ ] Header gradient displays correctly
- [ ] All 12 stat cards render
- [ ] Numbers display correctly
- [ ] Icons render in stat cards
- [ ] Order status breakdown chart displays
- [ ] Product category chart displays
- [ ] Quick action buttons work

### Data Accuracy
- [ ] User counts match database
- [ ] Revenue figures are correct
- [ ] Order counts accurate
- [ ] Product counts accurate
- [ ] Percentages calculated correctly

### Interactions
- [ ] Quick action buttons navigate correctly
- [ ] Cards are clickable/hoverable
- [ ] Page is responsive on mobile

## 👥 User Management Testing (`/admin/users`)

### Display
- [ ] Stats cards show correct counts
- [ ] User table loads
- [ ] All columns display data
- [ ] Pagination appears if needed
- [ ] Search bar present

### Filtering
- [ ] "All Users" filter works
- [ ] "Buyers" filter works
- [ ] "Sellers" filter works
- [ ] Filter counts update correctly

### Search
- [ ] Search by first name works
- [ ] Search by last name works
- [ ] Search by email works
- [ ] Search results update in real-time

### User Details Modal
- [ ] Modal opens on "View" click
- [ ] Contact information displays
- [ ] Seller bank info shows (if seller)
- [ ] Account dates display correctly
- [ ] Modal closes on X or outside click

### Delete Functionality
- [ ] Delete button opens confirmation
- [ ] Confirmation modal displays correctly
- [ ] Cancel button works
- [ ] Delete button removes user
- [ ] Table refreshes after deletion
- [ ] Success message appears

### Pagination
- [ ] Previous/Next buttons work
- [ ] Page numbers update correctly
- [ ] Buttons disabled appropriately
- [ ] Data loads for each page

## 🏪 Seller Management Testing (`/admin/sellers`)

### Display
- [ ] Seller table loads
- [ ] All columns populated
- [ ] Status badges show correct colors
- [ ] Bank details display or show "Not provided"

### Filtering
- [ ] "All Sellers" shows all
- [ ] "Pending" shows unverified only
- [ ] "Verified" shows verified only
- [ ] Count badges update

### Search
- [ ] Search by name works
- [ ] Search by email works
- [ ] Results filter correctly

### Seller Details Modal
- [ ] Modal opens on "View Details"
- [ ] Contact info displays
- [ ] Bank information shows
- [ ] Verification status correct
- [ ] Timestamps formatted properly

### Approval Actions
- [ ] "Approve Seller" button works
- [ ] is_verified set to true in DB
- [ ] "Reject Seller" button works
- [ ] is_verified set to false in DB
- [ ] Modal closes after action
- [ ] Success alert appears
- [ ] Table refreshes

## 📦 Order Management Testing (`/admin/orders`)

### Display
- [ ] Orders table loads
- [ ] Order IDs displayed (shortened)
- [ ] Buyer/seller names show
- [ ] Price displays correctly
- [ ] Status badges colored correctly
- [ ] Dates formatted properly

### Filtering
- [ ] "All" shows all orders
- [ ] Each status filter works
- [ ] "Pending" filter
- [ ] "Processing" filter
- [ ] "Shipped" filter
- [ ] "Delivered" filter
- [ ] "Cancelled" filter

### Order Details Modal
- [ ] Modal opens correctly
- [ ] Status badge displays
- [ ] Buyer information shows
- [ ] Seller information shows
- [ ] Product image and details show
- [ ] Shipping address displays
- [ ] Order summary accurate
- [ ] Timeline shows correctly

### Pagination
- [ ] Works across status filters
- [ ] Page count updates correctly

## 📦 Product Management Testing (`/admin/products`)

### Tab Switching
- [ ] Products tab active by default
- [ ] Products load correctly
- [ ] Posts tab switches view
- [ ] Posts load correctly
- [ ] Count badges display

### Products View
- [ ] Grid layout renders
- [ ] Product images display
- [ ] Title and description show
- [ ] Price displays
- [ ] Category tag shows
- [ ] Seller name displays

### Posts View
- [ ] Posts display in grid
- [ ] Post images show
- [ ] Title and description render
- [ ] Buyer name displays

### Search
- [ ] Search works in products tab
- [ ] Search works in posts tab
- [ ] Results filter correctly

### Item Details Modal
- [ ] Modal opens for products
- [ ] Modal opens for posts
- [ ] All images display
- [ ] Complete info shows
- [ ] Owner details display
- [ ] Timestamps formatted

### Delete Functionality
- [ ] Delete icon button works
- [ ] Confirmation modal appears
- [ ] Cancel works
- [ ] Confirm deletes item
- [ ] Grid refreshes
- [ ] Alert shows

## 💰 Payment Management Testing (`/admin/payments`)

### Display
- [ ] Stats cards show correctly
- [ ] Total payments count
- [ ] Held payments count and amount
- [ ] Released payments count and amount
- [ ] Platform fees total
- [ ] Payments table loads

### Filtering
- [ ] "All Payments" shows all
- [ ] "Held" shows only held
- [ ] "Released" shows only released
- [ ] Count badges update

### Payment Details Modal
- [ ] Modal opens on "View"
- [ ] Status badge correct
- [ ] Payment breakdown shows
- [ ] Total amount displays
- [ ] Platform fee shows
- [ ] Net amount calculated correctly
- [ ] Order details display
- [ ] Timeline shows

### Release Payment
- [ ] Button only shows for held payments
- [ ] Button only enabled if order delivered
- [ ] Warning shows if not delivered
- [ ] Confirmation dialog appears
- [ ] Release updates status
- [ ] releasedAt timestamp set
- [ ] Table refreshes
- [ ] Success message shows

## 📈 Analytics Testing (`/admin/analytics`)

### Period Selector
- [ ] All period buttons display
- [ ] "Last 7 Days" works
- [ ] "Last 30 Days" works
- [ ] "Last 3 Months" works
- [ ] "Last Year" works
- [ ] Data updates on selection

### Key Metrics Cards
- [ ] Total revenue displays
- [ ] Platform fees display
- [ ] Average order value calculates
- [ ] Net revenue calculates
- [ ] All formatted as currency

### Charts
- [ ] Revenue trend line chart renders
- [ ] Chart has correct axes
- [ ] Tooltip shows on hover
- [ ] Legend displays
- [ ] Data points visible
- [ ] Order volume bar chart renders
- [ ] Platform fees chart renders
- [ ] All charts responsive

### Data Table
- [ ] Table renders below charts
- [ ] All columns populated
- [ ] Period values match charts
- [ ] Calculations accurate
- [ ] Table scrolls if needed

## 💳 Transaction Management Testing (`/admin/transactions`)

### Display
- [ ] Stats cards show correctly
- [ ] Total transactions count
- [ ] Succeeded count (green)
- [ ] Pending count (yellow)
- [ ] Failed count (red)
- [ ] Total amount sum
- [ ] Transactions table loads

### Filtering
- [ ] "All" shows all
- [ ] "Succeeded" filters
- [ ] "Pending" filters
- [ ] "Failed" filters
- [ ] "Processing" filters

### Transaction Details Modal
- [ ] Modal opens correctly
- [ ] Payment status displays
- [ ] Amount shows prominently
- [ ] Payment method displays
- [ ] Stripe payment ID shows
- [ ] Buyer information displays
- [ ] Related order shows
- [ ] Timeline formatted

## 📱 Responsive Design Testing

### Mobile (< 768px)
- [ ] Sidebar collapses
- [ ] Tables scroll horizontally
- [ ] Stat cards stack vertically
- [ ] Charts resize appropriately
- [ ] Buttons stack
- [ ] Modals fit screen
- [ ] Text readable

### Tablet (768px - 1024px)
- [ ] Layout adjusts properly
- [ ] Sidebar appropriate width
- [ ] Grid columns adjust
- [ ] Charts scale correctly

### Desktop (> 1024px)
- [ ] Full layout displays
- [ ] All elements visible
- [ ] Optimal spacing
- [ ] Charts utilize space

## 🎨 UI/UX Testing

### Visual Elements
- [ ] Gradients render smoothly
- [ ] Colors consistent
- [ ] Icons display correctly
- [ ] Shadows appropriate
- [ ] Rounded corners consistent

### Animations
- [ ] Hover effects work
- [ ] Transitions smooth
- [ ] Loading spinners appear
- [ ] Modal animations work

### Interactions
- [ ] Buttons respond to clicks
- [ ] Hover states visible
- [ ] Active states clear
- [ ] Disabled states apparent
- [ ] Links underline/highlight

## 🔄 Navigation Testing

### Sidebar
- [ ] All menu items visible
- [ ] Icons display correctly
- [ ] Active route highlighted
- [ ] Hover effects work
- [ ] Logout button functions
- [ ] Collapse button works

### Routing
- [ ] All routes accessible
- [ ] Back button works
- [ ] Direct URL access works
- [ ] 404 handling (if implemented)

## 🐛 Error Handling Testing

### API Errors
- [ ] Network error shows message
- [ ] 401 redirects to login
- [ ] 404 shows appropriate message
- [ ] 500 shows error state
- [ ] Retry functionality works

### Empty States
- [ ] "No data" messages show
- [ ] Empty tables display message
- [ ] Empty charts show placeholder
- [ ] Icons for empty states

### Loading States
- [ ] Spinners show during fetch
- [ ] Skeletons (if implemented)
- [ ] Disabled buttons during load
- [ ] Loading doesn't block UI

## ⚡ Performance Testing

### Load Times
- [ ] Initial page load < 3s
- [ ] Dashboard loads quickly
- [ ] Tables render smoothly
- [ ] Charts draw without lag
- [ ] Modals open instantly

### Data Handling
- [ ] Pagination limits data
- [ ] Large lists don't freeze
- [ ] Search filters fast
- [ ] Charts handle large datasets

## 🔒 Security Testing

### Authentication
- [ ] Unauthenticated users redirected
- [ ] Token expires appropriately
- [ ] Re-login required after expiry

### Authorization
- [ ] Non-admins denied access
- [ ] API validates admin role
- [ ] Sensitive data protected

### Input Validation
- [ ] XSS protection in place
- [ ] SQL injection prevented
- [ ] CSRF tokens (if applicable)

## 🎯 Integration Testing

### End-to-End Flows
- [ ] Login → Dashboard → View users
- [ ] Approve seller → Verify in DB
- [ ] Release payment → Check escrow status
- [ ] Delete user → Confirm removal
- [ ] View analytics → Export data

## 📝 Final Checks

- [ ] No console errors
- [ ] No console warnings (or acceptable)
- [ ] All images load
- [ ] All icons render
- [ ] Text properly formatted
- [ ] Links work
- [ ] Tooltips show
- [ ] No broken features
- [ ] Responsive on all breakpoints
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)

## 🎉 Sign-Off

- [ ] All critical features working
- [ ] All major bugs fixed
- [ ] UI/UX acceptable
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Documentation complete
- [ ] Ready for production

---

## 📋 Notes

Use this space to document any issues found during testing:

**Issue #1:**
- Description:
- Steps to reproduce:
- Expected behavior:
- Actual behavior:
- Priority:
- Status:

**Issue #2:**
- Description:
- Steps to reproduce:
- Expected behavior:
- Actual behavior:
- Priority:
- Status:

---

**Tester Name:** ___________________
**Date:** ___________________
**Environment:** ___________________
**Browser:** ___________________
**Notes:** ___________________
