import { Hono } from "hono";
import { site_information_fields_config } from "../config/site_information.config.js";
import { kwh_meter_fields_config } from "../config/kwh_meter.config.js";
import { transformer_fields_config } from "../config/transformer.config.js";
import { generator_fields_config } from "../config/generator.config.js";
import { site_facility_fields_config } from "../config/site_facility.config.js";
import { voltage_input_fields_config } from "../config/voltage_input.config.js";
import { mdb_ac_fields_config } from "../config/mdb_ac.config.js";
import { ground_system_fields } from "../config/ground_system.config.js";
import { external_alarm_before_fields_config } from "../config/external_alarm_before.config.js";
import { nodeb_tx_equipment_fields } from "../config/nodeb_tx_equipment.config.js";
import { rectifierFieldConfig } from "../config/rectifier.config.js";
import { cabinet_check_fields_config } from "../config/cabinet_check.config.js";
//
import { battery_backup_fields_config } from "../config/battery_backup.config.js";
import { test_alarm_fields_config } from "../config/test_alarm.config.js";
import { filter_check_fields_config } from "../config/filter_check.config.js";
import { online_equipment_1_fields_config } from "../config/online_equipment_1.config.js";
import { online_equipment_2_fields_config } from "../config/online_equipment_2.config.js";
import { mowing_1_fields_config } from "../config/mowing_1.config.js";
import { mowing_2_fields_config } from "../config/mowing_2.config.js";
import { solar_cell_fields_config } from "../config/solar_cell.config.js";
import { air_maintenance_1_field_config } from "../config/air_maintenance_1.config.js";
import { air_maintenance_2_field_config } from "../config/air_maintenance_2.config.js";
import { nop_external_alarm_fields_config } from "../config/nop_external_alarm.config.js";
import { nop_verify_fields } from "../config/nop_verify.config.js";

const pmConfigRouter = new Hono();
// GET /api/config/...

pmConfigRouter.get("/siteinformation", (c) => {
  return c.json({
    module: "siteinformation",
    fields: site_information_fields_config
  });
});

pmConfigRouter.get("/KwhMeter", (c) => {
  return c.json({
    module: "kwh_meter",
    fields: kwh_meter_fields_config
  });
});

pmConfigRouter.get("/transformer", (c) => {
  return c.json({
    module: "transformer",
    fields: transformer_fields_config
  });
});

pmConfigRouter.get("/generator", (c) => {
  return c.json({
    module: "generator",
    fields: generator_fields_config
  });
});

pmConfigRouter.get("/siteFacility", (c) => {
  return c.json({
    module: "site_facility",
    fields: site_facility_fields_config
  });
});

pmConfigRouter.get("/voltageInput", (c) => {
  return c.json({
    module: "voltage_input",
    fields: voltage_input_fields_config
  });
});

pmConfigRouter.get("/mdb_ac", (c) => {
  return c.json({
    module: "mdb_ac",
    fields: mdb_ac_fields_config
  });
});

pmConfigRouter.get("/groundingSystem", (c) => {
  return c.json({
    module: "groundingSystem",
    fields: ground_system_fields
  });
});

pmConfigRouter.get("/externalAlarmBefore", (c) => {
  return c.json({
    module: "externalAlarmBefore",
    fields: external_alarm_before_fields_config
  });
});

pmConfigRouter.get("/nodebTx", (c) => {
  return c.json({
    module: "nodebTx",
    fields: nodeb_tx_equipment_fields
  });
});

pmConfigRouter.get("/rectifier", (c) => {
  return c.json({
    module: "rectifier",
    fields: rectifierFieldConfig
  });
});

pmConfigRouter.get("/cabinet_check", (c) => {
  return c.json({
    module: "cabinet_check",
    fields: cabinet_check_fields_config
  });
});

pmConfigRouter.get("/cabinet_check", (c) => {
  return c.json({
    module: "cabinet_check",
    fields: cabinet_check_fields_config
  });
});

/////////////

pmConfigRouter.get("/battery_backup", (c) => {
  return c.json({
    module: "battery_backup",
    fields: battery_backup_fields_config
  });
});

pmConfigRouter.get("/test_alarm", (c) => {
  return c.json({
    module: "test_alarm",
    fields: test_alarm_fields_config
  });
});

pmConfigRouter.get("/filter", (c) => {
  return c.json({
    module: "filter",
    fields: filter_check_fields_config
  });
});

pmConfigRouter.get("/online_eq_1", (c) => {
  return c.json({
    module: "online_eq_1",
    fields: online_equipment_1_fields_config
  });
});

pmConfigRouter.get("/online_eq_2", (c) => {
  return c.json({
    module: "online_eq_2",
    fields: online_equipment_2_fields_config
  });
});

pmConfigRouter.get("/mowing_1", (c) => {
  return c.json({
    module: "mowing_1",
    fields: mowing_1_fields_config
  });
});

pmConfigRouter.get("/mowing_2", (c) => {
  return c.json({
    module: "mowing_2",
    fields: mowing_2_fields_config
  });
});

pmConfigRouter.get("/solar_cell", (c) => {
  return c.json({
    module: "solar_cell",
    fields: solar_cell_fields_config
  });
});

pmConfigRouter.get("/air_maintenance_1", (c) => {
  return c.json({
    module: "air_maintenance_1",
    fields: air_maintenance_1_field_config
  });
});

pmConfigRouter.get("/air_maintenance_2", (c) => {
  return c.json({
    module: "air_maintenance_2",
    fields: air_maintenance_2_field_config
  });
});

pmConfigRouter.get("/nop_external_alarm", (c) => {
  return c.json({
    module: "nop_external_alarm",
    fields: nop_external_alarm_fields_config
  });
});

pmConfigRouter.get("/nop_verify", (c) => {
  return c.json({
    module: "nop_verify",
    fields: nop_verify_fields
  });
});

export default pmConfigRouter;
