<template>
  <div class="menu-demo">
    <a-row
      class="grid-demo"
      style="margin-bottom: 16px"
      align="center"
      :wrap="false"
    >
      <a-col flex="auto">
        <div>
          <a-menu
            mode="horizontal"
            theme="light"
            :selected-keys="selectKey"
            @menu-item-click="handleClick"
          >
            <a-menu-item
              key="0"
              :style="{ padding: 0, marginRight: '38px' }"
              disabled
            >
              <div class="title-bar">
                <img
                  class="logo"
                  src="../assets/dan.jpg"
                  alt="Arco Design Pro"
                  style="width: 100px"
                />
                <span style="color: #2560ba; font-size: 20px">
                  &nbsp;&nbsp;鸡蛋oj
                </span>
              </div>
            </a-menu-item>
            <a-menu-item v-for="item in visible" :key="item.path">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>
      <a-col flex="100px">
        <a-space direction="vertical" fill>
          <div>{{ store.state?.user.LoginUser?.userName ?? "未登录" }}</div>
          <LoginButton />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { MyRoutes } from "@/router/MyRoutes";
import router from "@/router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { checkAccess } from "@/access/checkAccess";
import LoginButton from "@/components/LoginButton.vue";

const selectKey = ref(["/"]);
const store = useStore();

const visible = computed(() => {
  return MyRoutes.filter((item) => {
    if (item.meta?.hide) {
      return false;
    }
    return checkAccess(
      store.state.user.LoginUser,
      item?.meta?.access as string
    );
  });
});
router.beforeEach((to, from, next) => {
  if (to.meta?.access === ACCESS_ENUM.ADMIN) {
    if (store.state.user.LoginUser.userRole !== ACCESS_ENUM.ADMIN) {
      next("/noAuth");
      return;
    }
  }
  next();
});
router.afterEach((to) => {
  selectKey.value = [to.path];
});
const handleClick = (key: string) => {
  router.push(key);
};
</script>
<style scoped>
.arco-space-item {
  display: flex !important;
}

.arco-space-item div {
  align-content: center !important;
  text-align: center !important;
}

.arco-space-item button {
  margin: 0 auto !important;
}

.menu-demo {
  box-sizing: border-box;
  width: 100%;
}

.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  width: 26px;
  height: 70px;
}
</style>
