// Groove App - Backend Server for SMS Integration
// This server handles activation code SMS sending using Twilio

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve static files from parent directory

// Twilio Configuration
// Get these from https://www.twilio.com/console
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid_here';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token_here';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

// Initialize Twilio client
let twilioClient = null;
try {
    if (TWILIO_ACCOUNT_SID !== 'your_account_sid_here') {
        twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        console.log('✅ Twilio client initialized');
    } else {
        console.log('⚠️  Twilio credentials not configured - running in demo mode');
    }
} catch (error) {
    console.error('❌ Twilio initialization failed:', error.message);
}

// Store active codes (in production, use a database)
const activeCodes = new Map();

// API Endpoint: Send Activation Code
app.post('/api/send-activation-code', async (req, res) => {
    try {
        const { phone, code } = req.body;
        
        // Validate input
        if (!phone || !code) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone number and code are required' 
            });
        }
        
        // Store code with expiration (10 minutes)
        activeCodes.set(phone, {
            code: code,
            expiresAt: Date.now() + (10 * 60 * 1000),
            createdAt: Date.now()
        });
        
        // Send SMS via Twilio
        if (twilioClient) {
            const message = await twilioClient.messages.create({
                body: `Your Groove App activation code is: ${code}. Valid for 10 minutes.`,
                from: TWILIO_PHONE_NUMBER,
                to: phone
            });
            
            console.log(`📱 SMS sent to ${phone}: ${message.sid}`);
            
            return res.json({ 
                success: true, 
                message: 'Activation code sent successfully',
                messageSid: message.sid
            });
        } else {
            // Demo mode - code stored but no SMS sent
            console.log(`📝 Demo mode - Code for ${phone}: ${code}`);
            
            return res.json({ 
                success: true, 
                demo: true,
                message: 'Running in demo mode - code stored but not sent via SMS',
                code: code // In production, don't return the code
            });
        }
        
    } catch (error) {
        console.error('❌ SMS sending error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to send SMS',
            details: error.message 
        });
    }
});

// API Endpoint: Verify Code
app.post('/api/verify-code', (req, res) => {
    try {
        const { phone, code } = req.body;
        
        if (!phone || !code) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone number and code are required' 
            });
        }
        
        const storedData = activeCodes.get(phone);
        
        if (!storedData) {
            return res.status(404).json({ 
                success: false, 
                error: 'No code found for this phone number' 
            });
        }
        
        // Check expiration
        if (Date.now() > storedData.expiresAt) {
            activeCodes.delete(phone);
            return res.status(400).json({ 
                success: false, 
                error: 'Code has expired. Please generate a new one.' 
            });
        }
        
        // Verify code
        if (storedData.code === code) {
            activeCodes.delete(phone); // Remove used code
            return res.json({ 
                success: true, 
                message: 'Code verified successfully' 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid code' 
            });
        }
        
    } catch (error) {
        console.error('❌ Verification error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Verification failed',
            details: error.message 
        });
    }
});

// API Endpoint: Check Payment Status (placeholder)
app.post('/api/check-payment', async (req, res) => {
    try {
        const { phone, transactionId } = req.body;
        
        // TODO: Implement actual payment verification
        // - For Zelle: Check with bank API or manual verification
        // - For MTN: Use MTN Mobile Money API
        
        console.log(`💰 Payment check requested for ${phone}, transaction: ${transactionId}`);
        
        // Placeholder response
        return res.json({ 
            success: true, 
            verified: false,
            message: 'Payment verification requires manual approval' 
        });
        
    } catch (error) {
        console.error('❌ Payment check error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Payment check failed' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        twilioConfigured: twilioClient !== null,
        timestamp: new Date().toISOString() 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Groove App Backend Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`💡 Twilio: ${twilioClient ? 'Configured' : 'Demo Mode'}`);
    console.log(`\n📱 API Endpoints:`);
    console.log(`   POST /api/send-activation-code`);
    console.log(`   POST /api/verify-code`);
    console.log(`   POST /api/check-payment`);
    console.log(`   GET  /api/health\n`);
});

// Cleanup expired codes every 5 minutes
setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [phone, data] of activeCodes.entries()) {
        if (now > data.expiresAt) {
            activeCodes.delete(phone);
            cleaned++;
        }
    }
    
    if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired codes`);
    }
}, 5 * 60 * 1000);
