<template>
  <div class="register">
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
      <a-form-item field="post" label="再次输入密码">
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import router from "@/router";
import message from "@arco-design/web-vue/es/message";

const form = reactive<UserRegisterRequest>({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});
const handleSubmit = async () => {
  try {
    const res = await UserControllerService.userRegisterUsingPost(form);
    if (res.code === 0) {
      message.success("注册成功");
      router.push("/user/login");
    } else {
      message.error("注册失败，" + res.message);
    }
  } catch (error) {
    console.error("捕获到错误:", error);
    message.error("网络错误");
  }
};
</script>
<style scoped>
.register {
  display: flex;
  justify-content: center; /* 水平居中 */
  height: 100vh;
}
</style>
