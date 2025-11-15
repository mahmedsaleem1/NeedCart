import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL_ADDRESS,        
    pass: process.env.GMAIL_APP_PASSWORD,            
  },
});

export const sendEmail = async (to, subject, text, html = null) => {
  const mailOptions = {
    from: `NeedCart <${process.env.GMAIL_EMAIL_ADDRESS}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Email template for order placed (sent to buyer)
export const sendOrderPlacedEmailToBuyer = async (buyerEmail, orderDetails) => {
  const { orderId, itemName, quantity, totalPrice, address, status } = orderDetails;
  
  const subject = `Order Confirmation - Order #${orderId}`;
  const text = `Your order has been placed successfully!\n\nOrder ID: ${orderId}\nItem: ${itemName}\nQuantity: ${quantity}\nTotal Price: Rs. ${totalPrice}\nDelivery Address: ${address}\nStatus: ${status}\n\nThank you for shopping with NeedCart!`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Placed Successfully! 🎉</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Thank you for your order! We're excited to let you know that your order has been placed successfully.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
            <p><strong>Delivery Address:</strong> ${address}</p>
            <p><strong>Status:</strong> <span style="color: #FFA500;">${status.toUpperCase()}</span></p>
          </div>
          
          <p>We'll notify you once the seller confirms your order and when it's on its way!</p>
        </div>
        <div class="footer">
          <p>Thank you for shopping with NeedCart!</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(buyerEmail, subject, text, html);
};

// Email template for new order (sent to seller)
export const sendNewOrderEmailToSeller = async (sellerEmail, orderDetails) => {
  const { orderId, itemName, quantity, totalPrice, address, buyerEmail } = orderDetails;
  
  const subject = `New Order Received - Order #${orderId}`;
  const text = `You have received a new order!\n\nOrder ID: ${orderId}\nItem: ${itemName}\nQuantity: ${quantity}\nTotal Price: Rs. ${totalPrice}\nDelivery Address: ${address}\nBuyer: ${buyerEmail}\n\nPlease confirm and process this order.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        .alert { background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Received! 📦</h1>
        </div>
        <div class="content">
          <p>Dear Seller,</p>
          <p>Great news! You have received a new order on NeedCart.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
            <p><strong>Delivery Address:</strong> ${address}</p>
            <p><strong>Buyer Email:</strong> ${buyerEmail}</p>
          </div>
          
          <div class="alert">
            <strong>Action Required:</strong> Please log in to your dashboard to confirm and process this order.
          </div>
        </div>
        <div class="footer">
          <p>NeedCart Seller Dashboard</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(sellerEmail, subject, text, html);
};

// Email template for order confirmed (sent to buyer)
export const sendOrderConfirmedEmailToBuyer = async (buyerEmail, orderDetails) => {
  const { orderId, itemName, totalPrice } = orderDetails;
  
  const subject = `Order Confirmed - Order #${orderId}`;
  const text = `Your order has been confirmed by the seller!\n\nOrder ID: ${orderId}\nItem: ${itemName}\nTotal Price: Rs. ${totalPrice}\n\nYour order is being prepared for delivery.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! ✅</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Good news! The seller has confirmed your order and is preparing it for delivery.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
            <p><strong>Status:</strong> <span style="color: #4CAF50;">CONFIRMED</span></p>
          </div>
          
          <p>We'll notify you once your order is delivered!</p>
        </div>
        <div class="footer">
          <p>Thank you for shopping with NeedCart!</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(buyerEmail, subject, text, html);
};

// Email template for order delivered (sent to buyer)
export const sendOrderDeliveredEmailToBuyer = async (buyerEmail, orderDetails) => {
  const { orderId, itemName, totalPrice } = orderDetails;
  
  const subject = `Order Delivered - Order #${orderId}`;
  const text = `Your order has been delivered!\n\nOrder ID: ${orderId}\nItem: ${itemName}\nTotal Price: Rs. ${totalPrice}\n\nWe hope you enjoy your purchase! Please consider leaving a review.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Delivered! 🚚</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Great news! Your order has been successfully delivered.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
            <p><strong>Status:</strong> <span style="color: #4CAF50;">DELIVERED</span></p>
          </div>
          
          <p>We hope you love your purchase! If you're satisfied with your order, please consider leaving a review to help other shoppers.</p>
        </div>
        <div class="footer">
          <p>Thank you for shopping with NeedCart!</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(buyerEmail, subject, text, html);
};

// Email template for order delivered (sent to seller)
export const sendOrderDeliveredEmailToSeller = async (sellerEmail, orderDetails) => {
  const { orderId, itemName, totalPrice } = orderDetails;
  
  const subject = `Order Delivered - Order #${orderId}`;
  const text = `Order has been marked as delivered!\n\nOrder ID: ${orderId}\nItem: ${itemName}\nTotal Price: Rs. ${totalPrice}\n\nPayment will be released after admin verification.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Delivered! ✅</h1>
        </div>
        <div class="content">
          <p>Dear Seller,</p>
          <p>The order has been successfully marked as delivered.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
            <p><strong>Status:</strong> <span style="color: #4CAF50;">DELIVERED</span></p>
          </div>
          
          <p>Your payment will be released to your account after admin verification. Thank you for being a valued seller on NeedCart!</p>
        </div>
        <div class="footer">
          <p>NeedCart Seller Dashboard</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(sellerEmail, subject, text, html);
};

// Email template for order cancelled (sent to buyer)
export const sendOrderCancelledEmailToBuyer = async (buyerEmail, orderDetails) => {
  const { orderId, itemName, totalPrice } = orderDetails;
  
  const subject = `Order Cancelled - Order #${orderId}`;
  const text = `Your order has been cancelled.\n\nOrder ID: ${orderId}\nItem: ${itemName}\nTotal Price: Rs. ${totalPrice}\n\nIf payment was made, it will be refunded to your account within 5-7 business days.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Cancelled</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Your order has been cancelled.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
            <p><strong>Status:</strong> <span style="color: #f44336;">CANCELLED</span></p>
          </div>
          
          <p>If you made a payment, your refund will be processed within 5-7 business days.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>NeedCart Customer Support</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(buyerEmail, subject, text, html);
};

// Email template for order cancelled (sent to seller)
export const sendOrderCancelledEmailToSeller = async (sellerEmail, orderDetails) => {
  const { orderId, itemName, totalPrice } = orderDetails;
  
  const subject = `Order Cancelled - Order #${orderId}`;
  const text = `An order has been cancelled.\n\nOrder ID: ${orderId}\nItem: ${itemName}\nTotal Price: Rs. ${totalPrice}\n\nThe item stock has been restored.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Cancelled</h1>
        </div>
        <div class="content">
          <p>Dear Seller,</p>
          <p>An order has been cancelled.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
            <p><strong>Status:</strong> <span style="color: #f44336;">CANCELLED</span></p>
          </div>
          
          <p>The item stock has been automatically restored to your inventory.</p>
        </div>
        <div class="footer">
          <p>NeedCart Seller Dashboard</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(sellerEmail, subject, text, html);
};

// Email template for payment released (sent to seller)
export const sendPaymentReleasedEmailToSeller = async (sellerEmail, paymentDetails) => {
  const { orderId, totalAmount, platformFee, netAmount, bankName, accountNumber } = paymentDetails;
  
  const subject = `Payment Released - Order #${orderId}`;
  const text = `Your payment has been released!\n\nOrder ID: ${orderId}\nTotal Amount: Rs. ${totalAmount}\nPlatform Fee: Rs. ${platformFee}\nNet Amount: Rs. ${netAmount}\nBank: ${bankName}\nAccount: ${accountNumber}\n\nThe payment will be transferred to your account within 2-3 business days.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .payment-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .highlight { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Released! 💰</h1>
        </div>
        <div class="content">
          <p>Dear Seller,</p>
          <p>Congratulations! Your payment has been released by the admin.</p>
          
          <div class="payment-details">
            <h3>Payment Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total Amount:</strong> Rs. ${totalAmount.toFixed(2)}</p>
            <p><strong>Platform Fee:</strong> Rs. ${platformFee.toFixed(2)}</p>
            <p><strong>Net Amount (Your Earnings):</strong> <strong style="color: #4CAF50; font-size: 18px;">Rs. ${netAmount.toFixed(2)}</strong></p>
          </div>
          
          <div class="highlight">
            <h4>Transfer Details:</h4>
            <p><strong>Bank:</strong> ${bankName}</p>
            <p><strong>Account Number:</strong> ${accountNumber}</p>
            <p>The payment will be transferred to your account within <strong>2-3 business days</strong>.</p>
          </div>
          
          <p>Thank you for being a valued seller on NeedCart!</p>
        </div>
        <div class="footer">
          <p>NeedCart Seller Dashboard</p>
          <p>&copy; 2025 NeedCart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(sellerEmail, subject, text, html);
};