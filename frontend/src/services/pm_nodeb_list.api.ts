import axios from "axios";

export const getPmList = {
  async getPmList(){
    const res = await axios.get(
      "http://localhost:3000/api/pmGetPmData/pmGetPmList"
    );
    return res.data;
  },
  async getPmById(id: any) {
    const res = await axios.post(
      "http://localhost:3000/api/pmGetPmData/getPmDataById", {id}
    );
    return res.data;
  }
};
