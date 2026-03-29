const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const { ADMIN_EMAIL, ADMIN_PASSWORD, DEFAULT_BALANCE } = require('../config/constants');

class AuthService {
  static async register(email, password) {
    const existing = await User.findByEmail(email);
    if (existing) {
      throw new Error('المستخدم موجود بالفعل');
    }

    const hashed = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];
    const role = 'user';

    const user = await User.create({ email, username, password: hashed, role, balance: DEFAULT_BALANCE });
    const token = generateToken(user);

    return { token, user: { email, username, role, balance: DEFAULT_BALANCE } };
  }

  static async login(email, password) {
    let user = await User.findByEmail(email);

    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      const username = email.split('@')[0];
      const role = 'user';
      const balance = DEFAULT_BALANCE;

      user = await User.create({ email, username, password: hashed, role, balance });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('بيانات اعتماد غير صحيحة');
    }

    const token = generateToken(user);
    return { token, user: { username: user.username, email: user.email, role: user.role, balance: Number(user.balance) } };
  }

  static getUserProfile(user) {
    const { username, email, role, balance } = user;
    return { username, email, role, balance: Number(balance) };
  }
}

module.exports = AuthService;