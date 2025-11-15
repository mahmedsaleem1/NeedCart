# Admin Dashboard Component Architecture

## 🏗️ Component Hierarchy

```
App.jsx
│
└── Router
    │
    └── Route: /admin
        │
        └── AdminLayout.jsx
            │
            ├── Sidebar Navigation
            │   ├── Dashboard Link
            │   ├── Users Link
            │   ├── Sellers Link
            │   ├── Orders Link
            │   ├── Products Link
            │   ├── Payments Link
            │   ├── Analytics Link
            │   ├── Transactions Link
            │   └── Logout Button
            │
            └── Outlet (Main Content Area)
                │
                ├── /admin/dashboard → AdminDashboard.jsx
                │   ├── StatCard (x12 metrics)
                │   ├── Order Status Breakdown Chart
                │   ├── Product Category Chart
                │   └── Quick Action Buttons
                │
                ├── /admin/users → UserManagement.jsx
                │   ├── Stats Cards (x3)
                │   ├── Search & Filter Bar
                │   ├── Users Table
                │   ├── Pagination
                │   ├── UserDetailsModal
                │   └── DeleteConfirmModal
                │
                ├── /admin/sellers → SellerManagement.jsx
                │   ├── Search & Filter Bar
                │   ├── Sellers Table
                │   ├── Pagination
                │   └── SellerDetailsModal
                │       ├── Contact Info
                │       ├── Bank Details
                │       └── Action Buttons
                │
                ├── /admin/orders → OrderManagement.jsx
                │   ├── Status Filter Buttons
                │   ├── Orders Table
                │   ├── Pagination
                │   └── OrderDetailsModal
                │       ├── Buyer Info
                │       ├── Seller Info
                │       ├── Product Info
                │       ├── Shipping Info
                │       └── Order Timeline
                │
                ├── /admin/products → ProductManagement.jsx
                │   ├── Tabs (Products/Posts)
                │   ├── Search Bar
                │   ├── Product/Post Grid
                │   ├── Pagination
                │   ├── ItemDetailsModal
                │   └── DeleteConfirmModal
                │
                ├── /admin/payments → PaymentManagement.jsx
                │   ├── Stats Cards (x4)
                │   ├── Status Filter Buttons
                │   ├── Payments Table
                │   └── PaymentDetailsModal
                │       ├── Payment Breakdown
                │       ├── Order Info
                │       ├── Timeline
                │       └── Release Button
                │
                ├── /admin/analytics → Analytics.jsx
                │   ├── Period Selector
                │   ├── Key Metrics Cards (x4)
                │   ├── Revenue Trend LineChart
                │   ├── Order Volume BarChart
                │   ├── Platform Fees BarChart
                │   └── Detailed Data Table
                │
                └── /admin/transactions → TransactionManagement.jsx
                    ├── Stats Cards (x5)
                    ├── Status Filter Buttons
                    ├── Transactions Table
                    ├── Pagination
                    └── TransactionDetailsModal
                        ├── Payment Info
                        ├── Buyer Info
                        ├── Order Info
                        └── Timeline
```

## 🎨 Reusable Components

### StatCard
```jsx
<StatCard
  icon={Icon}
  title="Title"
  value="1234"
  subtitle="Description"
  color="#6366f1"
  trend="+12%"
/>
```

**Used in:**
- AdminDashboard.jsx (12 instances)
- UserManagement.jsx (3 instances)
- PaymentManagement.jsx (4 instances)
- TransactionManagement.jsx (5 instances)

### Modal Pattern
```jsx
<Modal onClose={handleClose}>
  <ModalHeader />
  <ModalBody>
    {/* Sections */}
  </ModalBody>
  <ModalActions />
</Modal>
```

**Variants:**
- UserDetailsModal
- SellerDetailsModal
- OrderDetailsModal
- ItemDetailsModal
- PaymentDetailsModal
- TransactionDetailsModal
- DeleteConfirmModal

### Table Pattern
```jsx
<Table>
  <thead>
    <tr>
      <th>Column Headers</th>
    </tr>
  </thead>
  <tbody>
    {data.map(item => (
      <tr key={item.id}>
        <td>Data</td>
      </tr>
    ))}
  </tbody>
</Table>
```

**Used in:**
- All management pages
- Analytics detail table

## 🔄 Data Flow

