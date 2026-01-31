import pool from "./db.js";

export const PmGetDataSite = {
  // ถ้าต้องการดึงข้อมูลจากทุกตารางที่มีชื่อคอลัมน์ id
  async pmData(id: string) {
    try {
      const results: any = {};

      // ดึงข้อมูลจากตาราง pm_nodeb
      const pmQuery = `SELECT * FROM pm_nodeb WHERE id = $1`;
      const { rows: pmData } = await pool.query(pmQuery, [id]);
      results.pm_nodeb = pmData;

      // ดึงข้อมูลจากตาราง pm_site_information (ถ้ามี pm_id)
      const sitesInformationQuery = `SELECT * FROM pm_site_information WHERE pm_id = $1`;
      const { rows: pm_site_information } = await pool.query(sitesInformationQuery, [id]);
      results.pm_site_information = pm_site_information;

      // ดึงข้อมูลจากตาราง pm_kwh_meter
      const pm_kwh_meterQuery = `SELECT * FROM pm_kwh_meter WHERE pm_id = $1`;
      const { rows: pm_kwh_meter } = await pool.query(pm_kwh_meterQuery, [id]);
      results.pm_kwh_meter = pm_kwh_meter;

      // ดึงข้อมูลจากตาราง pm_transformer
      const pm_transformerQuery = `SELECT * FROM pm_transformer WHERE pm_id = $1`;
      const { rows: pm_transformer } = await pool.query(pm_transformerQuery, [id]);
      results.pm_transformer = pm_transformer;

      // ดึงข้อมูลจากตาราง pm_site_facility
      const pm_site_facilityQuery = `SELECT * FROM pm_site_facility WHERE pm_id = $1`;
      const { rows: pm_site_facility } = await pool.query(pm_site_facilityQuery, [id]);
      results.pm_site_facility = pm_site_facility;

      // ดึงข้อมูลจากตาราง pm_voltage_input
      const pm_voltage_inputQuery = `SELECT * FROM pm_voltage_input WHERE pm_id = $1`;
      const { rows: pm_voltage_input } = await pool.query(pm_voltage_inputQuery, [id]);
      results.pm_voltage_input = pm_voltage_input;

      // ดึงข้อมูลจากตาราง pm_mdb_ac
      const pm_mdb_acQuery = `SELECT * FROM pm_mdb_ac WHERE pm_id = $1`;
      const { rows: pm_mdb_ac } = await pool.query(pm_mdb_acQuery, [id]);
      results.pm_mdb_ac = pm_mdb_ac;
      
      // ดึงข้อมูลจากตาราง pm_grounding_system
      const pm_grounding_systemQuery = `SELECT * FROM pm_grounding_system WHERE pm_id = $1`;
      const { rows: pm_grounding_system } = await pool.query(pm_grounding_systemQuery, [id]);
      results.pm_grounding_system = pm_grounding_system;

      // ดึงข้อมูลจากตาราง pm_external_alarm_before
      const pm_external_alarm_beforeQuery = `SELECT * FROM pm_external_alarm_before WHERE pm_id = $1`;
      const { rows: pm_external_alarm_before } = await pool.query(pm_external_alarm_beforeQuery, [id]);
      results.pm_external_alarm_before = pm_external_alarm_before;

      // ดึงข้อมูลจากตาราง pm_nodeb_tx_equipment
      const pm_nodeb_tx_equipmentQuery = `SELECT * FROM pm_nodeb_tx_equipment WHERE pm_id = $1`;
      const { rows: pm_nodeb_tx_equipment } = await pool.query(pm_nodeb_tx_equipmentQuery, [id]);
      results.pm_nodeb_tx_equipment = pm_nodeb_tx_equipment;

      // ดึงข้อมูลจากตาราง pm_rectifier
      const pm_rectifierQuery = `SELECT * FROM pm_rectifier WHERE pm_id = $1`;
      const { rows: pm_rectifier } = await pool.query(pm_rectifierQuery, [id]);
      results.pm_rectifier = pm_rectifier;

      // ดึงข้อมูลจากตาราง pm_cabinet_check
      const pm_cabinet_checkQuery = `SELECT * FROM pm_cabinet_check WHERE pm_id = $1`;
      const { rows: pm_cabinet_check } = await pool.query(pm_cabinet_checkQuery, [id]);
      results.pm_cabinet_check = pm_cabinet_check;

      // ดึงข้อมูลจากตาราง pm_batteries
      const pm_batteriesQuery = `SELECT * FROM pm_batteries WHERE pm_id = $1`;
      const { rows: pm_batteries } = await pool.query(pm_batteriesQuery, [id]);
      results.pm_batteries = pm_batteries;

      // ดึงข้อมูลจากตาราง pm_test_alarm
      const pm_test_alarmQuery = `SELECT * FROM pm_test_alarm WHERE pm_id = $1`;
      const { rows: pm_test_alarm } = await pool.query(pm_test_alarmQuery, [id]);
      results.pm_test_alarm = pm_test_alarm;

      // ดึงข้อมูลจากตาราง pm_filter_check
      const pm_filter_checkQuery = `SELECT * FROM pm_filter_check WHERE pm_id = $1`;
      const { rows: pm_filter_check } = await pool.query(pm_filter_checkQuery, [id]);
      results.pm_filter_check = pm_filter_check;

      // ดึงข้อมูลจากตาราง pm_online_equipment
      const pm_online_equipmentQuery = `SELECT * FROM pm_online_equipment WHERE pm_id = $1`;
      const { rows: pm_online_equipment } = await pool.query(pm_online_equipmentQuery, [id]);
      results.pm_online_equipment = pm_online_equipment;

      // ดึงข้อมูลจากตาราง pm_mowing
      const pm_mowingQuery = `SELECT * FROM pm_mowing WHERE pm_id = $1`;
      const { rows: pm_mowing } = await pool.query(pm_mowingQuery, [id]);
      results.pm_mowing = pm_mowing;

      // ดึงข้อมูลจากตาราง pm_solar_cell
      const pm_solar_cellQuery = `SELECT * FROM pm_solar_cell WHERE pm_id = $1`;
      const { rows: pm_solar_cell } = await pool.query(pm_solar_cellQuery, [id]);
      results.pm_solar_cell = pm_solar_cell;

      // ดึงข้อมูลจากตาราง pm_air_maintenance
      const pm_air_maintenanceQuery = `SELECT * FROM pm_air_maintenance WHERE pm_id = $1`;
      const { rows: pm_air_maintenance } = await pool.query(pm_air_maintenanceQuery, [id]);
      results.pm_air_maintenance = pm_air_maintenance;

      // ดึงข้อมูลจากตาราง pm_nop_external_alarm_after
      const pm_nop_external_alarm_afterQuery = `SELECT * FROM pm_nop_external_alarm_after WHERE pm_id = $1`;
      const { rows: pm_nop_external_alarm_after } = await pool.query(pm_nop_external_alarm_afterQuery, [id]);
      results.pm_nop_external_alarm_after = pm_nop_external_alarm_after;

      // ดึงข้อมูลจากตาราง pm_nop_verify
      const pm_nop_verifyQuery = `SELECT * FROM pm_nop_verify WHERE pm_id = $1`;
      const { rows: pm_nop_verify } = await pool.query(pm_nop_verifyQuery, [id]);
      results.pm_nop_verify = pm_nop_verify;

      // ดึงข้อมูลจากตาราง pm_images
      const pm_imagesQuery = `SELECT * FROM pm_images WHERE pm_id = $1`;
      const { rows: pm_images } = await pool.query(pm_imagesQuery, [id]);
      results.pm_images = pm_images;

      return results;
    } catch (error) {
      console.error("Error fetching data from all tables:", error);
      throw error;
    }
  }
};