const User = require('../models/user');

class UserService {
  static async deductBalance(userId, amount) {
    const user = await User.findById(userId);
    if (!user) throw new Error('المستخدم غير موجود');

    const newBalance = Number(user.balance) - amount;
    if (newBalance < 0) throw new Error('رصيد غير كافٍ');

    await User.updateBalance(userId, newBalance);
    return newBalance;
  }

  static async addBalance(username, amount) {
    await User.addBalance(username, amount);
  }

  static canAsk(user) {
    return user.role === 'admin' || Number(user.balance) > 0;
  }
}

module.exports = UserService;