import axios from "axios";

export const pmServiceManage = {
    async deletePmById(id: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmServiceManage/deletePmById",
            { id }
        );
        return response.data;
    },
};
