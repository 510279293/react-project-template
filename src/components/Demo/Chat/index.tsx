import { ProChat } from '@ant-design/pro-chat';
import OpenAI from 'openai';
import { useState } from 'react';
import { OpenAIStream, StreamingTextResponse } from "ai";
import { AssistantModal, Thread, useEdgeRuntime } from "@assistant-ui/react";
import "@assistant-ui/react/styles/index.css";
import { MockResponse } from './mock';
const apiKey = 'sk-d6654b9bf6bb4ef693bd0a03fc4df602'
const openai = new OpenAI({
    apiKey,
    // baseURL:"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    dangerouslyAllowBrowser: true
});

class JnucAi {
  Ai: WebSocket;
  constructor(url: string) {
    this.Ai = new WebSocket(url)
    this.Ai.onmessage = this.onMessage.bind(this)
  }
  send(message: string){
    return this.Ai.send(message)
  }
  async onMessage(event?: any) {
    console.log('===event===>', event)
    return event
  }
}

const initChats = [
  {
    content: 'hello',
    createAt: 1697862242452,
    id: 'a1',
    meta: { avatar: '😀', title: '小明' },
    role: 'user',
    updateAt: 1697862243540,
  },
  {
    content: '请展示完整的会话高亮效果？',
    createAt: 1697862242452,
    id: 'a2',
    parentId: 'a1',
    meta: {avatar: "🤖"},
    role: 'assistant',
    updateAt: 1697862243540,
  },
]

// const Ai = new WebSocket('ws://192.168.8.146:6101/crm_server/chat')
// Ai.onopen = function (event) {
//   console.log('连接成功')
// }
// Ai.send('hello')
// Ai.onmessage = (msg) => {
//   console.log('onmessage', msg)
// }

const delay = (text: string) =>
  new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(text);
    }, 1000);
  });

function AntdProChat() {
  // const [chats, setChats] = useState(initChats)
  return (
      <ProChat
        style={{height: 600}}
        // chats={chats}
        request={async (messages) => {
          const mockedData: any = `这是一段模拟的流式字符串数据。本次会话传入了${messages.length}条消息`;

          const mockResponse = new MockResponse(mockedData, 100);

          console.log('=========调用我吧====>', mockResponse)
          return mockResponse.getResponse();
        }}
      />
  )
}

function Chat() {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
  });
  return (<>
    <Thread runtime={runtime} />
    {/* <AssistantModal runtime={runtime} /> */}
    <AntdProChat />
  </>)
}

export default Chat
