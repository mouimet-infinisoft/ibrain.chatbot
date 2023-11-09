import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
// import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI } from "langchain/chat_models/openai";
// import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
// import { SerpAPI, ReadFileTool, WriteFileTool } from "langchain/tools";
import { AIMessage, ChatMessage, HumanMessage } from "langchain/schema";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
  // createRetrieverTool,
  OpenAIAgentTokenBufferMemory,
} from "langchain/agents/toolkits";
import { ChatMessageHistory } from "langchain/memory";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { sendEmailTool } from "../../../../../ai/tools/sendemail";
import { WebBrowser } from "langchain/tools/webbrowser";
import { umlTool } from "../../../../../ai/tools/uml";
import { listFilesTool } from "../../../../../ai/tools/fs/list";
import { readFileTool } from "../../../../../ai/tools/fs/read";
import { createFileTool } from "../../../../../ai/tools/fs/create";
import { updateFileTool } from "../../../../../ai/tools/fs/update";
import { createFolderTool } from "../../../../../ai/tools/fs/mkdir";
// import { searchFileTool } from "@/app/tools/fs/search";
import { deployStoredProcTool } from "../../../../../ai/tools/sql/deploy"; // Import the deployStoredProcTool
import { runSqlQueryTool } from "../../../../../ai/tools/sql/run_sql_query";
import { generateRouteTool } from "../../../../../ai/tools/dynamic_tool_generator/api/generator";
import { generateToolDynamicTool } from "../../../../../ai/tools/dynamic_tool_generator/tool/generator";
// import { aiExpectationTool } from "@/app/tools/conversation/ai_expectation";
// import { storeIdentificationTool } from "@/app/tools/conversation/store_identification";

export const runtime = "edge";
const MAX_TOKENS = 4000;

async function limitTokens(chatHistory: ChatMessageHistory) {
  let tokens = 0;
  const limitedMessages = [];

  // Iterate over messages from newest to oldest
  for (const message of (await chatHistory.getMessages()).reverse()) {
    tokens += message.content.split(/\s+/).length; // A simple approximation
    if (tokens > MAX_TOKENS) break;
    limitedMessages.unshift(message); // Add the message to the beginning
  }

  return new ChatMessageHistory(limitedMessages);
}

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const TEMPLATE = `You are iBrain the AI Companion member of Infinisoft Team, you will be as much helpful as possible.\nIf you don't know how to answer a question, use the available tools to look up relevant information.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant"
    );
    const returnIntermediateSteps = body.show_intermediate_steps;
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-16k",
      temperature: 0.8,
    });

    // const client = createClient(
    //   process.env.SUPABASE_URL!,
    //   process.env.SUPABASE_PRIVATE_KEY!
    // );
    // const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    //   client,
    //   tableName: "documents",
    //   queryName: "match_documents"
    // });

    // const chatHistory = new ChatMessageHistory(
    //   previousMessages.map(convertVercelMessageToLangChainMessage)
    // );
    const limitedChatHistory = await limitTokens(
      new ChatMessageHistory(
        previousMessages.map(convertVercelMessageToLangChainMessage)
      )
    );

    const memory = new OpenAIAgentTokenBufferMemory({
      llm: model,
      memoryKey: "chat_history",
      outputKey: "output",
      chatHistory: limitedChatHistory,
    });

    // const retriever = vectorstore.asRetriever();

    const tools = [
      // storeIdentificationTool,
      // aiExpectationTool,
      // createFolderTool,
      // updateFileTool,
      // createFileTool,
      // readFileTool,
      // listFilesTool,
      // umlTool,
      // sendEmailTool,
      // runSqlQueryTool,
      // new SerpAPI(),
      // new WebBrowser({ model, embeddings: new OpenAIEmbeddings() }),
      // searchFileTool,
      // deployStoredProcTool, 
      generateRouteTool,
      generateToolDynamicTool
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "openai-functions",
      memory,
      returnIntermediateSteps: true,
      verbose: true,
      agentArgs: {
        prefix: TEMPLATE,
      },
    });



    const result = await executor.call({
      input: currentMessageContent,
    });

    if (returnIntermediateSteps) {
      return NextResponse.json(
        { output: result.output, intermediate_steps: result.intermediateSteps },
        { status: 200 }
      );
    } else {
      // Agent executors don't support streaming responses (yet!), so stream back the complete response one
      // character at a time to simulate it.
      const textEncoder = new TextEncoder();
      const fakeStream = new ReadableStream({
        async start(controller) {
          controller.enqueue(textEncoder.encode(result.output));
          // for (const character of result.output) {
          //   controller.enqueue(textEncoder.encode(character));
          //   // await new Promise(resolve => setTimeout(resolve, 1));
          // }
          controller.close();
        },
      });

      return new StreamingTextResponse(fakeStream);
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
