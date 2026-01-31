import pool from "./db.js";

export const PmServiceList = {
  async pmList() {
    const query = `SELECT * FROM pm_nodeb`;
    const { rows } = await pool.query(query);
    return rows;
  },
};

