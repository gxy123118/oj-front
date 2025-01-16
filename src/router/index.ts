import { createRouter, createWebHistory } from "vue-router";
import { MyRoutes } from "./MyRoutes";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: MyRoutes,
});

export default router;
