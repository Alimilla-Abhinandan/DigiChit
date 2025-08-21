import React, { useEffect } from 'react';
import axios from 'axios';

const RazorpayPayment = ({ amount, groupName, onSuccess, onFailure, onClose }) => {
  const key_id = 'rzp_test_7aX03mWJpZE2T2';

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initializePayment();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayment = async () => {
    try {
      // Create order on backend
      const orderData = {
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          groupName: groupName
        }
      };

      const response = await axios.post('http://localhost:5050/api/payment/create-order', orderData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create order');
      }

      const order = response.data.order;

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'DigiChit',
        description: `Payment for ${groupName}`,
        image: 'https://via.placeholder.com/150x50/4CAF50/FFFFFF?text=DigiChit',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const verificationResponse = await axios.post('http://localhost:5050/api/payment/verify-payment', verificationData);
            
            if (verificationResponse.data.success) {
              // Payment verified successfully
              console.log('Payment verified:', verificationResponse.data);
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: amount,
                groupName: groupName
              });
            } else {
              // Payment verification failed
              console.error('Payment verification failed:', verificationResponse.data);
              onFailure(new Error('Payment verification failed'));
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure(error);
          }
        },
        prefill: {
          name: 'User Name', // You can get this from user context
          email: 'user@example.com', // You can get this from user context
          contact: '9999999999' // You can get this from user context
        },
        notes: {
          groupName: groupName
        },
        theme: {
          color: '#4CAF50'
        },
        modal: {
          ondismiss: function() {
            onClose();
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization failed:', error);
      onFailure(error);
    }
  };

  return null; // This component doesn't render anything visible
};

export default RazorpayPayment;
