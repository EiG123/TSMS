import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const PMApiService = {
    async pm_nodeb(site_id: string, node_type: string, round: string, cabinet_total: string, region: string, datetime: string, status: string, planwork: string, create_by: string, remark: string) {
        const response = await api.post('/pm_nodeb', { site_id, node_type, round, cabinet_total, region, datetime, status, planwork, create_by, remark});
        return response.data;
    }
};