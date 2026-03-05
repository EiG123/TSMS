import axios from "axios";

export const AdminManage = {
    async getAllUser() {
        const response = await axios.get(
            "http://localhost:3000/api/AdminManage/getAllUser"
        );
        return response.data;
    },

    async getUserById(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/AdminManage/getUserById", data
        );
        return response.data;
    },

    async userEdit(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/AdminManage/userEdit", data
        );
        return response.data;
    },
    
    async getAllRole(){
        const response = await axios.get(
            "http://localhost:3000/api/AdminManage/getAllRole"
        );
        return response.data;
    },
};

