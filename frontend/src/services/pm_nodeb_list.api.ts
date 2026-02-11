import axios from "axios";

export const getPmList = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/pmGetPm/pmGetPmList"
  );
  return res.data;
};
