import cron from 'node-cron';
import pool from './db.js';

cron.schedule('*/5 * * * *', async () => {
    console.log('Running auto timeout check...');

    await pool.query(`
    UPDATE pm
    SET status = 'checkout',
        auto_checkout = true
    WHERE status = 'checkin'
    AND last_activity_at < NOW() - INTERVAL '15 minutes'
  `);

});
