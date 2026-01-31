import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/pmInsert'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const PMApiService = {
    async pm_nodeb(
        site_id: string,
        region: string,
        datetime: string,
        status: string,
        generator: string,
        transformer: string,
        kwh_meter: any,
        solar_cell: string,
        mowing: string,
        created_by: string,
        remark: string) {
        const response = await api.post("/pm_nodeb", {
            site_id,
            region,
            datetime,
            status,
            generator,
            transformer,
            kwh_meter,
            solar_cell,
            mowing,
            created_by,
            remark
        });
        return response.data;
    },

    // บันทึก Site Information
    // async pm_site_information(pm_id: string, data: Record<string, any>) {
    //     const response = await api.post('/pm_site_information', {
    //         pm_id,
    //         ...data
    //     });
    //     return response.data;
    // },
};
