export const ground_system_fields =
    [
        {
            field: 'ground_cable',
            label: '#8.1 - สภาพทั่วไป ของสาย Ground',
            result: true,
            value: true,
            remark: true,
            img: 'img_8_1',
                    required: false

        },
        {
            field: 'ground_rod',
            label: '#8.2 - สภาพทั่วไป ของบ่อ,ฝา,Rod ที่ Ground & Lightning Pit',
            result: true,
            value: true,
            remark: true,
            img: 'img_8_2',
                    required: false

        },
        {
            field: 'ground_pit',
            label: '#8.3 - ค่าความต้านทานที่ Ground Pit : น้อยกว่า 5 Ohm (Ohm)',
            result: true,
            value: true,
            remark: true,
            img: 'img_8_3',
                    required: false

        },
        {
            field: 'ground_lightning_pit',
            label: '#8.4 - ค่าความต้านทานที่ Lightning Pit : น้อยกว่า 5 Ohm (Ohm)',
            result: true,
            value: true,
            remark: true,
            img: 'img_8_4',
                    required: false

        },
        {
            field: 'ground_master_bar',
            label: '#8.5 - ค่าความต้านทานที่ Master Ground Bar: น้อยกว่า 5 Ohm (Ohm)',
            result: true,
            value: true,
            remark: true,
            img: 'img_8_5',
                    required: false

        },
        {
            field: 'ground_loop',
            label: '#8.6 - ความต่อเนื่องทางไฟฟ้า Lightning Pit – Ground Pit น้อยกว่า 0.1 Ohm และ ค่าความต่อเนื่องทางไฟฟ้าของระบบ Ground Loop น้อยกว่า 1 Ohm',
            result: true,
            value: true,
            remark: true,
            img: 'img_8_6',
                    required: false

        },
        {
            field: 'ground_insulator_support',
            label: '#8.7 - Insulator Support จากเสาล่อฟ้าและ Ground Bar ทุกจุด *แท่งฉนวนรองบาร์กราวด์',
            result: true,
            value: true,
            remark: true,
            img: 'img_8_7',
        required: false

        }
    ];
