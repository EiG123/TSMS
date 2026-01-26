import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/login.vue";
import Home from "../views/home.vue";
import PM from "../views/PM.vue";
import MainLayout from "../layouts/MainLayout.vue";

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
    component: MainLayout,
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

export default router;
