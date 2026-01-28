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



export default pmConfigRouter;
