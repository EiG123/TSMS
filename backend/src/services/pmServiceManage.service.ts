export const pmServiceManage = {
  async deletPmById(
    id: number,
    db: any
  ) {
    const client = await db.connect();
    try{
      const sql = `DELETE FROM pm WHERE id = $1`

      const values = [
        id
      ];
      const res = await client.query(sql, values);
      return {
        data: res,
        success: true
      }
    }catch(err){
      return{
        success: false
      }
    }finally{
      client.release();
    }
  },
};
