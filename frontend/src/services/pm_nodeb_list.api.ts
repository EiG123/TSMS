import axios from "axios";

export const getPmList = {
  async getPmList(){
    const res = await axios.get(
      "http://localhost:3000/api/pmGetPm/pmGetPmList"
    );
    return res.data;
  },
  async getPmById(id: any) {
    const res = await axios.post(
      "http://localhost:3000/api/pmGetPm/pmGetPmList", {id}
    );
    return res.data;
  }
};
