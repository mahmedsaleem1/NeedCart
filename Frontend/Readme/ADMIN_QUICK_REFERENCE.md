# Admin Dashboard Quick Reference

## 🚀 Quick Start

```bash
# Install dependencies
cd Frontend
npm install recharts

# Start backend
cd Backend
npm start

# Start frontend
cd Frontend
npm run dev

# Access dashboard
http://localhost:5173/admin/dashboard
```

## 📍 Routes

| URL | Page | Purpose |
|-----|------|---------|
| `/admin/dashboard` | Dashboard | Overview & statistics |
| `/admin/users` | User Management | View/delete users |
| `/admin/sellers` | Seller Management | Approve sellers |
| `/admin/orders` | Order Management | Track orders |
| `/admin/products` | Product/Post Management | Moderate content |
| `/admin/payments` | Payment Management | Release payments |
| `/admin/analytics` | Analytics | Revenue charts |
| `/admin/transactions` | Transactions | Payment history |

## 🎯 Key Actions

### Approve a Seller
1. Go to `/admin/sellers`
2. Click "View Details"
3. Click "Approve Seller"

### Release Payment
1. Go to `/admin/payments`
2. Filter by "Held"
3. Verify order is delivered
4. Click "Release Payment"

### View Analytics
1. Go to `/admin/analytics`
2. Select time period
3. View charts and data

### Delete User
1. Go to `/admin/users`
2. Click "View" on user
3. Click "Delete User Account"
4. Confirm deletion

## 📊 Dashboard Metrics

- **Users**: Buyers, sellers, verified, pending
- **Revenue**: Total, fees, average order value
- **Orders**: Total, by status, recent
- **Products**: Total, by category
- **Payments**: Held, released, fees

## 🎨 Components Created

- `AdminLayout.jsx` - Main layout with sidebar
- `AdminDashboard.jsx` - Overview page
- `SellerManagement.jsx` - Seller verification
- `OrderManagement.jsx` - Order tracking
- `UserManagement.jsx` - User administration
- `ProductManagement.jsx` - Content moderation
- `PaymentManagement.jsx` - Escrow management
- `Analytics.jsx` - Revenue analytics
- `TransactionManagement.jsx` - Payment history

## 🔧 Backend Endpoints

```javascript
GET  /api/v1/admin/dashboard-overview
GET  /api/v1/admin/revenue-analytics?period=month
GET  /api/v1/admin/users?page=1&role=buyer
GET  /api/v1/admin/sellers-requests?verified=false
GET  /api/v1/admin/orders?status=pending
GET  /api/v1/admin/products
GET  /api/v1/admin/posts
GET  /api/v1/admin/get-order-payment-status
GET  /api/v1/admin/transactions

POST /api/v1/admin/accept-seller-request/:sellerId
POST /api/v1/admin/release-payment/:escrowId

DELETE /api/v1/admin/users/:role/:userId
DELETE /api/v1/admin/products/:productId
DELETE /api/v1/admin/posts/:postId
```

## 🎨 Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| Success | Green | Verified, delivered, released |
| Warning | Orange | Pending, held |
| Error | Red | Failed, cancelled, rejected |
| Info | Blue | Processing |
| Primary | Indigo/Purple | Default, active |

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Security

- Firebase authentication required
- Admin role validation
- JWT token on all requests
- Confirmation for delete operations

## 📦 Dependencies

```json
{
  "recharts": "^2.x.x",
  "axios": "^1.12.2",
  "react-router-dom": "^7.9.4",
  "lucide-react": "^0.552.0",
  "firebase": "^12.4.0"
}
```

## 🐛 Common Issues

**Charts not showing?**
- Run: `npm install recharts`

**401 Unauthorized?**
- Login as admin
- Check Firebase token
- Verify admin in MongoDB

**Data not loading?**
- Check backend is running
- Verify API URL in .env
- Check browser console

## 📚 Documentation

- `ADMIN_DASHBOARD_GUIDE.md` - Complete usage guide
- `ADMIN_DASHBOARD_IMPLEMENTATION_SUMMARY.md` - Technical details

## 🎉 Features

✅ Dashboard overview
✅ User management
✅ Seller verification
✅ Order tracking
✅ Product moderation
✅ Payment releases
✅ Revenue analytics
✅ Transaction history
✅ Search & filters
✅ Pagination
✅ Responsive design
✅ Interactive charts

## 💡 Pro Tips

1. Use filters to find specific items quickly
2. Check analytics regularly for trends
3. Release payments only after delivery confirmation
4. Review seller details before approval
5. Use search for large datasets
6. Monitor pending items dashboard section
