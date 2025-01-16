<template>
  <div id="manageQuestionView">
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
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #updateTime="{ record }">
        {{ moment(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button status="danger" @click="deleteQuestion(record)">
            删除
          </a-button>
          <a-button status="normal" @click="updateQuestion(record)">
            更新
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
const show = ref(true);
const page = reactive({
  current: 1,
  pageSize: 4,
  tal: 0,
});
const columns = [
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "答案",
    dataIndex: "answer",
  },
  {
    title: "创建人ID",
    dataIndex: "userId",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "判断用例",
    dataIndex: "judgeCase",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptNum",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    slotName: "updateTime",
  },
  {
    title: "Optional",
    slotName: "optional",
  },
];
const data = ref<Question[]>([]);

const fetchData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost({
    current: page.current,
    pageSize: page.pageSize,
  });
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
onMounted(fetchData);
const deleteQuestion = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    //todo 并且刷新页面数据
    message.success("删除成功");
    // 计算删除后是否需要跳转到前一页
    const isLastItemOnPage = data.value.length === 1; // 当前页是否只剩一个数据
    if (isLastItemOnPage && page.current > 1) {
      page.current--; // 如果删除的是最后一条数据且当前页大于1，就回到前一页
    }
    await fetchData();
  } else {
    message.error("删除失败");
  }
};
const updateQuestion = async (question: Question) => {
  router.push({
    path: "/question/update",
    query: {
      id: question.id,
    },
  });
};
</script>
<style scoped></style>
