import { DynamicTool } from "langchain/tools";

async function deployStoredProcScript(sqlScript: string) {
  const apiUrl = "http://localhost:3010/sql/deploy/sp";

  return fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      script: sqlScript,
    }),
  });
}

export const deployStoredProcTool = new DynamicTool({
  name: "deploy_stored_procedure",
  description:
    "Useful tool to deploy SQL stored procedure. The argument is the SQL script to create the stored procedure as a string.",
  func: async (args) => {
    const sqlScript = args;

    try {
      const response = await deployStoredProcScript(sqlScript);
      const r = await response.text();
      return r;
    } catch (error: any) {
      return `Error deploying the stored procedure ${error?.message}`;
    }
  },
});
