import React, { useState } from "react";
import "./Payments.css";
import { motion } from "framer-motion";
import { FaCreditCard, FaHistory, FaClock, FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import RazorpayPayment from "./RazorpayPayment";
import ContributionHistory from "./ContributionHistory";

export default function Payments() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const mockPayments = [
    {
      id: 1,
      groupName: "Family Chit Group",
      amount: 5000,
      dueDate: "2024-02-15",
      status: "pending",
      type: "monthly"
    },
    {
      id: 2,
      groupName: "Office Savings",
      amount: 3000,
      dueDate: "2024-02-20",
      status: "paid",
      type: "weekly"
    },
    {
      id: 3,
      groupName: "Neighborhood Fund",
      amount: 7500,
      dueDate: "2024-02-25",
      status: "overdue",
      type: "monthly"
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      groupName: "Family Chit Group",
      amount: 5000,
      date: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      groupName: "Office Savings",
      amount: 3000,
      date: "2024-01-10",
      status: "completed"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <FaCheckCircle className="status-icon paid" />;
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'overdue':
        return <FaExclamationTriangle className="status-icon overdue" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return '#2e8b57';
      case 'pending':
        return '#ffd700';
      case 'overdue':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
    setPaymentStatus(null);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setPaymentStatus('success');
    // Update the payment status in your backend here
    // For now, we'll just update the local state
    const updatedPayments = mockPayments.map(payment => 
      payment.id === selectedPayment.id 
        ? { ...payment, status: 'paid' }
        : payment
    );
    // In a real app, you'd update the state properly
    setTimeout(() => {
      setShowPaymentModal(false);
      setSelectedPayment(null);
      setPaymentStatus(null);
    }, 2000);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setPaymentStatus('failed');
    setTimeout(() => {
      setShowPaymentModal(false);
      setSelectedPayment(null);
      setPaymentStatus(null);
    }, 2000);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentStatus(null);
  };

  return (
    <div className="payments-container">
      <motion.div 
        className="payments-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="payments-title-section">
          <FaCreditCard className="payments-icon" />
          <h2 className="payments-title">Payments</h2>
        </div>
        <div className="payments-summary">
          <div className="summary-card">
            <span className="summary-label">To Pay</span>
            <span className="summary-amount">₹12,500</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">This Month</span>
            <span className="summary-amount">₹8,000</span>
          </div>
        </div>
      </motion.div>

      <div className="payments-content">
        <div className="payments-section">
          <h3 className="section-title">Pending Payments</h3>
          <div className="payments-grid">
            {mockPayments.map((payment, index) => (
              <motion.div
                key={payment.id}
                className="payment-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="payment-header">
                  <h4 className="payment-group">{payment.groupName}</h4>
                  {getStatusIcon(payment.status)}
                </div>
                <div className="payment-amount">
                  ₹{payment.amount.toLocaleString()}
                </div>
                <div className="payment-details">
                  <span className="payment-type">{payment.type}</span>
                  <span className="payment-due">Due: {payment.dueDate}</span>
                </div>
                <div className="payment-actions">
                  <button 
                    className="payment-btn primary" 
                    onClick={() => handlePayNow(payment)}
                  >
                    Pay Now
                  </button>
                  <button className="payment-btn secondary">View Details</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="payments-section">
          <h3 className="section-title">
            <FaHistory className="section-icon" />
            Payment History
          </h3>
          <div className="history-list">
            {paymentHistory.map((payment, index) => (
              <motion.div
                key={payment.id}
                className="history-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="history-info">
                  <h4 className="history-group">{payment.groupName}</h4>
                  <span className="history-date">{payment.date}</span>
                </div>
                <div className="history-amount">
                  ₹{payment.amount.toLocaleString()}
                </div>
                <div className="history-status">
                  {getStatusIcon(payment.status)}
                  <span style={{ color: getStatusColor(payment.status) }}>
                    {payment.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <motion.div 
          className="payment-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="payment-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="modal-header">
              <h3>Payment Details</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="payment-summary">
                <h4>{selectedPayment.groupName}</h4>
                <div className="amount-display">
                  ₹{selectedPayment.amount.toLocaleString()}
                </div>
                <p>Due Date: {selectedPayment.dueDate}</p>
              </div>

              {paymentStatus === 'success' && (
                <div className="payment-status success">
                  <FaCheckCircle />
                  <p>Payment Successful!</p>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="payment-status failed">
                  <FaExclamationTriangle />
                  <p>Payment Failed. Please try again.</p>
                </div>
              )}

              {!paymentStatus && (
                <RazorpayPayment
                  amount={selectedPayment.amount}
                  groupName={selectedPayment.groupName}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  onClose={handleCloseModal}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      <div style={{ marginTop: 24 }}>
        <ContributionHistory />
      </div>
    </div>
  );
} 