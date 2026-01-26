import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/login.vue";
import Home from "../views/home.vue";
import PM from "../views/PM.vue";

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

    const isAuthenticated = authStore.isAuthenticated;

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