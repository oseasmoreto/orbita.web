import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import AppLayout from "@/core/layouts/AppLayout.vue";
import { identityRoutes } from "@/modules/identity/routes";
import { setupRouterGuards } from "./guards";

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: () => import("@/shared/views/HomeView.vue"),
        meta: { title: "Dashboard" },
        name: "home",
        path: "",
      },
    ],
    component: AppLayout,
    meta: { requiresAuth: true },
    path: "/",
  },
  ...identityRoutes,
  {
    component: () => import("@/shared/views/ForbiddenView.vue"),
    name: "forbidden",
    path: "/forbidden",
  },
  {
    component: () => import("@/shared/views/NotFoundView.vue"),
    name: "not-found",
    path: "/:pathMatch(.*)*",
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupRouterGuards(router);
