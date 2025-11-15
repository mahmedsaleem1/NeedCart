# Admin Dashboard Setup and Usage Guide

## Overview
A comprehensive admin dashboard for NeedCart platform with detailed analytics, user management, order tracking, payment processing, and more.

## 🚀 Installation

### 1. Install Required Dependencies

```bash
cd Frontend
npm install recharts
```

### 2. Backend Setup
The backend already includes all necessary endpoints. Make sure your backend server is running.

## 📋 Features

### 1. **Dashboard Overview** (`/admin/dashboard`)
- **User Statistics**: Total users, verified sellers, pending sellers, new users
- **Revenue Metrics**: Total revenue, platform fees, average order value
- **Order Analytics**: Total orders, order status breakdown
- **Product Stats**: Total products, posts, category distribution
- **Quick Actions**: Direct links to pending tasks

### 2. **User Management** (`/admin/users`)
- View all buyers and sellers
- Filter by role (buyer/seller)
- Search by name or email
- View detailed user profiles
- Delete user accounts
- Track account creation dates

### 3. **Seller Management** (`/admin/sellers`)
- View all seller verification requests
- Filter by verification status (verified/pending)
- Approve or reject seller applications
- View bank details and verification documents
- Track seller onboarding progress

### 4. **Order Management** (`/admin/orders`)
- View all platform orders
- Filter by order status (pending, processing, shipped, delivered, cancelled)
- View detailed order information
- Track shipping and delivery status
- Monitor buyer and seller details per order

### 5. **Product & Post Management** (`/admin/products`)
- Manage all products and buyer posts
- Toggle between products and posts view
- Search functionality
- View product/post details
- Delete inappropriate content
- Monitor seller product listings

### 6. **Payment Management** (`/admin/payments`)
- View all escrow payments
- Filter by payment status (held/released)
- Release payments to sellers
- Track platform fees
- Monitor payment breakdown (total, platform fee, net to seller)
- Ensure payments released only after order delivery

### 7. **Analytics** (`/admin/analytics`)
- **Revenue Trends**: Line charts showing revenue over time
- **Order Volume**: Bar charts showing order counts
- **Platform Fees**: Track commission earnings
- **Time Periods**: Day, week, month, year views
- **Detailed Breakdown**: Tabular data with all metrics
- Interactive charts with tooltips

### 8. **Transaction History** (`/admin/transactions`)
- Complete payment transaction records
- Filter by payment status (succeeded, pending, failed)
- View Stripe payment details
- Track buyer payment information
- Link transactions to orders

## 🎨 UI Features

### Design Elements
- **Gradient Headers**: Eye-catching gradient backgrounds for each section
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Charts**: Hover effects and tooltips on analytics
- **Status Badges**: Color-coded status indicators
- **Modal Details**: Detailed views in overlay modals
- **Smooth Transitions**: Animated state changes
- **Loading States**: Spinner animations during data fetch

### Color Scheme
- **Primary**: Indigo/Purple gradient
- **Success**: Green (payments, verified status)
- **Warning**: Orange (pending items)
- **Error**: Red (failed, cancelled)
- **Info**: Blue (processing, general info)

## 🔒 Security

### Authentication
- All routes protected with Firebase authentication
- JWT token verification on backend
- Auto-redirect to login if not authenticated

### Authorization
- Admin-only access to all routes
- Verify admin status before allowing access
- Secure payment release process

## 📊 API Endpoints Used

### Dashboard
- `GET /api/v1/admin/dashboard-overview` - Complete dashboard statistics
- `GET /api/v1/admin/revenue-analytics?period=month` - Revenue analytics

### User Management
- `GET /api/v1/admin/users?page=1&limit=20&role=buyer` - Get all users
- `DELETE /api/v1/admin/users/:role/:userId` - Delete user

### Seller Management
- `GET /api/v1/admin/sellers-requests?verified=false` - Get seller requests
- `POST /api/v1/admin/accept-seller-request/:sellerId` - Approve/reject seller

### Order Management
- `GET /api/v1/admin/orders?status=pending` - Get orders

### Product Management
- `GET /api/v1/admin/products` - Get all products
- `GET /api/v1/admin/posts` - Get all posts
- `DELETE /api/v1/admin/products/:productId` - Delete product
- `DELETE /api/v1/admin/posts/:postId` - Delete post

### Payment Management
- `GET /api/v1/admin/get-order-payment-status` - Get escrow payments
- `POST /api/v1/admin/release-payment/:escrowId` - Release payment

### Transactions
- `GET /api/v1/admin/transactions?status=succeeded` - Get transactions

## 🔧 Configuration

### Environment Variables
Ensure your `.env` file includes:
```
VITE_BACKEND_URL=http://localhost:8000
```

### Firebase Config
Make sure `src/config/firebase.js` is properly configured with your Firebase credentials.

## 📱 Navigation Structure

```
/admin
├── /admin/dashboard     - Main overview
├── /admin/users         - User management
├── /admin/sellers       - Seller verification
├── /admin/orders        - Order tracking
├── /admin/products      - Products & posts
├── /admin/payments      - Payment management
├── /admin/analytics     - Revenue analytics
└── /admin/transactions  - Transaction history
```

## 🎯 Usage Examples

### Approving a Seller
1. Navigate to `/admin/sellers`
2. Filter by "Pending" status
3. Click "View Details" on a seller
4. Review bank details and information
5. Click "Approve Seller" or "Reject Seller"

### Releasing Payment
1. Navigate to `/admin/payments`
2. Filter by "Held" status
3. Click "View" on a payment
4. Verify order is marked as "delivered"
5. Click "Release Payment to Seller"

### Viewing Analytics
1. Navigate to `/admin/analytics`
2. Select time period (day/week/month/year)
3. View revenue trends chart
4. Review order volume chart
5. Check platform fees chart
6. Scroll to see detailed breakdown table

## 🐛 Troubleshooting

### Charts Not Displaying
- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors
- Verify API is returning data

### Authentication Issues
- Clear browser cache and localStorage
- Re-login as admin
- Check Firebase token validity
- Verify backend authentication middleware

### Data Not Loading
- Check backend server is running
- Verify API endpoints are correct
- Check browser network tab for failed requests
- Ensure admin has proper permissions in database

## 🚀 Future Enhancements

- Export data to CSV/Excel
- Email notifications for important events
- Advanced filtering and sorting
- Bulk operations (approve multiple sellers)
- Activity logs and audit trail
- Real-time updates with WebSockets
- Dashboard widgets customization
- Reports generation (PDF)

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review backend logs
3. Verify all dependencies are installed
4. Ensure proper Firebase configuration
5. Check API endpoint responses

## 🎉 Access the Dashboard

After successful admin login, navigate to:
```
http://localhost:5173/admin/dashboard
```

Default admin credentials should be created in your Firebase Auth console with admin role in MongoDB.
