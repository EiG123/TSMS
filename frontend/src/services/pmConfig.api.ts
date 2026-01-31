import axios from "axios";

export const getSiteInformationConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/siteinformation"
  );
  return res.data;
};

export const getKwhMeterConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/KwhMeter"
  );
  return res.data;
};

export const getTransformerConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/transformer"
  );
  return res.data;
};

export const getGeneratorConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/generator"
  );
  return res.data;
};

export const getSiteFacilityConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/siteFacility"
  );
  return res.data;
};

export const getVoltageInputConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/voltageInput"
  );
  return res.data;
};

export const getMdbAcConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/mdb_ac"
  );
  return res.data;
};

export const getGroundSystemConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/groundingSystem"
  );
  return res.data;
};

export const getExternalAlarmBeforeConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/externalAlarmBefore"
  );
  return res.data;
};

export const getNodeBTxConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/nodebTx"
  );
  return res.data;
};

export const getRectifierConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/rectifier"
  );
  return res.data;
};

export const getCabinetCheckConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/cabinet_check"
  );
  return res.data;
};

export const getBatteriesConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/batteries"
  );
  return res.data;
};

export const getBatteryBackUpConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/battery_backup"
  );
  return res.data;
};

export const getTestAlarmConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/test_alarm"
  );
  return res.data;
};

export const getFilterConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/filter"
  );
  return res.data;
};

export const getOnlineEq1Config = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/online_eq_1"
  );
  return res.data;
};

export const getOnlineEq2Config = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/online_eq_2"
  );
  return res.data;
};

export const getMowing1Config = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/mowing_1"
  );
  return res.data;
};

export const getMowing2Config = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/mowing_2"
  );
  return res.data;
};

export const getSolarCellConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/solar_cell"
  );
  return res.data;
};

export const getAirMaintenance1Config = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/air_maintenance_1"
  );
  return res.data;
};

export const getAirMaintenance2Config = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/air_maintenance_2"
  );
  return res.data;
};

export const getNopExternalAlarmConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/nop_external_alarm"
  );
  return res.data;
};

export const getNopVerifyConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/pm/nop_verify"
  );
  return res.data;
};