import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { InputValues } from "langchain/schema";
console.log(process.env['OPENAI_API_KEY'])
const chat = new ChatOpenAI();

const memory = new BufferMemory();

export const initChain = async (
  prompt: PromptTemplate<InputValues<"intention">, any>
) => {
  const generateRouteChain = new ConversationChain({
    prompt,
    llm: chat,
    memory,
  });

  return {
    generateRouteChain,
  };
};
