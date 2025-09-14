const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'paid_on_time', 'paid_late', 'overdue'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Instance method to pay the bill
billSchema.methods.pay = function(paymentDate = new Date()) {
  this.paymentDate = paymentDate;
  this.status = paymentDate <= this.dueDate ? 'paid_on_time' : 'paid_late';
  return this.status === 'paid_on_time';
};

// Instance method to mark as overdue
billSchema.methods.markOverdue = function() {
  if (this.status === 'pending' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
};

module.exports = mongoose.model('Bill', billSchema);