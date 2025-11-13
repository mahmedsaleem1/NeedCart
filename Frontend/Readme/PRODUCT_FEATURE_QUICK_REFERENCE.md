# Product Feature - Quick Reference

## 🚀 Quick Start

### For Sellers
1. Login as Seller
2. Go to `/products`
3. Click "Add Product"
4. Fill form and upload image
5. Manage products at `/my-products`

### For Buyers
1. Login as Buyer
2. Go to `/products`
3. Browse, search, filter products
4. Click product to view details
5. Add to wishlist or buy now

## 📍 Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/products` | Browse all products | Public |
| `/product/:productId` | Product details | Public |
| `/add-product` | Add new product | Seller only |
| `/my-products` | Manage seller's products | Seller only |
| `/wishlist` | View wishlist | Buyer only |

## 🎯 Key Features

### Product Listing
```javascript
// Browse with filters
- Search: by title/description
- Filter: by category
- Filter: by stock status
```

### Purchase Flow
```javascript
// Payment options
1. Stripe (Card Payment)
   - Redirects to Stripe checkout
   - Secure payment processing
   - Returns with success/failure status

2. Cash on Delivery
   - Order placed immediately
   - Payment on delivery
   - Status: confirmed
```

### Review System
```javascript
// Requirements to review
- Must be a Buyer
- Must have purchased the product
- Order must be delivered
```

## 🔑 API Endpoints

### Products
```
GET  /api/v1/product/all              - Get all products
GET  /api/v1/product/getOne/:prodId   - Get single product
POST /api/v1/product/add              - Add product (Seller)
POST /api/v1/product/remove/:prodId   - Delete product (Seller)
```

### Reviews
```
GET  /api/v1/review/get/:prodId       - Get product reviews
POST /api/v1/review/add/:prodId       - Add review (Buyer)
POST /api/v1/review/delete/:revId     - Delete review (Author)
```

### Wishlist
```
GET  /api/v1/wishlist/get             - Get user wishlist (Buyer)
POST /api/v1/wishlist/add/:prodId     - Add to wishlist (Buyer)
POST /api/v1/wishlist/delete/:prodId  - Remove from wishlist (Buyer)
```

### Payment
```
POST /api/v1/top/buy/:itemId          - Stripe payment (itemId = productId)
POST /api/v1/cod/buy/:itemId          - Cash on Delivery (itemId = productId)
```

## 📦 Components

### ProductCard
```jsx
<ProductCard product={productObject} />
```
- Displays product in card format
- Shows image, title, price, stock
- Click to navigate to details

### Product
```jsx
<Product />
```
- Full product details page
- Purchase functionality
- Reviews section
- Wishlist toggle

### AddProduct
```jsx
<AddProduct />
```
- Form to add new product
- Image upload
- Category selection
- Validation

### CreateReview
```jsx
<CreateReview 
  productId={productId} 
  onReviewAdded={callback} 
/>
```
- Star rating selector
- Comment textarea
- Submit with validation

### ReviewCard
```jsx
<ReviewCard 
  review={reviewObject} 
  onDelete={callback} 
/>
```
- Display single review
- Author name and date
- Star rating
- Delete option for author

## 🎨 Design Tokens

```css
/* Colors */
Primary: #3772ff
Success: green-500
Error: red-500
Warning: yellow-400

/* Spacing */
Container: max-w-7xl
Padding: px-4, py-20
Gap: gap-4, gap-6, gap-8

/* Typography */
Heading: Lemon Milk font
Size: text-xl to text-6xl

/* Effects */
Shadows: shadow-xl, shadow-2xl
Rounded: rounded-xl, rounded-2xl, rounded-3xl
Hover: scale-105, shadow transitions
```

## 🔐 Access Control

```javascript
// Role-based permissions
Seller:
  ✅ Add product
  ✅ Delete own products
  ✅ View my products
  ❌ Buy products
  ❌ Add to wishlist
  ❌ Write reviews

Buyer:
  ✅ Buy products (Stripe/COD)
  ✅ Add to wishlist
  ✅ Write reviews (after delivery)
  ✅ Browse products
  ❌ Add products
  ❌ Delete products
```

