import axios from "axios";

export const DevManage = {
    async deleteUserById(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/deleteUserById", data
        );
        return response.data;
    },

    async getAllUser() {
        const response = await axios.get(
            "http://localhost:3000/api/DevManage/getAllUser"
        );
        return response.data;
    },

    async getAllRole() {
        const response = await axios.get(
            "http://localhost:3000/api/DevManage/getAllRole"
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

    async savePermissions(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/savePermissions", data
        );
        return response.data;
    },

    async deleteRole(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/deleteRole", data
        );
        return response.data;
    },


    async getUserById(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/getUserById", data
        );
        return response.data;
    },

    async userEdit(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/userEdit", data
        );
        return response.data;
    },

    async AddRole(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/AddRole", data
        );
        return response.data;
    },

    async addPermission(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/addPermission", data
        );
        return response.data;
    },

    async updatePermission(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/updatePermission", data
        );
        return response.data;
    },

    async deletePermission(data: any) {
        const response = await axios.post(
            "http://localhost:3000/api/DevManage/deletePermission", data
        );
        return response.data;
    },
};

