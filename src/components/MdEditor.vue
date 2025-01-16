<template>
  <Editor
    :value="value"
    :mode="mode"
    :plugins="plugins"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { withDefaults, defineProps } from "vue";

// Props 是一个 TypeScript 接口
interface Props {
  value: string;
  mode?: string;
  handleChange: (v: string) => void;
}

withDefaults(defineProps<Props>(), {
  value: "",
  mode: "split",
  handleChange: (v: string) => {
    console.log(v);
  },
});
const plugins = [gfm(), highlight()];
</script>
