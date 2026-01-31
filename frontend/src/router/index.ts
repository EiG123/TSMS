import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/login.vue";
import Home from "../views/home.vue";
import PM from "../views/PM.vue";

import pm_nodeb from "../views/pm/pm_nodeb.vue";
import pm_nodeb_new from "../views/pm/pm_nodeb_new.vue";
import pm_nodeb_edit from "../views/pm/pm_nodeb_edit.vue";

const routes = [
    // 🔐 Login (ไม่มี layout)
    {
        path: "/",
        name: "login",
        component: Login,
    },

    // 🧱 Main layout (ต้อง login)
    {
        path: "/",
        meta: { requiresAuth: true },
        children: [
            {
                path: "home",
                name: "home",
                component: Home,
            },
            {
                path: "PM",
                name: "PM",
                component: PM,
            },
            {
                path: "pm_nodeb",
                name: "pm_nodeb",
                component: pm_nodeb,
            },
            {
                path: "pm_nodeb_new",
                name: "pm_nodeb_new",
                component: pm_nodeb_new,
            },
            {
                path: "pm_nodeb_edit/:id",  // รับ ID เป็น parameter
                name: "pm_nodeb_edit",
                component: pm_nodeb_edit,
                props: true  // ส่ง params เป็น props
            }
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    // ⭐ ย้าย import เข้ามาใน callback แทน
    const { useAuthStore } = await import("../stores/auth");
    const authStore = useAuthStore();

    const isAuthenticated = authStore.initAuth();

    // ⭐ ถ้าต้องการ auth แต่ยังไม่ login
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: "login" });
    }
    // ⭐ ถ้า login แล้วแต่พยายามกลับไปหน้า login
    else if (to.name === "login" && isAuthenticated) {
        next({ name: "home" });
    }
    else {
        next();
    }
});

export default router;