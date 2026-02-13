import axios from "axios";

export const pmServiceManage = {
    async deletePmById(id: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmServiceManage/deletePmById",
            { id }
        );
        return response.data;
    },

    async heartbeat(pmId: number, userId: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmCheckInOut/heartbeat",
            {pmId, userId}
        );
        return response.data;
    },

    async checkIn(pmId: number, userId: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmCheckInOut/checkIn",
            {pmId, userId}
        );
        return response.data;
    },

    async checkOut(pmId: number, userId: any) {
        const response = await axios.post(
            "http://localhost:3000/api/pmCheckInOut/checkOut",
            {pmId, userId}
        );
        return response.data;
    }
};

