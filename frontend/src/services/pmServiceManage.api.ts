import axios from "axios";

export const pmServiceManage = {
    async deletePmById(id: any) {
        const response = await axios.delete(
            "http://localhost:3000/api/pmServiceManage/deletePmById",
            { data: {id} }
        );
        return response.data;
    },

    async checkIn(pmId: any, userId: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmCheckInOut/checkIn",
            {pmId, userId}
        );
        return response.data;
    },

    async checkOut(pmId: any, userId: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmCheckInOut/checkOut",
            {pmId, userId}
        );
        return response.data;
    },

    async valuePmByIdTitleIdTitleChildId(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmServiceManage/valuePmByIdTitleIdTitleChildId",
            { ...data }
        );
        return response.data;
    }
};

