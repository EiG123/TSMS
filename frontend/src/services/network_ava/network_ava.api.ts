import axios from "axios";

export const networkAVAManage = {
  async UploadSitesAVA(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:3000/api/NetworkAVA/UploadSitesAVA",
      formData
    );

    return response.data;
  },
 
  async UploadIncidentTT(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:3000/api/NetworkAVA/UploadIncidentTT",
      formData
    );

    return response.data;
  },

  async AVAChart(data: any) {
    const response = await axios.post(
      "http://localhost:3000/api/NetworkAVA/AVAChart", data
    );

    return response.data;
  },

  async AVAChartALL(data: any) {
    const response = await axios.post(
      "http://localhost:3000/api/NetworkAVA/AVAChartALL", data
    );

    return response.data;
  }
};