export const kwh_meter_fields_config = [
    {
        field: 'mea_pea',
        label: '#2.1 - MEA/PEA No. *หมายเลขมิเตอร์ไฟฟ้า',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_1',
        required: false

    },
    {
        field: 'meter_type',
        label: '#2.2 - Meter Type *ประเภทมิเตอร์ไฟ (TOU/TOD)',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_2',
        required: false
    },
    {
        field: 'electric_system',
        label: '#2.3 - Electric System (1 or 3 Phase) *ไฟ 1เฟส / 3เฟส',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_3',
        required: false
    },
    {
        field: 'kwh_size',
        label: '#2.4 - KWH Size *ขนาดมิเตอร์ไฟฟ้า 5(15),5(45)',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_4',
        required: false
    },
    {
        field: 'p1_l_input',
        label: '#2.5 - วัดกระแสไฟฟ้า(1P) L ก่อนเข้า Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_5',
        required: false
    },
    {
        field: 'p1_l_output',
        label: '#2.6 - วัดกระแสไฟฟ้า(1P) L ออกจาก Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_6',
        required: false
    },
    {
        field: 'p1_n_input',
        label: '#2.7 - วัดกระแสไฟฟ้า(1P) N ก่อนเข้า Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_7',
        required: false
    },
    {
        field: 'p1_n_output',
        label: '#2.8 - วัดกระแสไฟฟ้า(1P) N ออกจาก Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_8',
        required: false
    },
    {
        field: 'ground_leak',
        label: '#2.9 - Ground Leak 1P วัดคร่อม L-N (เอา Clamp คล้อง L,N ที่ Meter ไฟฟ้า หน้า Site : < 0.75 Amp)',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_9',
        required: false
    },
    {
        field: 'p3_r_input',
        label: '#2.10 - วัดกระแสไฟฟ้า(3P) R ก่อนเข้า Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_10',
        required: false
    },
    {
        field: 'p3_r_output',
        label: '#2.11 - กระแสไฟฟ้า 3P R ออกจาก Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_11',
        required: false
    },
    {
        field: 'p3_s_input',
        label: '#2.12 - กระแสไฟฟ้า 3P S ก่อนเข้า Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_12',
        required: false
    },
    {
        field: 'p3_s_output',
        label: '#2.13 - กระแสไฟฟ้า 3P S ออกจาก Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_13',
        required: false
    },
    {
        field: 'p3_t_input',
        label: '#2.14 - กระแสไฟฟ้า 3P T ก่อนเข้า Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_14',
        required: false
    },
    {
        field: 'p3_t_output',
        label: '#2.15 - กระแสไฟฟ้า 3P T ออกจาก Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_15',
        required: false
    },
    {
        field: 'p3_n_input',
        label: '#2.16 - กระแสไฟฟ้า 3P N ก่อนเข้า Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_16',
        required: false
    },
    {
        field: 'p3_n_output',
        label: '#2.17 - กระแสไฟฟ้า 3P N ออกจาก Meter',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_17',
        required: false
    },
    {
        field: 'kwh_physical_check',
        label: '#2.18 - Physical Check *ตรวจสอบสภาพทั่วไปมิเตอร์ไฟฟ้า',
        result: true,
        value: true,
        remark: true,
        img: 'img_2_18',
        required: false
    }
];
