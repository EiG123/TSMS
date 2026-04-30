import axios from "axios";

export const networkAVAManage = {
  async UploadSitesAVA(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:3000/api/NetworkAVA/UploadSitesAVA",
      formData
    //   ,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    );

    return response.data;
  },
 
  async UploadIncidentTT(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:3000/api/NetworkAVA/UploadIncidentTT",
      formData
    //   ,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    );

    return response.data;
  },
};