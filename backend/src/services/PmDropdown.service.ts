export const pmDropdownService = {
    async InsertDropDown(data: any, pool: any) {
        const client = await pool.connect();
        try {
            const sql = `
        INSERT INTO pm_dropdown_head (
          dropdown_head
        ) VALUES ($1) RETURNING id`;
            const values = [
                data.dropdown_head
            ]
            const result = await client.query(sql, values);

            const dropdown_head_id = result.rows[0].id;
            const sql_member = `
        INSERT INTO pm_dropdown_member (
            dropdown_head_id,
          dropdown_member
        ) VALUES ($1, $2)`;
            const values_member = [
                dropdown_head_id,
                data.dropdown_member
            ]
            const result_member = await client.query(sql_member, values_member);

            return {
                success: true,
            };
        } catch {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async InsertDropDownMember(data: any, pool: any) {
        const client = await pool.connect();
        console.log(data.dropdown_name);
        try {
            const sql = `
        INSERT INTO pm_dropdown_member (
          dropdown_member
        ) VALUES ($1)`;
            const values = [
                data.dropdown_member
            ]
            const result = await client.query(sql, values);
            return {
                success: true,
            };
        } catch {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async getAllDropdown(pool: any) {
        const client = await pool.connect();
        try {
            const sql = `SELECT
          *
        FROM pm_dropdown_head;
      `;
            const res = await client.query(sql);
            return {
                result: res.rows,
                success: true
            }
        } catch (error) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async getDropdownMemberById(data: any, pool: any) {
        const client = await pool.connect();
        try {
            const sql = `SELECT
          *
        FROM pm_dropdown_member 
        WHERE dropdown_head_id = $1;
      `;
            const values = [data.id];
            const res = await client.query(sql, values);
            console.log(res);
            return {
                result: res.rows,
                success: true
            }
        } catch (error) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async deleteDropdownById(data: any, pool: any) {
        const client = await pool.connect();
        try {
            const sql = `DELETE FROM pm_dropdown_head
            WHERE id = $1;
                `;
            const values = [
                data.id
            ]
            const res = await client.query(sql, values);
            return {
                result: res.rows,
                success: true
            }
        } catch (error) {
            return {
                success: false
            }
        } finally {
            client.release();
        }

    },

    
    async AddDropDownMemberById(data: any, pool: any) {
        console.log(data);
        const client = await pool.connect();
        try {
            const sql = `INSERT INTO pm_dropdown_member (
                dropdown_head_id,    
                dropdown_member
            ) VALUES ($1, $2);
                `;
            const values = [
                data.id,
                data.dropdown_member
            ]
            const res = await client.query(sql, values);
            
            return {
                result: res.rows,
                success: true
            }
        } catch (error) {
            return {
                success: false
            }
        } finally {
            client.release();
        }

    },

    async deleteDropdownMemberById(data: any, pool: any) {
        const client = await pool.connect();
        try {
            const sql = `DELETE FROM pm_dropdown_member
            WHERE id = $1;
                `;
            const values = [
                data.id
            ]
            const res = await client.query(sql, values);
            return {
                result: res.rows,
                success: true
            }
        } catch (error) {
            return {
                success: false
            }
        } finally {
            client.release();
        }

    },
    
}