const express = require('express');
const BillService = require('../services/billService');

const router = express.Router();

// Pay a bill
router.post('/:id/pay', async (req, res) => {
  try {
    const { paymentDate } = req.body;
    const paymentDateObj = paymentDate ? new Date(paymentDate) : new Date();
    
    const result = await BillService.payBill(req.params.id, paymentDateObj);
    
    let message = `Bill paid ${result.paidOnTime ? 'on time' : 'late'}`;
    
    if (result.rewardCheck.eligible && result.rewardCheck.reward) {
      message += `. Congratulations! You earned a ${result.rewardCheck.reward.description}!`;
    } else if (!result.rewardCheck.eligible) {
      message += `. ${result.rewardCheck.reason}`;
    }
    
    res.json({
      message: message,
      bill: result.bill,
      paidOnTime: result.paidOnTime,
      rewardEarned: result.rewardCheck.eligible,
      reward: result.rewardCheck.reward || null,
      eligibilityStatus: {
        billsOnTime: result.rewardCheck.billsOnTime,
        totalBills: result.rewardCheck.totalBills,
        reason: result.rewardCheck.reason
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Get bill details
router.get('/:id', async (req, res) => {
  try {
    const bill = await BillService.getBillById(req.params.id);
    
    if (!bill) {
      return res.status(404).json({
        error: 'Bill not found'
      });
    }
    
    res.json({
      bill: bill
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;