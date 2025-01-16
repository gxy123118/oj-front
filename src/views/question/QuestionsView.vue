<template>
  <div id="manageQuestionView" style="max-width: 1200px; margin: auto">
    <a-form :model="page" layout="inline">
      <a-form-item field="title1" label="题目" style="min-width: 200px">
        <a-input v-model="page.title" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 200px">
        <a-input-tag v-model="page.tags" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="fetchData">Submit</a-button>
      </a-form-item>
    </a-form>
    <a-divider dashed size="3px" />
    <a-table
      :columns="columns"
      :data="data"
      :pagination="{
        showTotal: true,
        pageSize: page.pageSize,
        current: page.current,
        total: page.tal,
      }"
      @page-change="handlePageChange"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(item, index) of record.tags"
            :key="index"
            color="green"
          >
            {{ item }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptRate="{ record }">
        {{
          `${
            record.submitNum > 0
              ? ((record.acceptNum / record.submitNum) * 100).toFixed(1)
              : "0"
          }% ${record.acceptNum}(通过数)/${record.submitNum}(提交数)`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("yyyy-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="EnterQuestion(record)">
            进入
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import router from "@/router";
import moment from "moment";

const page = reactive({
  title: "",
  tags: [],
  current: 1,
  pageSize: 5,
  tal: 0,
});
const columns = [
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "通过率",
    slotName: "acceptRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
const data = ref<Question[]>([]);

const fetchData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    page
  );
  if (res.code === 0) {
    data.value = res.data.records;
    page.tal = res.data.total;
    console.log(data);
  } else {
    message.error("获取失败");
  }
};
const handlePageChange = async (newPage: number) => {
  page.current = newPage; // 更新当前页
  await fetchData(); // 重新请求数据
};
const EnterQuestion = (question: Question) => {
  router.push(`/question/${question.id}`);
};
onMounted(fetchData);
</script>
<style scoped></style>
