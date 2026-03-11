export const DevManageService = {

    async getUserById(data: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT 
            u.id,
            u.email,
            u.username,
            u.phone,
            u.region,
            u.company,
            u.status,
            r.id as role_id,
            r.name as role
            FROM users u 
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE u.id = $1
            `;

            const res = await client.query(sql, [data]);
            return {
                success: true,
                result: res.rows
            }
        } catch (err) {
            console.log(err);
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async getAllUser(db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT 
            u.id,
            u.email,
            u.username,
            u.phone,
            u.region,
            u.company,
            u.status,
            r.name as role
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
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
        try {
            const sql = `SELECT * FROM permissions`;
            const res = await client.query(sql);
            return {
                result: res.rows,
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

    async getAllRoleWithPermission(db: any) {
        const client = await db.connect();
        try {
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
            WHERE r.name != $1
            GROUP BY r.id
            ORDER BY r.id;`;
            const res = await client.query(sql, ['dev']);
            return {
                result: res.rows,
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

    async savePermissions(data: any, db: any) {
        const client = await db.connect();
        if (data.roleId === 1) {
            return { success: false, message: "dev role locked" }
        }

        try {
            await client.query("BEGIN");

            const sql_delete = `DELETE FROM role_permissions WHERE role_id = $1`;
            await client.query(sql_delete, [data.roleId]);

            if (data.permissions && data.permissions.length > 0) {
                const sql = `
                INSERT INTO role_permissions (role_id, permission_id)
                SELECT $1, p.id
                FROM permissions p
                WHERE p.name = ANY($2::text[])
                `;
                await client.query(sql, [data.roleId, data.permissions]);
            }

            await client.query("COMMIT");
            return {
                success: true
            }
        } catch (err) {
            await client.query("ROLLBACK");
            console.error(err);
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async deleteUserById(data: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `DELETE FROM users WHERE id = $1`;
            const res = await client.query(sql, [data]);
            return {
                success: true,
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async userEdit(data: any, db: any) {
        const client = await db.connect();
        try {
            if (data.email === `dev@gmail.com`) {
                return {
                    success: false
                }
            }
            const sql = `
            UPDATE users u
            SET 
                email = $2,
                username = $3,
                phone = $4,
                region = $5,
                company = $6,
                status = $7
            WHERE u.id = $1
            RETURNING u.id;
            `;

            const res = await client.query(sql, [
                data.id,
                data.email,
                data.username,
                data.phone,
                data.region,
                data.company,
                data.status
            ]);

            const userId = res.rows[0].id;
            // console.log(userId);

            const sql_role = `UPDATE user_roles
            SET
                role_id = $2
            WHERE user_id = $1`;

            await client.query(sql_role, [
                userId,
                data.roleId
            ])
            return {
                success: true,
                result: res.rows[0] ?? null
            };

        } catch (err) {
            console.error("userEdit error:", err);
            return { success: false };
        } finally {
            client.release();
        }
    },

    async deleteRole(data: any, db: any) {
        if (data.roleName === `dev`) {
            return {
                success: false,
                message: `ไม่สามารถลบ Role ที่เป็น Dev ได้`
            }
        }
        const client = await db.connect();
        try {
            const sqlDeleteRole = `DELETE FROM roles WHERE id = $1 AND name = $2`;
            await client.query(sqlDeleteRole, [data.roleId, data.roleName]);
            return {
                success: true,
                message: `ลบ Role : ` + data.roleName + ` สำเร็จ`
            }
        }catch(err){
            return {
                success: false,
                message: err
            }
        }finally{
            client.release();
        }
        
    }

}