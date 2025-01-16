<template>
  <div class="login">
    <a-form
      :model="form"
      :style="{ width: '600px' }"
      @submit="handleSubmit"
      layout="vertical"
    >
      <a-form-item field="name" label="用户名">
        <a-input v-model="form.userAccount" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item field="post" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-row :gutter="500">
          <a-col :span="12">
            <a-button html-type="submit">登录</a-button>
          </a-col>
          <a-col :span="12">
            <a-button @click="register">注册</a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService } from "../../../generated";
import { useStore } from "vuex";
import router from "@/router";
import message from "@arco-design/web-vue/es/message";

const form = reactive({
  userAccount: "",
  userPassword: "",
});
const store = useStore();
const handleSubmit = async () => {
  try {
    const res = await UserControllerService.userLoginUsingPost(form);
    if (res.code === 0) {
      await store.dispatch("user/getLoginUser");
      router.push({
        path: "/",
        replace: true,
      });
    } else {
      message.error("登陆失败，" + res.message);
    }
  } catch (error) {
    console.error("捕获到错误:", error);
    message.error("网络错误");
  }
};
const register = () => {
  router.push("/user/register");
};
</script>
<style scoped>
.login {
  display: flex;
  justify-content: center; /* 水平居中 */
  height: 100vh;
}
</style>
