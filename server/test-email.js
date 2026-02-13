const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing email configuration...');
    console.log(`User: ${process.env.EMAIL_USER}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('❌ Missing EMAIL_USER or EMAIL_PASSWORD in .env');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ SMTP Connection Successful!');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'SpikeIQ Email Test 🚀',
            text: 'If you see this, your email configuration works perfectly!',
        };

        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test Email Sent!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email Verification Failed:', error);
    }
};

testEmail();
