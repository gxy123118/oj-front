<template>
  <template v-if="route.path.startsWith('/user')">
    <router-view />
  </template>
  <template v-else>
    <BaseLayout />
  </template>
</template>
<script setup>
import BaseLayout from "@/layout/BaseLayout.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();

const store = useStore();
const loginUser = store.state.user.LoginUser;
console.log(loginUser);
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 200);
    super(callback);
  }
};
</script>
<style scoped></style>
