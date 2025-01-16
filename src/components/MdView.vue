<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import { Viewer } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { withDefaults, defineProps } from "vue";

// Props 是一个 TypeScript 接口
interface Props {
  value: string;
}

withDefaults(defineProps<Props>(), {
  value: "",
});
const plugins = [gfm(), highlight()];
</script>
