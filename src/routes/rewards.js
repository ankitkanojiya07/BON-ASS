const express = require('express');
const RewardService = require('../services/rewardService');

const router = express.Router();

// Redeem a reward
router.post('/:id/redeem', async (req, res) => {
  try {
    const reward = await RewardService.redeemReward(req.params.id);
    
    res.json({
      message: 'Reward redeemed successfully',
      reward: reward
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router;