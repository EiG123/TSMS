import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/login.vue";
import Register from "../views/register.vue";
import Home from "../views/home.vue";
import PM from "../views/PM.vue";
import NotFound from "../views/NotFound.vue";

import devDashboard from "../views/dev/DevManage.vue";
import DevUserManage from "../views/dev/UserManage.vue";
import DevUserEdit from "../views/dev/userEdit.vue";

import AdminManage from "../views/admin/AdminManage.vue";
import userManage from "../views/admin/UserManage.vue";
import userEdit from "../views/admin/userEdit.vue";
import permissionManage from "../views/dev/permissionManage.vue";
import userPermissionEdit from "../views/dev/userPermissionEdit.vue";
import AddPermission from "../views/dev/AddPermission.vue";

import pm_nodeb from "../views/pm/pm_nodeb.vue";
import pm_nodeb_new from "../views/pm/pm_nodeb_new.vue";
import pm_site_detail from "../views/pm/pm_site_detail.vue";
import pm_site_detail_site_data from "../views/pm/pm_site_detail_site_data.vue";
import pm_site_detail_site_data_data from "../views/pm/pm_site_detail_site_data_data.vue";
import pm_site_detail_site_data_enter_data from "../views/pm/pm_site_detail_site_data_enter_data.vue";
import pm_site_detail_site_info from "../views/pm/pm_site_detail_site_info.vue";

import pm_enter_data from "../views/pm/pm_enter_data.vue";
import pm_add_cabinet from "../views/pm/pm_add_cabinet.vue";
import pm_cabinet_page from "../views/pm/pm_cabinet_page.vue";
import pm_cabinet_detail_page from "../views/pm/pm_cabinet_detail_page.vue";

import pm_title from "../views/pm/title/pm_title.vue";
import pm_title_add from "../views/pm/title/pm_title_add.vue";
import pm_title_edit from "../views/pm/title/pm_title_edit.vue";
import pm_title_child from "../views/pm/title/pm_title_child.vue";
import pm_title_child_add from "../views/pm/title/pm_title_child_add.vue";
import pm_title_child_edit from "../views/pm/title/pm_title_child_edit.vue";

import pm_dropdown from "../views/pm/title/pm_dropdown.vue";
import pm_dropdown_add from "../views/pm/title/pm_dropdown_add.vue";
import pm_dropdown_member from "../views/pm/title/pm_dropdown_member.vue";
import pm_dropdown_member_add from "../views/pm/title/pm_dropdown_member_add.vue";

import cableslack from "../views/cableslack/cableslack.vue";

import txt_to_excel from "../views/txt_to_excel/home.vue";
import path from "path";


