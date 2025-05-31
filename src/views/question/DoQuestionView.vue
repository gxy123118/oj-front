<template>
  <div id="doQuestionView">
    <a-row :gutter="[24, 24]" class="grid-demo">
      <a-col :md="12" :xs="24">
        <a-card v-if="data" :title="data.title" style="min-height: 110vh">
          <a-descriptions title="题目配置:" :column="{ xs: 1, md: 3 }">
            <a-descriptions-item label="时间限制">
              <a-tag>{{ data.judgeConfig.timeLimit ?? 0 }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="内存限制">
              <a-tag>{{ data.judgeConfig.memoryLimit ?? 0 }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="堆栈限制">
              <a-tag>{{ data.judgeConfig.stackLimit ?? 0 }}</a-tag>
            </a-descriptions-item>
          </a-descriptions>
          <template #extra>
            <a-space wrap>
              <a-tag
                v-for="(tag, index) of data.tags"
                :key="index"
                color="green"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </template>
          <MdView :value="data.content" />
        </a-card>
      </a-col>
      <a-col :md="12" :xs="24" style="display: flex; flex-direction: column">
        <a-space style="margin: 10px">
          <span>编程语言:</span>
          <a-select
            v-model="form.language"
            :style="{ width: '320px' }"
            placeholder="选择编程语言"
          >
            <a-option>java</a-option>
            <a-option>go</a-option>
            <a-option>cpp</a-option>
          </a-select>
        </a-space>
        <code-editor
          :value="form.code"
          :handle-change="handChange"
          :language="form.language"
          style="min-height: 100vh"
        />
        <a-button style="margin-top: 3px" type="primary" @click="submitCode">
          提交
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import { withDefaults, defineProps, ref, onMounted } from "vue";
import message from "@arco-design/web-vue/es/message";
import MdView from "@/components/MdView.vue";
import router from "@/router";

const form = ref<QuestionSubmitAddRequest>({
  code: "",
  language: "",
  questionId: 0,
});

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
});
const data = ref<QuestionVO | undefined>();
const fetchData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id
  );
  if (res.code === 0) {
    data.value = res.data;
    console.log(data.value);
  } else {
    message.error("获取失败");
  }
};
const handChange = (value: string) => {
  form.value.code = value;
};
const submitCode = async () => {
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: props.id,
  });
  // console.log("form.value", form.value);
  // console.log("后端返回的res", res);
  if (res.code === 0) {
    message.success("提交成功");
    router.push("/questions");
  } else {
    message.error(res.message);
  }
};
onMounted(() => {
  fetchData();
});
</script>
<style scoped></style>
