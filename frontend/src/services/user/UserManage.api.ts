import axios from "axios";

export const UserManage = {
    async getProfileData(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/UserManage/getProfileData", data
        );
        return response.data.data;
    },
};

