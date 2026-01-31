import axios from "axios";

export const getSiteList = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/site/pmSiteList"
  );
  return res.data;
};
