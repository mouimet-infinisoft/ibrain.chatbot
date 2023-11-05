import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { InputValues } from "langchain/schema";
const chat = new ChatOpenAI({temperature:0.8});
const memory = new BufferMemory();

export const initApiChain = async (
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
