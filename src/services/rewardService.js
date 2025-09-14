const Reward = require('../models/Reward');
const Bill = require('../models/Bill');

class RewardService {
  static REWARD_TYPES = [
    { type: 'amazon', amount: 10, description: '$10 Amazon Gift Card' },
    { type: 'starbucks', amount: 5, description: '$5 Starbucks Gift Card' },
    { type: 'target', amount: 15, description: '$15 Target Gift Card' },
    { type: 'uber', amount: 10, description: '$10 Uber Gift Card' }
  ];

  static async checkEligibilityAndIssueReward(userId) {
    try {
      // Get last 3 bills for the user, sorted by creation date (newest first)
      const lastThreeBills = await Bill.find({ userId })
        .sort({ createdAt: -1 })
        .limit(3);
      
      // User needs at least 3 bills to be eligible
      if (lastThreeBills.length < 3) {
        return {
          eligible: false,
          reason: 'User needs at least 3 bills to be eligible for rewards',
          billsOnTime: lastThreeBills.filter(bill => bill.status === 'paid_on_time').length,
          totalBills: lastThreeBills.length
        };
      }

      // Check if all last 3 bills were paid on time
      const allPaidOnTime = lastThreeBills.every(bill => bill.status === 'paid_on_time');

      if (!allPaidOnTime) {
        const onTimeBills = lastThreeBills.filter(bill => bill.status === 'paid_on_time').length;
        return {
          eligible: false,
          reason: `Only ${onTimeBills} of last 3 bills were paid on time`,
          billsOnTime: onTimeBills,
          totalBills: 3
        };
      }

      // User is eligible! Issue a reward
      const rewardType = this.REWARD_TYPES[Math.floor(Math.random() * this.REWARD_TYPES.length)];
      const reward = new Reward({
        userId,
        type: rewardType.type,
        amount: rewardType.amount,
        description: rewardType.description
      });

      await reward.save();

      return {
        eligible: true,
        reason: 'Congratulations! Last 3 bills paid on time',
        reward: reward,
        billsOnTime: 3,
        totalBills: 3
      };
    } catch (error) {
      throw new Error(`Error checking reward eligibility: ${error.message}`);
    }
  }

  static async getUserRewards(userId) {
    try {
      return await Reward.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching user rewards: ${error.message}`);
    }
  }

  static async redeemReward(rewardId) {
    try {
      const reward = await Reward.findById(rewardId);
      if (!reward) {
        throw new Error('Reward not found');
      }
      if (reward.isRedeemed) {
        throw new Error('Reward already redeemed');
      }
      
      reward.redeem();
      await reward.save();
      return reward;
    } catch (error) {
      throw new Error(`Error redeeming reward: ${error.message}`);
    }
  }
}

module.exports = RewardService;