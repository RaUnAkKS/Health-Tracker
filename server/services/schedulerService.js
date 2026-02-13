const cron = require('node-cron');
const User = require('../models/User');
const { sendStreakReminder } = require('./emailService');

const initScheduler = () => {
    console.log('[Scheduler] Initializing automated tasks...');

    /**
     * STREAK REMINDER JOB
     * Runs every hour at the top of the hour
     * Checks for users where it is currently ~8:00 PM (20:00) in their timezone
     */
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('[Scheduler] Running hourly streak check...');

            // Get current UTC hour
            const utcDate = new Date();
            const utcHour = utcDate.getUTCHours();

            // We want to target users where local time is 20:00 (8 PM)
            // Local = UTC + Offset
            // 20 = (UTC + Offset) % 24
            // Offset = 20 - UTC

            // NOTE: Simplification for prototype. 
            // In production, we should store timezone strings (e.g., 'America/New_York') 
            // and use a library like 'moment-timezone' to query accurately.
            // For now, we'll iterate qualifying users and check their calculated local time.

            const users = await User.find({
                'emailVerification.isVerified': true,
                'gamification.currentStreak': { $gte: 1 },
                'gamification.reminderSentToday': false,
                'settings.timezone': { $exists: true }
            });

            console.log(`[Scheduler] Found ${users.length} potential users for reminders.`);

            let sentCount = 0;

            for (const user of users) {
                // Determine user's local time
                // Assuming settings.timezone is a valid IANA string (e.g. 'Asia/Kolkata')
                // If defaults to 'UTC', it processes at 20:00 UTC.

                try {
                    const userTimezone = user.settings.timezone || 'UTC';

                    // Get current time in user's timezone
                    const userTimeStr = new Date().toLocaleString('en-US', {
                        timeZone: userTimezone,
                        hour: 'numeric',
                        hour12: false
                    });

                    const userHour = parseInt(userTimeStr);

                    // If it's 8 PM (20) in user's time
                    if (userHour === 20) {
                        // Check if they logged TODAY in their timezone
                        const lastLog = user.gamification.lastLogDate;
                        let loggedToday = false;

                        if (lastLog) {
                            const lastLogLocal = new Date(lastLog).toLocaleDateString('en-US', { timeZone: userTimezone });
                            const todayLocal = new Date().toLocaleDateString('en-US', { timeZone: userTimezone });
                            if (lastLogLocal === todayLocal) {
                                loggedToday = true;
                            }
                        }

                        if (!loggedToday) {
                            // SEND REMINDER
                            await sendStreakReminder(user);

                            // Update user flag
                            user.gamification.reminderSentToday = true;
                            await user.save();
                            sentCount++;
                        }
                    }
                } catch (err) {
                    console.error(`[Scheduler] Error processing user ${user.email}:`, err.message);
                }
            }

            if (sentCount > 0) {
                console.log(`[Scheduler] Sent ${sentCount} streak reminders.`);
            }

        } catch (error) {
            console.error('[Scheduler] Error in streak reminder job:', error);
        }
    });

    /**
     * MIDNIGHT RESET JOB
     * Runs every hour
     * Resets reminderSentToday for users where it is midnight (00:00)
     */
    cron.schedule('0 * * * *', async () => {
        try {
            // Find users who have the flag set
            const users = await User.find({
                'gamification.reminderSentToday': true
            });

            for (const user of users) {
                const userTimezone = user.settings.timezone || 'UTC';
                const userDate = new Date();
                const userHourStr = userDate.toLocaleString('en-US', {
                    timeZone: userTimezone,
                    hour: 'numeric',
                    hour12: false
                });
                const userHour = parseInt(userHourStr);

                // If it's midnight (00), reset the flag
                // We check 00 to be safe
                if (userHour === 0) {
                    user.gamification.reminderSentToday = false;
                    await user.save();
                    console.log(`[Scheduler] Reset reminder flag for ${user.email}`);
                }
            }
        } catch (error) {
            console.error('[Scheduler] Error in reset job:', error);
        }
    });
};

module.exports = { initScheduler };
