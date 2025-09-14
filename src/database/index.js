// In-memory database simulation
class Database {
  constructor() {
    this.users = [];
    this.bills = [];
    this.rewards = [];
  }

  // User operations
  createUser(user) {
    this.users.push(user);
    return user;
  }

  findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  // Bill operations
  createBill(bill) {
    this.bills.push(bill);
    return bill;
  }

  findBillById(id) {
    return this.bills.find(bill => bill.id === id);
  }

  findBillsByUserId(userId) {
    return this.bills
      .filter(bill => bill.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Reward operations
  createReward(reward) {
    this.rewards.push(reward);
    return reward;
  }

  findRewardsByUserId(userId) {
    return this.rewards
      .filter(reward => reward.userId === userId)
      .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
  }

  // Helper method to get last N bills for a user
  getLastNBillsForUser(userId, n = 3) {
    return this.findBillsByUserId(userId).slice(0, n);
  }
}

// Singleton instance
const db = new Database();

module.exports = db;