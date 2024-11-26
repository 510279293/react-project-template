import OpenAI from "openai";

const apiKey = 'sk-d6654b9bf6bb4ef693bd0a03fc4df602'
const openai = new OpenAI(
    {
        apiKey,
        baseURL:"https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {role: "system", content: "You are a helpful assistant." },
      {role: "user", content: "你是谁？" }
    ],
    model: "qwen-max",
  });

  console.log(completion.choices[0]['message']['content']);
}

main();