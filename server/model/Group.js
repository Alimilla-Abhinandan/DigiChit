const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Group name is required'], 
    trim: true,
    maxlength: [100, 'Group name cannot be more than 100 characters']
  },
  description: { 
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  location: { 
    type: String,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Admin is required']
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  // Pending join requests requiring admin approval
  joinRequests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String }
  }],
  // Chit Fund Specific Fields
  monthlyAmount: {
    type: Number,
    required: [true, 'Monthly amount is required'],
    min: [1000, 'Monthly amount must be at least ₹1,000'],
    max: [100000, 'Monthly amount cannot exceed ₹1,00,000']
  },
  totalSlots: {
    type: Number,
    required: [true, 'Total slots is required'],
    default: 20,
    min: [5, 'Minimum 5 slots required'],
    max: [50, 'Maximum 50 slots allowed']
  },
  currentSlot: {
    type: Number,
    default: 0,
    min: [0, 'Current slot cannot be negative']
  },
  isStarted: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  biddingHistory: [{
    month: { type: Number, required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bidAmount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  paymentSchedule: [{
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slot: { type: Number, required: true },
    receivedAmount: { type: Number, default: 0 },
    receivedDate: { type: Date },
    monthlyPayments: [{
      month: { type: Number, required: true },
      amount: { type: Number, required: true },
      paid: { type: Boolean, default: false },
      paidDate: { type: Date },
      penalty: { type: Number, default: 0 }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Ensure admin is always in members array
groupSchema.pre('save', function(next) {
  if (!this.members.includes(this.admin)) {
    this.members.push(this.admin);
  }
  next();
});

// Virtual for available slots
groupSchema.virtual('availableSlots').get(function() {
  return this.totalSlots - this.members.length;
});

// Virtual for total group value
groupSchema.virtual('totalValue').get(function() {
  return this.monthlyAmount * this.totalSlots;
});

// Virtual for current month
groupSchema.virtual('currentMonth').get(function() {
  if (!this.isStarted || !this.startDate) return 0;
  const now = new Date();
  const start = new Date(this.startDate);
  const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(0, monthsDiff + 1);
});

module.exports = mongoose.model('Group', groupSchema); 