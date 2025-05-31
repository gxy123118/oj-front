<template>
  <!-- AI助手悬浮按钮 -->
  <div class="ai-assistant-btn" @click="drawer = true">
    <el-icon :size="30" color="#fff">
      <ChatDotRound />
    </el-icon>
  </div>

  <!-- 抽屉式聊天窗口 -->
  <el-drawer
    v-model="drawer"
    title="智能AI助手"
    :direction="direction"
    size="30%"
  >
    <div class="drawer-content">
      <!-- 消息容器 -->
      <div ref="messagesContainer" class="messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
          :class="{
            'user-message': msg.isUser,
            'typing': msg.isTyping
          }"
        >
          <template v-if="msg.isTyping">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </template>
          <template v-else>
            {{ msg.text }}
          </template>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <el-input
            v-model="inputMessage"
            placeholder="请输入您的问题..."
            :rows="2"
            type="textarea"
            resize="none"
            clearable
            @keyup.enter.exact="sendMessage"
            class="message-input"
          ></el-input>
          <el-button
            class="send-icon-button"
            :icon="Promotion"
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isWaiting"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from "vue";
import type { DrawerProps } from "element-plus";
import { ChatDotRound, Promotion } from "@element-plus/icons-vue";
import message from "@arco-design/web-vue/es/message";

const drawer = ref(false);
const direction = ref<DrawerProps["direction"]>("rtl");
const inputMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const isWaiting = ref(false);

interface Message {
  text: string;
  isUser: boolean;
  isTyping?: boolean; // 新增：标识是否正在输入中
}

const messages = ref<Message[]>([
  { text: "你好！我是AI助手，有什么可以帮您？", isUser: false }
]);

const sendMessage = async () => {
  const text = inputMessage.value;
  if (isWaiting.value) {
    message.info("正在回复问题中...");
    return;
  }
  if (!text) return;

  messages.value.push({ text, isUser: true });
  inputMessage.value = "";
  scrollToBottom();
  isWaiting.value = true;

  try {
    const response = await fetch("http://localhost:9999/ai/stream/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(text)
    });

    if (!response.ok) {
      throw new Error("网络错误");
    }

    // 处理流式数据
    const reader = response.body?.getReader();
    if (!reader) throw new Error("无法获取流");

    let aiMessage = "";
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // 这里可以直接把 chunk 追加到最后一条AI消息里
      aiMessage += chunk;

      // 逐步渲染
      if (messages.value[messages.value.length - 1]?.isUser === false) {
        messages.value[messages.value.length - 1].text = aiMessage;
      } else {
        messages.value.push({ text: aiMessage, isUser: false });
      }
      scrollToBottom();
    }
  } catch (e) {
    console.error(e);
    messages.value.push({
      text: "抱歉，请求服务时出错",
      isUser: false
    });
  } finally {
    isWaiting.value = false;
  }
};


const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
/* AI助手悬浮按钮 */
.ai-assistant-btn {
  position: fixed;
  right: 20px;
  bottom: 40px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #409eff, #79bbff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.5);
  z-index: 2000;
  transition: all 0.3s ease;
}

.ai-assistant-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.7);
}

/* 抽屉内容 */
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  /* 保留文本格式 */
  white-space: pre-wrap; /* 保留空格和换行 */
  text-align: left; /* 确保左对齐 */
}

.user-message {
  align-self: flex-end;
  background: linear-gradient(135deg, #409eff, #79bbff);
  color: white;
  border-bottom-right-radius: 4px;
}

.message:not(.user-message) {
  align-self: flex-start;
  background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
  border-bottom-left-radius: 4px;
}

/* 新增：打字指示器 */
.typing-indicator {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 12px;
  width: fit-content;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: #909090;
  border-radius: 50%;
  margin: 0 2px;
  animation: typingAnimation 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingAnimation {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}

/* 输入区域样式 */
.input-area {
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
  position: sticky;
  bottom: 0;
}

.input-wrapper {
  position: relative;
}

.message-input {
  width: 100%;
  padding-right: 44px;
  padding-bottom: 8px;
  /* 保留输入框中的文本格式 */
  white-space: pre-wrap;
}

.send-icon-button {
  position: absolute;
  right: 8px;
  bottom: 12px;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  transition: all 0.2s;
  z-index: 10;
  opacity: 0.9;
}

.send-icon-button:hover {
  background-color: #79bbff;
  transform: scale(1.05);
  opacity: 1;
}

.send-icon-button:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
}

/* 美化滚动条 */
.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-thumb {
  background-color: rgba(64, 158, 255, 0.5);
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background-color: #409eff;
}
</style>