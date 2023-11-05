import { DynamicTool } from 'langchain/tools';
import { initPrompts } from "./deps/prompt";
import { initToolChain } from "./deps/chain";

export const generateToolDynamicTool = new DynamicTool({
    name: "tool_generator",
    description: `Useful to create Langchain dynamic tool. The input of this tool is the intention as string.`,
  func: async (args) => {
    const intention = args[0];
    console.log(args)

    const {intention2DynamicToolPrompt} = await initPrompts()
    console.log(intention2DynamicToolPrompt)

    const {generatorToolChain} = await initToolChain(intention2DynamicToolPrompt)
    console.log(intention2DynamicToolPrompt)

    const result = await generatorToolChain.run(intention);
    console.log(result)
    return result;
  },
});
