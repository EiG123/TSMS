import axios from "axios";

export const getSiteInformationConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/siteinformation"
  );
  return res.data;
};

export const getKwhMeterConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/KwhMeter"
  );
  return res.data;
};

export const getTransformerConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/transformer"
  );
  return res.data;
};

export const getGeneratorConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/generator"
  );
  return res.data;
};

export const getSiteFacilityConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/siteFacility"
  );
  return res.data;
};

export const getVoltageInputConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/voltageInput"
  );
  return res.data;
};

export const getMdbAcConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/mdb_ac"
  );
  return res.data;
};

export const getGroundSystemConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/groundingSystem"
  );
  return res.data;
};

export const getExternalAlarmBeforeConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/externalAlarmBefore"
  );
  return res.data;
};

export const getNodeBTxConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/nodebTx"
  );
  return res.data;
};



export const getRectifierConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/rectifier"
  );
  return res.data;
};
