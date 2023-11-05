import { intention2codeTemplate } from "@/ai/prompt_templates/intention2codeTemplate";

const requirements = `1. Language is Typescript.
2. Template structure must be respected.
3. Use fetch only, anything else is not authorized. For example: Axios is not allowed.
4. Assume any secret are available from process.env['SECRET']`;

const template = `
import { DynamicTool } from "langchain/tools";

async function api(args: any[]) {
 // generate the implementation here
}

export const {name}Tool = new DynamicTool({
  name: "generate_the_name",
  description: "Generate a description.",
  func: async (args) => {
    // generate the implementation here
  },
});
`;

const example11 = `
import { DynamicTool } from "langchain/tools";

async function api(code:string, url:string) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      script: code,
    }),
  });
}

export const sqlDeploySpTool = new DynamicTool({
  name: "sql_deploy_sp",
  description: "Useful to deploy sql server stored procedure. The input argument is the e"
  func: async (args) => {
   const [url, filename, ...code] = args.split(',')

   try {
    const result = await api(code.join(','), url)
    return result
   } catch(err){
    const result = 'Error: ', err?.message
    console.error(result)
    return result
   }
  },
});
`;
const example=''
export const initPrompts = async () => {
  const intention2DynamicToolPrompt = await intention2codeTemplate.partial({
    requirements,
    template,
    example,
  });

  return {
    intention2DynamicToolPrompt,
  };
};
