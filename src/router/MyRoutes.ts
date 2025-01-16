import { RouteRecordRaw } from "vue-router";
import UserLayout from "@/layout/UserLayout.vue";
import LoginView from "@/views/user/LoginView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import DoQuestionView from "@/views/question/DoQuestionView.vue";
import QuestionSubmitView from "@/views/questionsubmit/QuestionSubmitView.vue";

export const MyRoutes: Array<RouteRecordRaw> = [
  // {
  //   path: "/noAuth",
  //   name: "无权限",
  //   component: NoAuthView,
  //   meta: {
  //     hide: true,
  //   },
  // },
  {
    path: "/",
    name: "",
    component: QuestionsView,
  },
  {
    path: "/questions",
    name: "主页",
    component: QuestionsView,
  },
  // {
  //   path: "/me",
  //   name: "关于我的",
  //   component: HomeView,
  //   meta: {
  //     access: ACCESS_ENUM.USER,
  //   },
  // },
  {
    path: "/question/add",
    name: "添加题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/question/update",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hide: true,
    },
  },
  {
    path: "/question/manage",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/question/:id",
    name: "当前题目",
    props: true,
    component: DoQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
      hide: true,
    },
  },
  {
    path: "/question/submit",
    name: "提交题目信息",
    component: QuestionSubmitView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: LoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: () => import("@/views/user/RegisterView.vue"),
      },
    ],
    meta: {
      hide: true,
    },
  },
];
