# Post Feature - Quick Usage Guide

## 🚀 Getting Started

### 1. View All Posts
Navigate to `/posts` to see all available posts.

**Features:**
- Search posts by title/description
- Filter by status (All/Open/Closed)
- Click any post card to view details

### 2. Create a Post (Buyers Only)

**Prerequisites:** Must be logged in as a buyer

1. Navigate to `/posts`
2. Click "Create Post" button (top right)
3. Or navigate directly to `/create-post`

**Form Fields:**
- **Title** (required) - Brief title for your need
- **Description** (required) - Detailed description of what you need
- **Budget** (required) - Your budget in PKR
- **Image** (required) - Upload an image

**Example:**
```
Title: Need a Logo Designer
Description: I need a professional logo for my startup. Should be modern and clean.
Budget: 15000
Image: [Upload sample/reference image]
```

### 3. View Post Details

Click any post card or navigate to `/post/:postId`

**What you can do:**
- View full post details
- Like the post (if authenticated)
- Add comments
- View all comments
- **If you're a seller:** Send an offer
- **If you're the post owner:** View and manage offers

### 4. Like a Post

**Who can like:** Authenticated Buyers only

1. Click the heart icon on any post
2. Click again to unlike
3. See real-time like count

### 5. Comment on a Post

**Who can comment:** Both Buyers and Sellers (authenticated)

1. Navigate to post details
2. Ensure you're on the "Comments" tab
3. Type your comment in the text area
4. Click "Post Comment"

**To delete your comment:**
- Click the trash icon on your own comments

### 6. Send an Offer (Sellers Only)

**Prerequisites:** 
- Must be logged in as a seller
- Post must be "Open" status
- Cannot be the post owner

**Steps:**
1. Navigate to post details
2. Click "Send Offer" button
3. Enter your offer amount in PKR
4. Click "Send Offer"

**Tips:**
- Consider the buyer's budget when making your offer
- Be competitive but realistic
- You can see all your sent offers on the post

### 7. Manage Offers (Buyers/Post Owners Only)

**Prerequisites:** Must be the post owner

1. Navigate to your post details
2. Click "Offers" tab
3. Review all received offers

**Actions:**
- **Accept:** Closes the post and accepts the offer
- **Reject:** Declines the offer (post remains open)

**Notes:**
- Once an offer is accepted, the post is automatically closed
- You cannot accept/reject offers on closed posts
- You can see offer status (Pending/Accepted/Rejected)

## 🎨 Visual Features

### Animations
- Smooth page transitions
- Hover effects on cards
- Button press animations
- Loading spinners

### Theme
- Consistent blue gradient theme (`#3772ff`)
- Dark mode support
- Responsive design (mobile, tablet, desktop)
- 'Lemon Milk' font for headings

### Status Indicators
- **Green badge:** Open post
- **Gray badge:** Closed post
- **Yellow badge:** Pending offer
- **Green badge:** Accepted offer
- **Red badge:** Rejected offer

## 🔒 Role-Based Access

### As a Buyer
```
✅ Create posts
✅ View all posts
✅ Like posts
✅ Comment on posts
✅ Accept/Reject offers on YOUR posts
❌ Send offers
```

### As a Seller
```
✅ View all posts
✅ Comment on posts
✅ Send offers on open posts
✅ View offers you sent
❌ Create posts
❌ Like posts
❌ Accept/reject offers (unless you're the post owner)
```

### As a Guest
```
✅ View all posts
✅ View post details
❌ Everything else requires authentication
```

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (single column)
- **Tablet:** 768px - 1024px (2 columns)
- **Desktop:** > 1024px (3 columns)

## 🐛 Common Issues

### "Only buyers can create posts"
**Solution:** Make sure you're logged in with a buyer account.

### "Cannot send offer"
**Possible reasons:**
1. Not logged in as a seller
2. Post is closed
3. You're the post owner

### "Please login to like posts"
**Solution:** You need to be authenticated to like posts.

### "Failed to add comment"
**Check:**
1. Are you authenticated?
2. Is the comment empty?
3. Check your internet connection

## 🎯 Best Practices

### For Buyers
1. Be clear and detailed in post descriptions
2. Set realistic budgets
3. Review seller profiles before accepting offers
4. Respond to offers promptly

### For Sellers
1. Make competitive but fair offers
2. Read post descriptions carefully
3. Comment to show interest or ask questions
4. Be professional in communications

## 📊 Data Flow

```
User Action → Frontend Component → API Call → Backend Controller → Database
                                         ↓
                                    Response
                                         ↓
User Interface Updates ← Component State Update ← API Response
```

## 🔧 Troubleshooting

### Post not loading
1. Check if postId is correct in URL
2. Verify API endpoint is accessible
3. Check browser console for errors

### Offer not sending
1. Verify you're logged in as seller
2. Check post status is "open"
3. Ensure offer amount is valid (> 0)

### Images not displaying
1. Check Cloudinary configuration
2. Verify image URL in database
3. Check image upload during post creation

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Verify authentication status
3. Check API response in Network tab
4. Review role permissions

## 🎓 Example Scenarios

### Scenario 1: Buyer Creates Post
```
1. Buyer logs in
2. Navigates to /posts
3. Clicks "Create Post"
4. Fills form: Title, Description, Budget, Image
5. Submits form
6. Post appears in listing
```

### Scenario 2: Seller Sends Offer
```
1. Seller logs in
2. Browses posts
3. Finds interesting open post
4. Clicks to view details
5. Clicks "Send Offer"
6. Enters offer amount
7. Submits offer
8. Offer appears in post's offers list
```

### Scenario 3: Buyer Accepts Offer
```
1. Buyer views their post
2. Clicks "Offers" tab
3. Reviews received offers
4. Clicks "Accept" on preferred offer
5. Confirms acceptance
6. Post status changes to "Closed"
7. Seller is notified (future: email/notification)
```

## 🌟 Tips for Best Results

1. **Use high-quality images** for posts
2. **Be specific** in descriptions
3. **Set realistic budgets** based on market rates
4. **Respond quickly** to offers and comments
5. **Keep communication professional**
6. **Update post status** if requirements change

---

**Happy Trading! 🎉**
