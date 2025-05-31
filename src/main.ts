import router from "./router";
import store from "./store";
import { createApp } from "vue";
import App from "./App.vue";
import "@arco-design/web-vue/dist/arco.css";
import ArcoVue from "@arco-design/web-vue";
import "./access";
import "bytemd/dist/index.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App)
  .use(store)
  .use(router)
  .use(ArcoVue)
  .use(ElementPlus)
  .mount("#app");
