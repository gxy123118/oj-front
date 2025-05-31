<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header class="header">
      <GlobalHeader />
    </a-layout-header>
    <a-layout-content class="content">
      <a-layout style="background: #f1c191">
        <a-layout-content style="padding: 16px; min-height: 280px">
          <router-view />
        </a-layout-content>
      </a-layout>
      <!-- 添加AI对话组件 -->
      <AIChat />
    </a-layout-content>
    <a-layout-footer class="footer">
      <a href="https://arco.design/vue/component/layout" target="_blank"
        >由acro design组件库大力支持</a
      >
    </a-layout-footer>
  </a-layout>
</template>
<script setup lang="ts">
import GlobalHeader from "../components/GlobalHeader.vue";
import AIChat from "../components/AIChat.vue";
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
