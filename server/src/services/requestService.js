const Request = require('../models/request');
const UserService = require('./userService');
const EmailService = require('./emailService');

class RequestService {
  static async createRequest(username, amount, screenshotPath) {
    if (!amount || Number(amount) <= 0) {
      throw new Error('المبلغ غير صالح');
    }

    const request = await Request.create({ username, amount: Number(amount), screenshotPath });

    // Send email notification to admin
    const pendingCount = await Request.getPendingCount();
    await EmailService.sendAdminNotification(
      'طلب شحن جديد - المستشار AI',
      `تم استلام طلب شحن جديد من ${username} بمبلغ ${amount}.\nعدد الطلبات المعلقة: ${pendingCount}\nرابط الإدارة: http://localhost:3000/admin`
    );

    return request;
  }

  static async getRequests(user) {
    if (user.role === 'admin') {
      return await Request.findAll();
    }
    return await Request.findByUsername(user.username);
  }

  static async acceptRequest(id) {
    const request = await Request.findById(id);
    if (!request) throw new Error('طلب غير موجود');
    if (request.status !== 'pending') throw new Error('هذا الطلب تمت معالجته بالفعل');

    await Request.updateStatus(id, 'accepted');
    await UserService.addBalance(request.username, request.amount);

    // Notify user via email if email service is set up
    // For now, just log
    console.log(`Request ${id} accepted for ${request.username}`);
  }

  static async rejectRequest(id) {
    const request = await Request.findById(id);
    if (!request) throw new Error('طلب غير موجود');
    if (request.status !== 'pending') throw new Error('هذا الطلب تمت معالجته بالفعل');

    await Request.updateStatus(id, 'rejected');

    console.log(`Request ${id} rejected for ${request.username}`);
  }
}

module.exports = RequestService;