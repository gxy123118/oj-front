<template>
  <div id="manageQuestionView">
    <a-table
      :data="data"
      :columns="columns"
      :pagination="{
        showTotal: true,
        pageSize: page.pageSize,
        current: page.current,
        total: page.tal,
      }"
      @page-change="handlePageChange"
    >
      <template #status="{ record }">
        <a-badge v-if="record.status === '待判题'" status="normal" />
        <a-badge v-if="record.status === '判题中'" status="processing" />
        <a-badge v-if="record.status === '判题成功'" status="success" />
        <a-badge v-if="record.status === '判题失败'" status="warning" />
        {{ record.status }}
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
import { onMounted, reactive, ref, render } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment/moment";

const page = reactive({
  current: 1,
  pageSize: 6,
  tal: 0,
});

const columns = [
  {
    title: "用户id",
    dataIndex: "userId",
  },
  {
    title: "题目id",
    dataIndex: "questionId",
  },
  {
    title: "状态",
    slotName: "status",
    dataIndex: "status",
  },
  {
    title: "语言",
    dataIndex: "language",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
];
const data = ref([]);

const fetchData = async () => {
  const res =
    await QuestionControllerService.listQuestionSubmitVoByPageUsingPost({
      current: page.current,
      pageSize: page.pageSize,
    });
  if (res.code === 0) {
    data.value = res.data.records.map((record: QuestionSubmitVO) => ({
      ...record,
      status: renderStatus(record.status as number), // 映射status字段
      createTime: moment(record.createTime).format("yyyy-MM-DD"),
    }));
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
// status映射函数
const renderStatus = (status: number) => {
  switch (status) {
    case 0:
      return "待判题";
    case 1:
      return "判题中";
    case 2:
      return "判题成功";
    case 3:
      return "判题失败";
    default:
      return "未知状态";
  }
};
</script>
<style scoped></style>
