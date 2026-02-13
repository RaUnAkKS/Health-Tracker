const nodemailer = require('nodemailer');

/**
 * Email Service - Handles all email sending
 * Uses Nodemailer with Gmail SMTP
 */

// Create transporter (reusable)
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

/**
 * Send OTP verification email
 */
const sendOTPEmail = async (email, otp, userName = 'there') => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `Health Tracker <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - Health Tracker',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; padding: 20px 0; }
                        .otp-box { background: #f0f7ff; border: 2px solid #4F46E5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 4px; }
                        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>🍬 Health Tracker</h2>
                        </div>
                        
                        <p>Hey ${userName},</p>
                        
                        <p>Welcome to Health Tracker! To complete your account setup, please verify your email address.</p>
                        
                        <div class="otp-box">
                            <p>Your verification code:</p>
                            <div class="otp-code">${otp}</div>
                            <p style="margin-top: 10px; color: #666; font-size: 14px;">This code expires in 10 minutes</p>
                        </div>
                        
                        <p>Enter this code in the app to verify your email and unlock:</p>
                        <ul>
                            <li>✨ Daily streak reminders</li>
                            <li>🎯 Milestone celebrations</li>
                            <li>📊 Personalized insights via email</li>
                        </ul>
                        
                        <p>If you didn't request this, you can safely ignore this email.</p>
                        
                        <div class="footer">
                            <p>Health Tracker - Your Sugar Awareness Companion</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Email] OTP sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('[Email] OTP send failed:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send daily streak reminder (8 PM)
 */
const sendStreakReminder = async (user) => {
    try {
        if (!user.emailVerification?.isVerified) {
            console.log(`[Email] Skipping reminder for ${user.email} - not verified`);
            return { success: false, reason: 'email_not_verified' };
        }

        const transporter = createTransporter();
        const streak = user.gamification?.currentStreak || 0;
        const userName = user.email.split('@')[0];

        // Subject Logic
        let subject = `Don’t lose your streak 🔥`;
        if (streak >= 30) subject = `You’ve Built Something Strong. Protect It.`;
        else if (streak >= 7) subject = `Your ${streak}-Day Streak Is At Risk`;

        const mailOptions = {
            from: `SpikeIQ <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: subject,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .card { background: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; border: 1px solid #f3f4f6; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: white; }
                        .content { padding: 30px; text-align: center; }
                        .streak-number { font-size: 48px; font-weight: 800; color: #059669; line-height: 1; margin: 20px 0 10px; }
                        .btn { display: inline-block; background: #10b981; color: white; padding: 14px 32px; font-weight: 600; text-decoration: none; border-radius: 99px; margin-top: 24px; box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39); }
                        .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; }
                    </style>
                </head>
                <body style="background-color: #f9fafb;">
                    <div class="container">
                        <div class="card">
                            <div class="header">
                                <h2 style="margin: 0; font-size: 24px;">SpikeIQ</h2>
                            </div>
                            
                            <div class="content">
                                <p style="font-size: 18px; margin-bottom: 0;">Hi ${userName},</p>
                                
                                <p style="color: #4b5563;">You’re on a</p>
                                <div class="streak-number">${streak}-day streak</div>
                                <p style="color: #4b5563; font-weight: 500;">Log your intake today to keep your momentum alive.</p>
                                
                                <p style="color: #6b7280; font-size: 15px;">One quick entry protects your progress.</p>
                                
                                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="btn">
                                    Log Now
                                </a>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>You received this because you're tracking your health with SpikeIQ.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Email] Streak reminder sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('[Email] Streak reminder failed:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send milestone celebration email
 */
const sendMilestoneEmail = async (user, milestone) => {
    try {
        if (!user.emailVerification?.isVerified) {
            return { success: false, reason: 'email_not_verified' };
        }

        const transporter = createTransporter();
        const userName = user.email.split('@')[0];

        const milestoneMessages = {
            3: {
                emoji: '🔥',
                title: '3-Day Milestone!',
                message: 'Your discipline is building.',
            },
            7: {
                emoji: '💪',
                title: '7-Day Milestone!',
                message: 'Your body is thanking you.',
            },
            30: {
                emoji: '🎉',
                title: '30-Day Milestone!',
                message: 'You\'re officially sugar-aware.',
            },
        };

        const milestoneData = milestoneMessages[milestone] || milestoneMessages[3];

        const mailOptions = {
            from: `Health Tracker <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `${milestoneData.emoji} ${milestone}-Day Milestone Achieved!`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; padding: 20px 0; }
                        .celebration { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 12px; padding: 40px; text-align: center; margin: 20px 0; }
                        .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>🍬 Health Tracker</h2>
                        </div>
                        
                        <div class="celebration">
                            <h1 style="font-size: 64px; margin: 0;">${milestoneData.emoji}</h1>
                            <h2 style="margin: 20px 0; font-size: 32px;">${milestone} Days!</h2>
                            <p style="font-size: 18px; opacity: 0.95;">${milestoneData.message}</p>
                        </div>
                        
                        <p>Hey ${userName},</p>
                        
                        <p>You just hit <strong>${milestone} days</strong> in a row!</p>
                        
                        <p>That's:</p>
                        <ul>
                            <li>${milestone} days of mindful sugar tracking</li>
                            <li>${milestone} days of building better habits</li>
                            <li>${milestone} days of taking control</li>
                        </ul>
                        
                        <p><strong>Keep going — you're building something real.</strong></p>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">
                                See Your Progress
                            </a>
                        </div>
                        
                        <div class="footer">
                            <p>Proud of you! 💚</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Email] Milestone email sent to ${user.email} for ${milestone} days`);
        return { success: true };
    } catch (error) {
        console.error('[Email] Milestone email failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendStreakReminder,
    sendMilestoneEmail,
};
