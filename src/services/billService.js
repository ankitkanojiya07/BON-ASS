const Bill = require('../models/Bill');
const User = require('../models/User');
const RewardService = require('./rewardService');

class BillService {
  static async createBill(userId, amount, dueDate) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const bill = new Bill({
        userId,
        amount,
        dueDate: new Date(dueDate)
      });

      return await bill.save();
    } catch (error) {
      throw new Error(`Error creating bill: ${error.message}`);
    }
  }

  static async payBill(billId, paymentDate) {
    try {
      const bill = await Bill.findById(billId);
      if (!bill) {
        throw new Error('Bill not found');
      }

      if (bill.status !== 'pending') {
        throw new Error('Bill has already been paid');
      }

      const paidOnTime = bill.pay(paymentDate);
      await bill.save();
      
      // After payment, check if user is eligible for reward
      const rewardCheck = await RewardService.checkEligibilityAndIssueReward(bill.userId);
      
      return {
        bill: bill,
        paidOnTime: paidOnTime,
        rewardCheck: rewardCheck
      };
    } catch (error) {
      throw new Error(`Error paying bill: ${error.message}`);
    }
  }

  static async getUserBills(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return await Bill.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching user bills: ${error.message}`);
    }
  }

  static async getBillById(billId) {
    try {
      return await Bill.findById(billId);
    } catch (error) {
      throw new Error(`Error fetching bill: ${error.message}`);
    }
  }
}

module.exports = BillService;