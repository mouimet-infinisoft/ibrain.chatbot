import { DynamicTool } from "langchain/tools";
import { initPrompts } from "./deps/prompt";
import { initChain } from "./deps/chain";

export const generateRouteTool = new DynamicTool({
  name: "generate_code_route",
  description: "Generate the code of a route for a Node API based on user intention",
  func: async (args) => {
    const intention = args[0];
    const {intention2jsExpressRouterPrompt} = await initPrompts()
    const {generateRouteChain} = await initChain(intention2jsExpressRouterPrompt)
    const result = await generateRouteChain.run(intention);
    return result;
  },
});
