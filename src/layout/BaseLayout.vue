<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header class="header">
      <GlobalHeader />
    </a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
    <a-layout-footer class="footer">
      <a href="https://arco.design/vue/component/layout" target="_blank"
        >由acro design组件库大力支持</a
      >
    </a-layout-footer>
  </a-layout>
</template>
<script setup lang="ts">
//setup语法糖不需要显式export default导出组件
import GlobalHeader from "../components/GlobalHeader.vue";
</script>

<style scoped>
.header {
  padding: 16px;
}

.content {
  background-color: #f1c191;
  padding: 16px;
  text-align: center;
}

.footer {
  background-color: #ffffff;
  padding: 16px;
  position: sticky;
  bottom: 0;
  width: 100%;
  text-align: center;
}
</style>