const routes = [
    // 🔐 Login (ไม่มี layout)
    {
        path: "/",
        name: "login",
        component: Login,
    },

    {
        path: "/home",
        name: "home",
        component: Home,
        meta: {
            requiresAuth: true
        }
    },

    {
        path: "/register",
        name: "register",
        component: Register,
    },

    {
        path: "/dev",
        meta: {
            requiresAuth: true,
            permission: ["dev"]
        },
        children: [
            {
                path: "devDashboard",
                name: "devDashboard",
                component: devDashboard,
            },
            {
                path: "permissionManage",
                name: "permissionManage",
                component: permissionManage,
            },
            {
                path: "/user/permissionedit",
                name: "userPermissionEdit",
                component: userPermissionEdit,
                props: route => ({
                    id: route.query.id,
                })
            },
            {
                path: "/AddPermission",
                name: "AddPermission",
                component: AddPermission,
            },
            {
                path: "/dev/userManage",
                component: DevUserManage,
            },
            {
                path: "/dev/userEdit",
                component: DevUserEdit,
                props: route => ({
                    id: route.query.id,
                })
            },
        ]
    },

    {
        path: "/admin",
        meta: {
            requiresAuth: true,
            permission: ["admin"]
        },
        children: [
            {
                path: "adminDashboard",
                name: "adminDashboard",
                component: AdminManage,
            },
            {
                path: "userManage",
                name: "userManage",
                component: userManage,
            },
            {
                path: "/user/edit",
                name: "userEdit",
                component: userEdit,
                props: route => ({
                    id: route.query.id,
                })
            }
        ]
    },

    // 🧱 Main layout (ต้อง login)
    {
        path: "/",
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: "PM",
                name: "PM",
                component: PM,
                meta: {
                    permissions: ["view_pm"]
                }
            },
            {
                path: "pm_nodeb",
                name: "pm_nodeb",
                component: pm_nodeb,
                meta: {
                    permissions: ["view_pm_nodeb"]
                }
            },
            {
                path: "pm_nodeb_new",
                name: "pm_nodeb_new",
                component: pm_nodeb_new,
                meta: {
                    permissions: ["create_pm_nodeb"]
                }
            },
            {
                path: "pm_site_detail/:id",
                name: "pm_site_detail",
                component: pm_site_detail,
                props: true
            },
            {
                path: "pm_site_detail_site_data/:id",
                name: "pm_site_detail_site_data",
                component: pm_site_detail_site_data,
                props: true
            },
            {
                path: "pm_site_detail_site_info",
                name: "pm_site_detail_site_info",
                component: pm_site_detail_site_info,
                props: route => ({
                    id: route.query.id,
                    type: route.query.type,
                })
            },
            {
                path: "pm_site_detail_site_data_data",
                name: "pm_site_detail_site_data_data",
                component: pm_site_detail_site_data_data,
                props: route => ({
                    id: route.query.id,
                    type: route.query.type,
                })
            },
            {
                path: "pm_site_detail_site_data_enter_data",
                name: "pm_site_detail_site_data_enter_data",
                component: pm_site_detail_site_data_enter_data,
                props: route => ({
                    pmId: route.query.pmId,
                    title: route.query.title,
                    title_id: route.query.title_id,
                    order_number: route.query.order_number,
                })
            },
            {
                path: "pm_enter_data",
                name: "pm_enter_data",
                component: pm_enter_data,
                props: route => ({
                    pmId: route.query.pmId,
                    title_id: route.query.title_id,
                    title_child_id: route.query.title_child_id,
                    order_number: route.query.order_number,
                })
            },
            {
                path: "pm_add_cabinet",
                name: "pm_add_cabinet",
                component: pm_add_cabinet,
                props: route => ({
                    pmId: route.query.pmId,
                })
            },
            {
                path: "pm_cabinet_page",
                name: "pm_cabinet_page",
                component: pm_cabinet_page,
                props: route => ({
                    pmId: route.query.pmId,
                })
            },
            {
                path: "pm_cabinet_detail_page",
                name: "pm_cabinet_detail_page",
                component: pm_cabinet_detail_page,
                props: route => ({
                    cabinetId: route.query.cabinet_id
                })
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
                path: "pm_title_child_edit",
                name: "pm_title_child_edit",
                component: pm_title_child_edit,
                props: route => ({
                    title_id: route.query.title_id,
                    title_child_id: route.query.title_child_id,
                })
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

    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const { useAuthStore } = await import("../stores/auth");
    const authStore = useAuthStore();

    const isAuthenticated = authStore.isAuthenticated;

    // 1️⃣ ถ้าหน้านั้นต้อง login
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: "login" });
    }

    // 2️⃣ ถ้า login แล้วพยายามกลับไป login
    if (to.name === "login" && isAuthenticated) {
        return next({ name: "home" });
    }

    // 3️⃣ ถ้ามีการกำหนด permission
    if (to.meta.permissions) {
        const required = to.meta.permissions as string[];

        const hasAll = required.every(p =>
            authStore.hasPermission(p)
        );

        if (!hasAll) {
            return next({ name: "forbidden" });
        }
    }

    next();
});

export default router;