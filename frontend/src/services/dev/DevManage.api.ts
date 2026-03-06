import axios from "axios";

export const devManage = {
    async getAllRole() {
        const response = await axios.get(
            "http://localhost:3000/api/AdminManage/getAllRole"
        );
        return response.data;
    },

    async getAllPermission() {
        const response = await axios.get(
            "http://localhost:3000/api/DevManage/getAllPermission"
        );
        return response.data;
    },
    
    async getAllRoleWithPermission() {
        const response = await axios.get(
            "http://localhost:3000/api/DevManage/getAllRoleWithPermission"
        );
        return response.data;
    },

    async savePermissions(data: any){
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/savePermissions", data
        );
        return response.data;
    },
};

