import pool from "../services/db.js";

pool.connect();

const sql = `SELECT * FROM pm_site_information`;

export const site_information_fields_config = [
    {
        field: 'photo_around',
        label: '#1.1 - ภาพถ่ายรอบ ๆ สถานีฐาน',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_1',
        required: false

    },
    {
        field: 'latitude',
        label: '#1.2 - Latitude *ละติจูด',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_2',
        required: false
    },
    {
        field: 'longitude',
        label: '#1.3 - Longitude *ลองติจูด',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_3',
        required: false
    },
    {
        field: 'equipment_room',
        label: '#1.5 - Equipment Room (Indoor/Outdoor) *ตู้อยู่ภายใน หรือภายนอกอาคาร',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_5',
        required: false
    },
    {
        field: 'site_type',
        label: '#1.6 - Site Type (GRF/RFT/IBC) *ประเภทของไซต์',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_6',
        required: false
    },
    {
        field: 'tower_type',
        label: '#1.7 - Tower Type *ประเภทของเสาสัญญาณ',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_7',
        required: false
    },
    {
        field: 'tower_height',
        label: '#1.8 - Tower Height (M.) *ความสูงของเสาสัญญาณ',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_8',
        required: false
    },
    {
        field: 'site_access',
        label: '#1.9 - ต้องขออนุญาตก่อนเข้า Site หรือไม่ (Y/N)',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_9',
        required: false
    },
    {
        field: 'site_owner',
        label: '#1.10 - ชื่อผู้ติดต่อ สำหรับขอเข้า Site Dtac (Owner)',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_10',
        required: false
    },
    {
        field: 'site_owner_phone',
        label: '#1.11 - เบอร์ติดต่อ Site Dtac (Owner)',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_11',
        required: false
    },
    {
        field: 'site_key',
        label: '#1.12 - จำนวนกุญแจ (Dtac)',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_12',
        required: false
    },
    {
        field: 'manager_key',
        label: '#1.13 - ชื่อผู้ถือกุญแจ (Manager Dtac)',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_13',
        required: false
    },
    {
        field: 'manager_phone',
        label: '#1.14 - เบอร์ติดต่อผู้ถือกุญแจ (Manager Dtac)',
        result: true,
        value: true,
        remark: true,
        img: 'img_1_14',
        required: false
    }
];