## 💳 Payment Flow

### Stripe Payment
```
1. User clicks "Buy Now"
2. Selects Stripe payment
3. Enters address
4. Confirms purchase
5. → Redirected to Stripe
6. Completes payment
7. → Redirected back with status
8. Order confirmed
```

### Cash on Delivery
```
1. User clicks "Buy Now"
2. Selects COD payment
3. Enters address
4. Confirms purchase
5. Order placed (status: confirmed)
6. Wait for delivery
7. Pay on delivery
8. Status updated to delivered
```

## 📊 Data Models

### Product
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId (ref: Seller),
  title: String,
  description: String,
  image: String (URL),
  category: Enum,
  price: Number,
  availableStock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId (ref: Buyer),
  productId: ObjectId (ref: Product),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Wishlist
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId (ref: Buyer),
  productId: ObjectId (ref: Product),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId (ref: Buyer),
  sellerId: ObjectId (ref: Seller),
  productId: ObjectId (ref: Product),
  totalPrice: Number,
  paymentStatus: Enum ['pending', 'paid', 'failed'],
  paymentMethod: Enum ['stripe', 'cod'],
  transactionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId (ref: Buyer),
  sellerId: ObjectId (ref: Seller),
  productId: ObjectId (ref: Product),
  transactionId: ObjectId (ref: Transaction),
  address: String,
  quantity: Number,
  totalPrice: Number,
  status: Enum ['pending', 'confirmed', 'delivered', 'cancelled'],
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Common Issues

### Issue: "You must be logged in"
**Solution:** User not authenticated. Redirect to `/login`

### Issue: "Only sellers can add products"
**Solution:** User logged in as Buyer. Switch to Seller account.

### Issue: "Product not found"
**Solution:** Invalid productId or product deleted. Go back to products list.

### Issue: "You can only review delivered products"
**Solution:** Order not delivered yet. Wait for delivery confirmation.

### Issue: "Not enough stock available"
**Solution:** Selected quantity exceeds available stock. Reduce quantity.

### Issue: Payment redirect not working
**Solution:** Check VITE_URL environment variable. Ensure backend is running.

## 📱 Responsive Breakpoints

```css
Mobile:   < 768px  (default)
Tablet:   768px+   (md:)
Desktop:  1024px+  (lg:)
```

## 🎯 Testing Commands

```bash
# Frontend
cd Frontend
npm run dev

# Backend
cd Backend
npm start

# Access
Frontend: http://localhost:5173
Backend:  http://localhost:8000 (or your configured port)
```

## 📝 Example Usage

### Adding a Product (Seller)
```javascript
const productData = {
  title: "Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  category: "Electronics",
  price: 5999,
  availableStock: 50,
  image: File
}
```

### Making a Purchase (Buyer)
```javascript
const purchaseData = {
  address: "123 Main St, City, Country",
  quantity: 2,
  totalPrice: 11998,
  paymentMethod: "stripe" // or "cod"
}
```

### Writing a Review (Buyer)
```javascript
const reviewData = {
  rating: 5,
  comment: "Excellent product! Highly recommended."
}
```

## 🔄 State Management

```javascript
// Redux store used for:
- User authentication state
- User role (buyer/seller/admin)
- User profile data

// Component state used for:
- Product data
- Reviews array
- Wishlist items
- Loading states
- Error messages
- Form inputs
```

## 🎁 Tips & Best Practices

1. **Always validate input** before submitting forms
2. **Check authentication** before accessing protected routes
3. **Handle errors gracefully** with user-friendly messages
4. **Show loading states** during API calls
5. **Use optimistic updates** for better UX (wishlist toggle)
6. **Implement confirmation dialogs** for destructive actions (delete)
7. **Cache product data** when possible to reduce API calls
8. **Lazy load images** for better performance
9. **Debounce search input** to reduce unnecessary API calls
10. **Test with different user roles** to ensure proper access control

---

**Need help?** Check the complete guide at `PRODUCT_FEATURE_COMPLETE_GUIDE.md`
