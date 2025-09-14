const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['amazon', 'starbucks', 'target', 'uber']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  isRedeemed: {
    type: Boolean,
    default: false
  },
  redeemedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Instance method to redeem the reward
rewardSchema.methods.redeem = function() {
  this.isRedeemed = true;
  this.redeemedAt = new Date();
};

module.exports = mongoose.model('Reward', rewardSchema);