const cron = require('node-cron');
const Transaction = require('../models/transaction.model');

const startCronJobs = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running recurring transactions check...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const nextDay = new Date(today);
            nextDay.setDate(nextDay.getDate() + 1);

            // Find all active transactions where recurrence is set and nextDueDate is today or earlier
            const recurringTxs = await Transaction.find({
                status: 'active',
                recurrence: { $ne: 'none' },
                nextDueDate: { $lte: nextDay }
            });

            if (recurringTxs.length === 0) {
                console.log('No recurring transactions due today.');
                return;
            }

            console.log(`Found ${recurringTxs.length} recurring transactions to process.`);

            for (const tx of recurringTxs) {
                // Duplicate the transaction
                const newTxData = {
                    user: tx.user,
                    amount: tx.amount,
                    type: tx.type,
                    category: tx.category,
                    note: `[Auto-Generated] ${tx.note}`,
                    customerName: tx.customerName,
                    customerPhone: tx.customerPhone,
                    status: 'pending', // Pending verification from user
                    recurrence: 'none', // The duplicate itself shouldn't recur
                    nextDueDate: null,
                    createdAt: new Date()
                };

                await Transaction.create(newTxData);

                // Calculate next due date for the original transaction
                const nextDate = new Date(tx.nextDueDate || new Date());
                if (tx.recurrence === 'daily') {
                    nextDate.setDate(nextDate.getDate() + 1);
                } else if (tx.recurrence === 'weekly') {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (tx.recurrence === 'monthly') {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }

                tx.nextDueDate = nextDate;
                await tx.save();
                
                console.log(`Processed recurring tx ${tx._id} for user ${tx.user}. Next due: ${nextDate}`);
            }
        } catch (error) {
            console.error('Error in recurring transactions cron job:', error);
        }
    });
};

module.exports = { startCronJobs };
