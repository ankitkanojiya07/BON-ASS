const express = require('express');
const User = require('../models/User');
const BillService = require('../services/billService');
const RewardService = require('../services/rewardService');

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    const user = new User({ name, email });
    const createdUser = await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      user: createdUser
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
});

// Get user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    const bills = await BillService.getUserBills(req.params.id);
    const rewards = await RewardService.getUserRewards(req.params.id);
    
    res.json({
      user: user,
      stats: {
        totalBills: bills.length,
        paidOnTimeBills: bills.filter(bill => bill.status === 'paid_on_time').length,
        totalRewards: rewards.length,
        unredeemedRewards: rewards.filter(reward => !reward.isRedeemed).length
      },
      bills: bills,
      rewards: rewards
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Create a bill for user
router.post('/:id/bills', async (req, res) => {
  try {
    const { amount, dueDate } = req.body;
    
    if (!amount || !dueDate) {
      return res.status(400).json({
        error: 'Amount and due date are required'
      });
    }

    const bill = await BillService.createBill(req.params.id, amount, dueDate);
    
    res.status(201).json({
      message: 'Bill created successfully',
      bill: bill
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get user's bills
router.get('/:id/bills', async (req, res) => {
  try {
    const bills = await BillService.getUserBills(req.params.id);
    
    res.json({
      bills: bills,
      summary: {
        total: bills.length,
        pending: bills.filter(bill => bill.status === 'pending').length,
        paidOnTime: bills.filter(bill => bill.status === 'paid_on_time').length,
        paidLate: bills.filter(bill => bill.status === 'paid_late').length,
        overdue: bills.filter(bill => bill.status === 'overdue').length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get user's rewards
router.get('/:id/rewards', async (req, res) => {
  try {
    const rewards = await RewardService.getUserRewards(req.params.id);
    
    res.json({
      rewards: rewards,
      summary: {
        total: rewards.length,
        unredeemed: rewards.filter(reward => !reward.isRedeemed).length,
        totalValue: rewards.reduce((sum, reward) => sum + reward.amount, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Check reward eligibility
router.get('/:id/check-eligibility', async (req, res) => {
  try {
    const rewardCheck = await RewardService.checkEligibilityAndIssueReward(req.params.id);
    
    res.json({
      eligibilityCheck: rewardCheck
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;