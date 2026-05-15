export const sitesManageService = {
    async getAllSite(pool: any){
        const client = await pool.connect();
        try{
            const sql = `SELECT * FROM sites`;
            const result = await client.query(sql);
            return {
                result: result.rows,
                success: true
            }
        }catch(error){
            console.log(error);
            return {
                success: false
            }
        }finally{
            client.release();
        }

    }
}