# Razorpay Payment Gateway Integration

This document describes the Razorpay payment gateway integration for the DigiChit application.

## Overview

The integration includes:
- Frontend payment modal with Razorpay checkout
- Backend API endpoints for order creation and payment verification
- Secure payment signature verification
- Payment status tracking

## Configuration

### Test Keys (Current Setup)
- **Key ID**: `rzp_test_7aX03mWJpZE2T2`
- **Key Secret**: `FBvFa5S18qfnpTo8acQBcxxs`

### Production Keys
For production, replace the test keys with your live Razorpay keys:
1. Update `client/src/components/payments/RazorpayPayment.jsx`
2. Update `server/controller/paymentController.js`

## Frontend Components

### RazorpayPayment.jsx
- Handles Razorpay checkout initialization
- Manages payment flow and callbacks
- Integrates with backend APIs for order creation and verification

### Payments.jsx (Updated)
- Payment modal with payment details
- Success/failure status display
- Integration with RazorpayPayment component

## Backend API Endpoints

### POST /api/payment/create-order
Creates a new Razorpay order.

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": {
    "groupName": "Family Chit Group"
  }
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_abc123",
    "amount": 500000,
    "currency": "INR",
    "receipt": "receipt_123"
  }
}
```

### POST /api/payment/verify-payment
Verifies payment signature after successful payment.

**Request Body:**
```json
{
  "razorpay_order_id": "order_abc123",
  "razorpay_payment_id": "pay_xyz789",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_xyz789",
  "orderId": "order_abc123"
}
```

### GET /api/payment/payment/:paymentId
Fetches payment details from Razorpay.

## Payment Flow

1. **User clicks "Pay Now"** on a payment card
2. **Payment modal opens** showing payment details
3. **RazorpayPayment component** creates order via backend API
4. **Razorpay checkout** opens with order details
5. **User completes payment** through Razorpay
6. **Payment verification** happens on backend
7. **Success/failure status** is displayed to user

## Security Features

- **Signature Verification**: All payments are verified using HMAC SHA256
- **Server-side Order Creation**: Orders are created on backend to prevent tampering
- **Payment Verification**: Payment signatures are verified before marking as successful

## Testing

### Test Cards
Use these test cards for testing:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI
- **Success**: success@razorpay
- **Failure**: failure@razorpay

## Error Handling

The integration includes comprehensive error handling:
- Network errors during API calls
- Payment verification failures
- Invalid payment signatures
- User cancellation of payment

## Future Enhancements

1. **Payment History**: Store payment records in database
2. **Email Notifications**: Send payment confirmations
3. **Refund Handling**: Implement refund functionality
4. **Webhook Integration**: Handle payment status updates
5. **Multiple Payment Methods**: Add support for more payment options

## Dependencies

### Frontend
- `razorpay`: Razorpay JavaScript SDK
- `axios`: HTTP client for API calls

### Backend
- `razorpay`: Razorpay Node.js SDK
- `crypto`: Node.js crypto module for signature verification

## Environment Variables

Add these to your `.env` file for production:

```env
RAZORPAY_KEY_ID=your_live_key_id
RAZORPAY_KEY_SECRET=your_live_key_secret
```

## Support

For issues related to:
- **Razorpay Integration**: Check Razorpay documentation
- **Payment Failures**: Verify test cards and network connectivity
- **Signature Verification**: Ensure key secret is correct
