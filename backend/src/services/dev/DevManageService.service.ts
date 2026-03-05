
export const DevManageService = {
    async getAllRole(db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT 
            r.id,
            r.name,
            r.description,
            COALESCE(
                ARRAY_AGG(p.name)
                FILTER (WHERE p.name IS NOT NULL),
                '{}'
            ) AS permissions
            FROM roles r
            LEFT JOIN role_permissions rp ON rp.role_id = r.id
            LEFT JOIN permissions p ON p.id = rp.permission_id
            GROUP BY r.id
            ORDER BY r.id
            `;
            const res = await client.query(sql);

            return {
                success: true,
                result: res.rows
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async getAllPermission(db: any) {
        const client = await db.connect();
        try{
            const sql = `SELECT * FROM permissions`;
            const res = await client.query(sql);
            return {
                result: res.rows,
                success: true
            }
        }catch(err){
            return {
                success: false
            }
        }finally{
            client.release();
        }
    },

    async getAllRoleWithPermission(db: any) {
        const client = await db.connect();
        try{
            const sql = `SELECT
                r.id,
                r.name,
                r.description,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', p.id,
                            'name', p.name,
                            'description', p.description
                        )
                    ) FILTER (WHERE p.id IS NOT NULL),
                    '[]'
                ) AS permissions
            FROM roles r
            LEFT JOIN role_permissions rp 
                ON rp.role_id = r.id
            LEFT JOIN permissions p 
                ON p.id = rp.permission_id
            GROUP BY r.id
            ORDER BY r.id;`;
            const res = await client.query(sql);
            return {
                result: res.rows,
                success: true
            }
        }catch(err){
            return {
                success: false
            }
        }finally{
            client.release();
        }
    },

}