```
1. Component Mount
   ↓
2. useEffect Hook
   ↓
3. Fetch Data (axios)
   ↓
4. auth.currentUser.getIdToken()
   ↓
5. API Request with JWT
   ↓
6. Backend Validation
   ↓
7. Database Query
   ↓
8. Response
   ↓
9. setState
   ↓
10. UI Update
```

## 🎯 State Management Pattern

### Per Component State
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [filter, setFilter] = useState('all');
const [searchTerm, setSearchTerm] = useState('');
const [pagination, setPagination] = useState({
  currentPage: 1,
  totalPages: 1
});
const [selectedItem, setSelectedItem] = useState(null);
const [showModal, setShowModal] = useState(false);
```

## 📦 Props Flow

### AdminLayout → Child Pages
- **Outlet Context**: None (independent pages)
- **Navigation**: React Router
- **Authentication**: Firebase auth.currentUser

### Parent → Modal Components
```javascript
<Modal
  item={selectedItem}
  onClose={() => setShowModal(false)}
  onConfirm={handleAction}
/>
```

## 🔌 API Integration Pattern

```javascript
// Standard Fetch Pattern
const fetchData = async () => {
  try {
    setLoading(true);
    const token = await auth.currentUser.getIdToken();
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/endpoint`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

## 🎨 Styling Architecture

### Tailwind CSS Classes Pattern
```
Layout: flex, grid, space-y, gap
Colors: bg-{color}-{shade}, text-{color}-{shade}
Sizing: w-full, h-screen, p-6, px-4
Effects: shadow-md, hover:shadow-xl, rounded-xl
States: hover:, focus:, disabled:
Transitions: transition-colors, duration-300
```

### Gradient Pattern
```css
bg-gradient-to-r from-{color1}-600 to-{color2}-600
```

**Used for:**
- Page headers
- Active navigation items
- Primary buttons

## 📊 Chart Components (Recharts)

### LineChart Structure
```jsx
<ResponsiveContainer>
  <LineChart data={data}>
    <CartesianGrid />
    <XAxis />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line dataKey="value" />
  </LineChart>
</ResponsiveContainer>
```

### BarChart Structure
```jsx
<ResponsiveContainer>
  <BarChart data={data}>
    <CartesianGrid />
    <XAxis />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" />
  </BarChart>
</ResponsiveContainer>
```

## 🔐 Authentication Flow

```
1. User navigates to /admin
   ↓
2. AdminLayout checks auth.currentUser
   ↓
3. If not authenticated → Redirect to /login
   ↓
4. If authenticated → Get JWT token
   ↓
5. Token included in all API requests
   ↓
6. Backend verifies token
   ↓
7. Backend checks admin role
   ↓
8. If valid → Return data
   ↓
9. If invalid → Return 401
```

## 🎭 Component Lifecycle

### Mount Phase
```
1. Component renders
2. useEffect runs
3. fetchData() called
4. Loading state = true
5. API request
6. Response received
7. setState with data
8. Loading state = false
9. Component re-renders with data
```

### Update Phase
```
1. Filter/pagination changes
2. useEffect dependency triggers
3. fetchData() called again
4. New data fetched
5. State updated
6. Component re-renders
```

## 🚀 Performance Optimizations

1. **Lazy Loading**: Charts loaded only when needed
2. **Pagination**: Limit data per page (20 items)
3. **Debouncing**: Search inputs (can be added)
4. **Memoization**: Static data (can use useMemo)
5. **Code Splitting**: Route-based splitting
6. **Conditional Rendering**: Show only what's needed

## 🧩 Integration Points

### Frontend ↔ Backend
- **Authentication**: Firebase JWT
- **API Communication**: Axios
- **Data Format**: JSON
- **Error Handling**: Try-catch blocks

### Frontend ↔ Firebase
- **Auth**: auth.currentUser
- **Token**: getIdToken()
- **Logout**: auth.signOut()

## 📝 Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| AdminLayout | Navigation, layout structure |
| AdminDashboard | Overview, statistics display |
| SellerManagement | Seller verification workflow |
| OrderManagement | Order tracking, monitoring |
| UserManagement | User CRUD operations |
| ProductManagement | Content moderation |
| PaymentManagement | Escrow payment releases |
| Analytics | Data visualization, charts |
| TransactionManagement | Payment history display |

This architecture ensures:
- ✅ Clear separation of concerns
- ✅ Reusable component patterns
- ✅ Consistent data flow
- ✅ Maintainable code structure
- ✅ Scalable design
