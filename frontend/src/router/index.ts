import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/login.vue";
import Home from "../views/home.vue";
import PM from "../views/PM.vue";

import pm_nodeb from "../views/pm/pm_nodeb.vue";
import pm_nodeb_new from "../views/pm/pm_nodeb_new.vue";
import pm_site_detail from "../views/pm/pm_site_detail.vue";

import pm_title from "../views/pm/title/pm_title.vue";
import pm_title_add from "../views/pm/title/pm_title_add.vue";
import pm_title_edit from "../views/pm/title/pm_title_edit.vue";
import pm_title_child from "../views/pm/title/pm_title_child.vue";
import pm_title_child_add from "../views/pm/title/pm_title_child_add.vue";

import pm_dropdown from "../views/pm/title/pm_dropdown.vue";
import pm_dropdown_add from "../views/pm/title/pm_dropdown_add.vue";
import pm_dropdown_member from "../views/pm/title/pm_dropdown_member.vue";
import pm_dropdown_member_add from "../views/pm/title/pm_dropdown_member_add.vue";

import cableslack from "../views/cableslack/cableslack.vue";

import txt_to_excel from "../views/txt_to_excel/home.vue";


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
                path: "pm_site_detail/:id",
                name: "pm_site_detail",
                component: pm_site_detail,
                props: true
            },
            {
                path: "pm_title",  
                name: "pm_title",
                component: pm_title 
            },
            {
                path: "pm_title_edit/:id",  
                name: "pm_title_edit",
                component: pm_title_edit,
                props: true
            },
            {
                path: "pm_dropdown",
                name: "pm_dropdown",
                component: pm_dropdown,
            },
            {
                path: "pm_dropdown_add",
                name: "pm_dropdown_add",
                component: pm_dropdown_add,
            },
            {
                path: "pm_dropdown_member/:id",
                name: "pm_dropdown_member",
                component: pm_dropdown_member,
                props: true,
            },
            {
                path: "pm_dropdown_member/:id",
                name: "pm_dropdown_member",
                component: pm_dropdown_member,
                props: true,
            },
            {
                path: "pm_dropdown_member_add/:id",
                name: "pm_dropdown_member_add",
                component: pm_dropdown_member_add,
                props: true,
            },
            {
                path: "pm_title_add",
                name: "pm_title_add",
                component: pm_title_add
            },
            {
                path: "pm_title_child/:id",
                name: "pm_title_child",
                component: pm_title_child,
                props: true
            },
            {
                path: "pm_title_child_add/:id",
                name: "pm_title_child_add",
                component: pm_title_child_add,
                props: true
            },
            {
                path: "cableslack",
                name: "cableslack",
                component: cableslack,
            },
            {
                path: "txt_to_excel",
                name: "txt_to_excel",
                component: txt_to_excel,
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