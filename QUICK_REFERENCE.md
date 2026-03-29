# 🚀 Quick Reference Guide - المستشار AI

## Starting the Project

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start PostgreSQL
sudo service postgresql start

# 3. Install dependencies (first time only)
cd server && npm install && cd ..

# 4. Start server
cd server && npm start

# 5. Access at http://localhost:3000/client/index.html
```

## Default Credentials

```
Email: admin@almustasharai.com
Password: Admin@123456
```

---

## Project Architecture at a Glance

```
Frontend                  Backend                 Database
========                  =======                 ========

index.html ────────► botController ────────► users (10 credits)
  (Chat UI)             - getPersonas            - profile data
                        - askQuestion
templates.html            - uploadAndAsk         history
  (Templates)           - getHistory            - consultations
                          
user.html ────────► userController ────────► requests
  (Profile)            - getProfile             - payment requests
                        - updatePassword
owner.html ────────► adminController ────────► credit_transactions
  (Dashboard)           - getUsers              - audit trail
                        - getStats
                        - approval ops
```

---

## Key Files & Their Purpose

### Backend Services (Business Logic)

| File | Purpose | Key Functions |
|------|---------|---|
| `aiService.js` | AI responses | getPersonas(), generateResponse(), getMockResponse() |
| `creditService.js` | Credit management | getUserCredits(), deductCredits(), addCredits() |
| `fileService.js` | File handling | saveUploadedFile(), getFileContent() |
| `authService.js` | Authentication | hashPassword(), comparePassword() |
| `emailService.js` | Email sending | sendEmail(), sendNotification() |

### Backend Controllers (Request Handlers)

| File | Routes | Operations |
|------|--------|-----------|
| `botController.js` | /api/* | AI consultation endpoints |
| `authController.js` | /auth/* | Login, register, logout |
| `userController.js` | /user/* | Profile management |
| `adminController.js` | /admin/* | Dashboard operations |
| `requestController.js` | /requests/* | Payment requests |

### Frontend JavaScript (UI Logic)

| File | Lines | Purpose |
|------|-------|---------|
| `main.js` | 380 | Core utilities: modals, toasts, themes |
| `auth.js` | 100 | Login flow, role checking |
| `bot.js` | 80 | Consultation interface |
| `user.js` | 90 | Profile page, modals |
| `owner.js` | 100 | Admin dashboard functions |
| `downloads.js` | 150 | Template generation |
| `lang.js` | 80 | i18n system |

---

## API Endpoints Cheat Sheet

### Authentication
```
POST   /api/login           {email, password}
POST   /api/register        {email, username, password}
GET    /api/logout
```

### Bot Consultation
```
GET    /api/personas                  → Get all personas
POST   /api/ask                       {question, personaId}
POST   /api/upload-ask   [file+form]  {question, personaId}
GET    /api/history                   → Get consultation history
DELETE /api/history/:id
DELETE /api/history                   → Clear all
```

### User Profile
```
GET    /api/user/profile
PUT    /api/user/profile              {username, email}
PUT    /api/user/password             {oldPassword, newPassword}
DELETE /api/user/account
```

### Admin Only
```
GET    /api/admin/users               → All users table
GET    /api/admin/consultations       → All consultations
GET    /api/admin/requests            → Credit requests
GET    /api/admin/stats               → Dashboard stats
POST   /api/admin/credits/:userId     {amount, reason}
PUT    /api/admin/requests/:id        {action: approve/reject}
```

---

## AI Personas Reference

| ID | Name | Arabic | Specialty |
|----|------|--------|-----------|
| `lawyer` | المحامي | محامي متخصص | General legal consultation |
| `judge` | القاضي | قاضي | Dispute resolution |
| `legal_analyst` | محلل القانون | محلل قانوني | Document analysis |
| `quick_consultation` | Quick Consultation | استشارة سريعة | Quick answers |
| `smart_mediator` | الوسيط الذكي | وسيط ذكي | Mediation & compromise |
| `law_doctor` | دكتور القانون | دكتور قانون | Academic research |

All responses: 1 credit per consultation

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/legal_ai

# Security
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Password123

# AI
OPENAI_API_KEY=sk-...  # Optional

# Application
PORT=3000
NODE_ENV=development
DEFAULT_BALANCE=10  # Credits for new users

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

---

## Database Schema Quick Reference

### Users
```sql
id | email | username | password | role | balance | created_at
```

### History
```sql
id | user_id | question | response | persona | role | file_name | created_at
```

### Requests
```sql
id | user_id | amount | screenshot | status | created_at | updated_at
```

### Credit Transactions
```sql
id | user_id | type | amount | reason | created_at
```

---

## Common Tasks

### Add Admin User
```sql
INSERT INTO users (email, username, password, role, balance) 
VALUES ('admin@example.com', 'Admin', '$2b$10$...', 'admin', 999999);
```

### Reset User Credits
```sql
UPDATE users SET balance = 10 WHERE id = 1;
```

### View User History
```sql
SELECT * FROM history WHERE user_id = 1 ORDER BY created_at DESC;
```

### Export Transactions
```sql
SELECT * FROM credit_transactions WHERE type = 'deduct' ORDER BY created_at DESC;
```

---

## Frontend Component Usage

### Show Toast Notification
```javascript
showToast('پیام پیام', 'success');  // or 'error', 'warning', 'info'
```

### Show Modal Dialog
```javascript
showModal('modal-id');     // Show
closeModal('modal-id');    // Hide
```

### Make API Call
```javascript
const data = await apiCall('/api/endpoint', 'POST', {params});
```

### Upload File
```javascript
const file = await uploadFile(fileInput, '/api/upload');
```

### Switch Language
```javascript
loadLanguage('ar');  // or 'en'
```

### Toggle Dark Mode
```javascript
document.body.classList.toggle('dark-mode');
```

---

## File Upload Guide

### Supported Files
- Documents: PDF, DOC, DOCX, TXT
- Images: JPG, PNG, GIF, WebP
- Audio: MP3, WAV, M4A
- Max Size: 10 MB

### Upload Process
1. User selects file + enters question
2. File sent to `/api/upload-ask`
3. Saved in `/uploads` with timestamp
4. AI analyzes file content
5. Response returned with file reference
6. File accessible in history

---

## Deployment Checklist

- [ ] Change ADMIN_PASSWORD in .env
- [ ] Set unique JWT_SECRET
- [ ] Add OPENAI_API_KEY for production
- [ ] Set NODE_ENV=production
- [ ] Use production DATABASE_URL
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Configure backups
- [ ] Setup monitoring
- [ ] Enable rate limiting
- [ ] Setup logging
- [ ] Configure email service

---

## Troubleshooting Common Issues

### PostgreSQL Connection Failed
```bash
sudo service postgresql start
psql -U postgres -c "CREATE DATABASE legal_ai;"
```

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Module Not Found
```bash
cd server
npm install
npm list
```

### Authentication Failed
- Check JWT_SECRET in .env
- Verify token in localStorage
- Check Authorization header format

### File Upload Failed
- Check file size < 10MB
- Verify /uploads directory exists and writable
- Check file type supported

### API 404 Errors
- Verify botRoutes.js in routes/index.js
- Check all endpoints are mounted
- Review route definitions

---

## Development Tips

### Enable Debug Mode
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

### Mock API Responses
- Remove OPENAI_API_KEY from .env
- System will use mock responses
- Perfect for testing without API costs

### Check Database
```bash
psql -U postgres -d legal_ai -c "\dt"  # List tables
psql -U postgres -d legal_ai -c "\d users"  # Show schema
```

### Monitor Server Logs
```bash
cd server
npm start  # Shows all logs in terminal
```

### Reset Database
```bash
psql -U postgres -c "DROP DATABASE legal_ai;"
# Then restart server - will auto-create fresh schema
```

---

## Feature Permissions

### User Permissions
- ✅ Ask questions via 6 personas
- ✅ Upload files with questions
- ✅ View own consultation history
- ✅ Download legal templates
- ✅ Edit own profile
- ✅ Request credits
- ❌ Access admin dashboard
- ❌ View other users
- ❌ Approve credit requests

### Admin Permissions
- ✅ All user permissions
- ✅ Access admin dashboard
- ✅ View all users
- ✅ View all consultations
- ✅ Approve credit requests
- ✅ Add credits to users
- ✅ View transactions
- ✅ System statistics

---

## Performance Optimization Tips

1. **Compress responses** - Enable gzip in Express
2. **Cache static files** - Set cache headers for CSS/JS
3. **Database indexing** - Add indexes on user_id, status
4. **Connection pooling** - Already configured in pg
5. **CDN for assets** - Host CSS/JS on CDN
6. **Image optimization** - Compress/resize uploads
7. **API pagination** - Add limit/offset to queries

---

## Security Best Practices

✅ **Already Implemented:**
- bcrypt password hashing
- JWT token authentication
- CORS configuration
- File upload validation
- Environment variables

🔒 **Recommended for Production:**
- HTTPS/TLS everywhere
- Rate limiting
- CSRF protection
- SQL injection prevention
- XSS prevention
- Regular security audits

---

## Next Features to Add

1. **Payment Integration** - Stripe/PayPal
2. **Email Notifications** - User alerts
3. **Advanced Analytics** - User behavior tracking
4. **Document Export** - Generate reports
5. **Consultation Booking** - Schedule with lawyers
6. **Collaboration Tools** - Share consultations
7. **Mobile App** - React Native/Flutter
8. **API Keys** - For external integrations
9. **Webhooks** - For third-party apps
10. **Multi-language** - Add French, German, etc.

---

## Resources

- **Express Docs:** https://expressjs.com/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **OpenAI API:** https://platform.openai.com/docs/
- **JWT Guide:** https://jwt.io/
- **MDN Web Docs:** https://developer.mozilla.org/

---

**Quick Start Time:** 5 minutes  
**First Consultation:** 30 seconds  
**Deploy to Production:** 1 hour  

**Ready to scale! 🚀**
