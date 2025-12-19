# Groove App Backend - SMS Integration Setup Guide

## 🎯 Overview
This backend server enables automatic SMS sending for activation codes using Twilio.

## 📋 Prerequisites
- Node.js (v14 or higher)
- Twilio account (free trial available)
- Payment of $4/month verified

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Twilio

#### Get Twilio Credentials:
1. Sign up at https://www.twilio.com/try-twilio
2. Get your **Account SID** and **Auth Token** from the console
3. Get a **Twilio Phone Number** (free with trial)

#### Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
```

### 3. Start the Server
```bash
npm start
```

Or with auto-restart:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

## 📱 How It Works

### Flow:
1. **User enters phone number** → Frontend
2. **Clicks "Generate Code"** → Generates 4-digit code
3. **Sends request** → `POST /api/send-activation-code`
4. **Backend sends SMS** → Via Twilio API
5. **User receives code** → Via SMS
6. **User enters code** → Frontend validates
7. **Subscription activated** → Full app access

### API Endpoints:

#### Send Activation Code
```http
POST /api/send-activation-code
Content-Type: application/json

{
  "phone": "+1234567890",
  "code": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Activation code sent successfully",
  "messageSid": "SM..."
}
```

#### Verify Code
```http
POST /api/verify-code
Content-Type: application/json

{
  "phone": "+1234567890",
  "code": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Code verified successfully"
}
```

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "twilioConfigured": true,
  "timestamp": "2025-12-18T..."
}
```

## 🔒 Security Considerations

### Production Checklist:
- [ ] Use HTTPS in production
- [ ] Add rate limiting (prevent spam)
- [ ] Implement CAPTCHA
- [ ] Validate phone numbers (regex)
- [ ] Store codes in Redis (not memory)
- [ ] Add authentication (API keys)
- [ ] Log all requests
- [ ] Monitor SMS costs

### Rate Limiting Example:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3 // 3 requests per window
});

app.post('/api/send-activation-code', limiter, async (req, res) => {
  // ... code
});
```

## 💰 Costs

### Twilio Pricing (US):
- **SMS Outbound**: $0.0079 per message
- **100 users/month**: ~$0.79
- **1,000 users/month**: ~$7.90

### Free Trial:
- $15.50 credit
- ~1,962 messages
- Test thoroughly before going live

## 🌍 International SMS

### Ghana (MTN):
```javascript
// In server.js
const message = await twilioClient.messages.create({
  body: `Your Groove App activation code is: ${code}`,
  from: TWILIO_PHONE_NUMBER,
  to: '+233244848036' // Ghana format
});
```

**Note:** International SMS costs more (~$0.04-0.10 per message)

## 🔄 Alternative: WhatsApp

Twilio also supports WhatsApp (often cheaper):

```javascript
const message = await twilioClient.messages.create({
  body: `Your Groove App code: ${code}`,
  from: 'whatsapp:+14155238886', // Twilio WhatsApp number
  to: 'whatsapp:+1234567890'
});
```

## 🐛 Demo Mode

If Twilio not configured, server runs in **demo mode**:
- Codes stored in memory
- No SMS sent
- Code returned in API response (for testing)
- Perfect for development

## 📊 Monitoring

### Check logs:
```bash
tail -f logs/sms.log
```

### Monitor Twilio:
- Visit https://www.twilio.com/console/sms/logs
- See all sent messages, delivery status, costs

## 🚀 Deployment Options

### 1. Heroku (Free Tier)
```bash
heroku create groove-app-backend
git push heroku main
heroku config:set TWILIO_ACCOUNT_SID=AC...
```

### 2. Vercel (Serverless)
- Add `vercel.json` configuration
- Deploy: `vercel --prod`

### 3. VPS (DigitalOcean, AWS, etc.)
- Install Node.js
- Use PM2 for process management
- Setup nginx reverse proxy

## 🔗 Connect Frontend

Update subscription.html API URL:
```javascript
const response = await fetch('https://your-backend.com/api/send-activation-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: phone, code: code })
});
```

## 📝 Testing

### Test with cURL:
```bash
# Send code
curl -X POST http://localhost:3000/api/send-activation-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","code":"1234"}'

# Verify code
curl -X POST http://localhost:3000/api/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","code":"1234"}'
```

## 🛠️ Troubleshooting

### SMS not sending?
1. Check Twilio credentials
2. Verify phone number format (+1...)
3. Check Twilio account balance
4. Review Twilio console logs

### Code expired?
- Codes expire after 10 minutes
- Generate a new code

### Invalid phone number?
- Must be E.164 format: +[country][number]
- Example: +1234567890 (US), +233244848036 (Ghana)

## 📞 Support

For issues:
1. Check server logs
2. Review Twilio console
3. Test in demo mode first
4. Contact: support@grooveapp.com

---

**Created by FAMYANK** | Last Updated: December 18, 2025
