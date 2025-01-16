<template>
  <div>
    <!-- 判断 userName 是否为 "未登录" 来显示不同按钮 -->
    <a-button
      v-if="userName === '未登录' || !userName"
      type="primary"
      @click="login"
    >
      去登录
    </a-button>
    <a-button v-else type="primary" @click="loginOff">退出登录</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";

const router = useRouter();
const store = useStore();

// 使用 `ref` 来监听并手动管理 `userName`
const userName = computed(() => store.state.user.LoginUser.userName);

// 监听 `userName` 的变化，确保重新渲染
watch(
  () => store.state.user.LoginUser.userName,
  (newValue) => {
    console.log("userName 已变更:", newValue);
  }
);

// 登录方法
const login = async () => {
  router.push("/user/login");
};

// 退出登录方法
const loginOff = async () => {
  await store.dispatch("user/LoginOff");
};
</script>
