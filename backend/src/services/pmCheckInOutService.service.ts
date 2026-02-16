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

    async checkIn(pmId: number, user_id: number, db: any) {
        const client = await db.connect();

        try {
            const sql = `
            UPDATE pm
            SET status = 'checkin',
                checkin_time = NOW(),
                last_activity_at = NOW()
            WHERE id = $1
                AND status IS DISTINCT FROM 'checkin'
            RETURNING id;
            `;

            const res = await client.query(sql, [pmId]);

            if (res.rowCount === 0) {
                return {
                    success: false,
                    message: "ไม่สามารถ check-in ได้ (อาจถูก check-in แล้ว หรือไม่มีสิทธิ์)"
                };
            }

            return {
                success: true,
                message: "Check-in สำเร็จ"
            };

        } catch (err) {
            console.error("checkIn error:", err);
            return {
                success: false,
                message: "เกิดข้อผิดพลาด"
            };
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
                AND status = 'checkin';
                `;
            const values = [
                pmId
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