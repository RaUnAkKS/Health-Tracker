const cron = require('node-cron');
const User = require('../models/User');
const { sendStreakReminder } = require('../services/emailService');
const { hasLoggedToday } = require('../services/streakService');

/**
 * Daily Reminder Cron Job
 * Runs every day at 7 PM (19:00)
 * Sends streak reminder emails to users who haven't logged today
 */

const startDailyReminderCron = () => {
    // Schedule: Run at 7 PM every day (19:00)
    // Format: minute hour day month weekday
    const schedule = '0 19 * * *'; // 0 minutes, 19 hours (7 PM), every day

    cron.schedule(schedule, async () => {
        console.log('[Cron] Daily reminder job started at', new Date().toLocaleString());

        try {
            // Find all users with verified emails
            const users = await User.find({
                'emailVerification.isVerified': true,
                email: { $exists: true, $ne: null },
            });

            console.log(`[Cron] Found ${users.length} users with verified emails`);

            let remindersSent = 0;
            let remindersSkipped = 0;

            for (const user of users) {
                try {
                    // Check if user has logged today
                    const loggedToday = hasLoggedToday(user);

                    if (!loggedToday) {
                        // Send reminder
                        const result = await sendStreakReminder(user);

                        if (result.success) {
                            remindersSent++;
                            console.log(`[Cron] Reminder sent to ${user.email}`);
                        } else {
                            console.log(`[Cron] Skipped ${user.email}: ${result.reason}`);
                            remindersSkipped++;
                        }
                    } else {
                        remindersSkipped++;
                    }
                } catch (userError) {
                    console.error(`[Cron] Error processing user ${user._id}:`, userError);
                }
            }

            console.log(`[Cron] Daily reminder job completed:`, {
                totalUsers: users.length,
                remindersSent,
                remindersSkipped,
                time: new Date().toLocaleString(),
            });
        } catch (error) {
            console.error('[Cron] Daily reminder job failed:', error);
        }
    });

    console.log('[Cron] Daily reminder job scheduled for 7 PM every day');
};

module.exports = { startDailyReminderCron };
