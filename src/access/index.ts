import router from "@/router";
import ACCESS_ENUM from "@/access/accessEnum";
import { checkAccess } from "@/access/checkAccess";
import { useStore } from "vuex";

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  console.log("登陆用户信息", store.state.user.LoginUser);

  let loginUser = store.state.user.LoginUser;
  // 如果之前没登陆过，自动登录
  if (loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
    // 加 await 是为了等用户登录成功之后，再执行后续的代码
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.LoginUser;
  }
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // 要跳转的页面必须要登陆
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没登陆，跳转到登录页面
    if (loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      console.log(loginUser.userRole);
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登陆了，但是权限不足，那么跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
