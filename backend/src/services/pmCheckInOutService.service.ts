export const pmCheckInOutService = {
    async heartbeat(pmId: any, user_id: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `UPDATE pm
                SET last_activity_at = NOW()
                WHERE id = $1
                AND user_id = $2
                AND status = 'checkin'
                RETURNING id`;
            const values = [
                pmId,
                user_id
            ];

            const res = await db.query(sql, values);

            return {
                success: true
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async checkIn(pmId: any, user_id: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `UPDATE pm
                SET status = 'checkin',
                    checkin_time = NOW(),
                    last_activity_at = NOW()
                WHERE id = $1
                AND user_id = $2;
                `;
            const values = [
                pmId,
                user_id
            ];

            const res = await db.query(sql, values);

            return {
                success: true
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async checkOut(pmId: any, user_id: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `UPDATE pm
                SET status = 'checkout',
                    checkout_time = NOW()
                WHERE id = $1
                AND user_id = $2
                AND status = 'checkin';
                `;
            const values = [
                pmId,
                user_id
            ];

            const res = await db.query(sql, values);

            return {
                success: true
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },
}