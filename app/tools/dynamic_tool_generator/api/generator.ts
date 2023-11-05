import { DynamicTool } from "langchain/tools";
import { initApiPrompts } from "./deps/prompt";
import { initApiChain } from "./deps/chain";

export const generateRouteTool = new DynamicTool({
  name: "generate_route_code",
  description: "Generate Node Router API Imlementation. The input is the user intention describing the requirements as a string.",
  func: async (args) => {
    const intention = args[0];
    const {intention2jsExpressRouterPrompt} = await initApiPrompts()
    const {generateRouteChain} = await initApiChain(intention2jsExpressRouterPrompt)
    const result = await generateRouteChain.run(intention);
    return result;
  },
});
