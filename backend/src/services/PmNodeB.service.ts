export const PmService = {
  async InsertPM(
    site_id: string,
    node_type: string,
    round: string,
    cabinet_total: number,
    region: string,
    datetime: Date,
    status: string,
    planwork: string,
    create_by: string,
    remark: string,
    db: any
  ) {
    const query = `
      INSERT INTO pm_nodeb
      (site_id, node_type, round, cabinet_total, region, pm_date, status, planwork, created_by, remark)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;

    try {
      await db.query(query, [
        site_id,
        node_type,
        round,
        cabinet_total,
        region,
        datetime,
        status,
        planwork,
        create_by,
        remark
      ]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'DB error' };
    }
  }
};
