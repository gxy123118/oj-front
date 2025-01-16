import { StoreOptions } from "vuex";
import { UserControllerService } from "../../generated";
import ACCESS_ENUM from "@/access/accessEnum";
import message from "@arco-design/web-vue/es/message";

export const user = {
  namespaced: true,
  // 启用模块命名空间,避免模块之间的命名冲突
  state: () => ({
    LoginUser: {
      userName: "未登录",
      userRole: ACCESS_ENUM.NOT_LOGIN,
    },
  }),
  actions: {
    async getLoginUser({ commit }) {
      try {
        const res = await UserControllerService.getLoginUserUsingGet();
        if (res.code === 0) {
          commit("updateUser", res.data);
          console.log(res.data?.userName);
        } else {
          commit("updateUser", {
            username: "未登录",
            userRole: ACCESS_ENUM.NOT_LOGIN,
          });
        }
      } catch (e) {
        message.error("获取用户信息失败");
      }
    },
    async LoginOff({ commit }) {
      commit("updateUser", {
        username: "未登录",
        userRole: ACCESS_ENUM.NOT_LOGIN,
      });
      message.success("退出登录成功");
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.LoginUser = payload;
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
} as StoreOptions<any>;
