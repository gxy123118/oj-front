<template>
  <div id="addQuestionView">
    <a-form :model="form" @submit="handleSubmit" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="为题目添加标题" />
      </a-form-item>
      <a-form-item field="content" label="内容">
        <MdEditor :value="form.content" :handle-change="handleContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="handleAnswerChange" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="form.tags"
          :style="{ width: '320px' }"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="题目配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" fill>
          <a-form-item label="时间限制" :style="{ width: '500px' }">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              mode="button"
              placeholder="请输入时间限制"
              size="small"
              min="0"
            />
          </a-form-item>
          <a-form-item label="堆栈限制" :style="{ width: '500px' }">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              size="small"
              min="0"
            />
          </a-form-item>
          <a-form-item label="内存限制" :style="{ width: '500px' }">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              size="small"
              min="0"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        v-for="(judgeCaseItem, index) of form.judgeCase"
        :label="`测试用例-${index + 1}`"
        :key="index"
      >
        <a-space direction="vertical" fill>
          <a-form-item label="输入用例" :key="index" label-col-flex="none">
            <a-input v-model="judgeCaseItem.input" placeholder="输入用例" />
          </a-form-item>
          <a-form-item label="输出用例" :key="index" label-col-flex="none">
            <a-input v-model="judgeCaseItem.output" placeholder="输出用例" />
          </a-form-item>
          <a-button @click="handleDelete(index)" status="danger">
            Delete
          </a-button>
        </a-space>
      </a-form-item>
      <div style="position: relative; left: 10px; margin-top: 15px">
        <a-button @click="handleAdd">添加测试用例</a-button>
      </div>
      <a-form-item :row-props="{ justify: 'end' }">
        <a-button
          html-type="submit"
          status="success"
          size="large"
          type="primary"
        >
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute();
const ifUpdate = route.path.includes("update");

const handleAnswerChange = (v: string) => {
  form.value.answer = v;
};
const handleContentChange = (v: string) => {
  form.value.content = v;
};
const form = ref<QuestionAddRequest>({
  title: "",
  answer: "",
  content: "",
  tags: [],
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0,
  },
});
const handleAdd = () => {
  form.value.judgeCase?.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index: number) => {
  form.value.judgeCase?.splice(index, 1);
};
// 如果是更新操作,先获取当前题目
const showCurrentQuestion = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  } else {
    const res = await QuestionControllerService.getQuestionByIdUsingGet(
      id as any
    );
    form.value = res.data as any;
    console.log(`回显的题目信息${id}`, res.data);
    if (res.code === 0) {
      if (!res.data?.judgeConfig) {
        form.value.judgeConfig = {
          memoryLimit: 0,
          stackLimit: 0,
          timeLimit: 0,
        };
      } else {
        form.value.judgeConfig = JSON.parse(res.data?.judgeConfig as string);
      }
      if (!res.data?.judgeCase) {
        form.value.judgeCase = [
          {
            input: "",
            output: "",
          },
        ];
      } else {
        form.value.judgeCase = JSON.parse(res.data?.judgeCase as string);
      }
      form.value.tags = JSON.parse(res.data?.tags as string);
      console.log(form.value);
    } else {
      message.error("获取当前题目失败");
    }
  }
};
onMounted(() => {
  if (ifUpdate) {
    showCurrentQuestion();
  }
});
const handleSubmit = async () => {
  if (ifUpdate) {
    console.log("更新的值", form.value);
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败");
    }
  } else {
    console.log("添加的值", form.value);
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("添加成功");
      router.push("/question/manage");
    } else {
      message.error("添加失败");
    }
  }
};
</script>
<style scoped></style>
