import axios from "axios";

export const getRectifierConfig = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/config/rectifier"
  );
  return res.data;
};
