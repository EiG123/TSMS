import axios from "axios";
import FormData from "form-data";

export const txt_to_excelService = {
  async txt_to_excel(formData: FormData) {
    // debug

    const response = await axios.post(
      "http://localhost:8000/txt-to-excel",
      formData,
      {
        headers: formData.getHeaders(),
        responseType: "arraybuffer",
      }
    );

    return response;
  },
};
