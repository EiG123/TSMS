import axios from "axios";

export const ApiGetData = {
    async getDataById(pmId: String) {
        const res = await axios.post(
            "http://localhost:3000/api/getData/getPmSiteData", { pmId }
        );
        return res.data;
    }
};
