import { DynamicTool } from "langchain/tools";

async function runQuery(sqlScript: string) {
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

export const runSqlQueryTool = new DynamicTool({
  name: "run_sql_query",
  description:
    "Useful tool to run sql query. The argument is the sql query as a string.",
  func: async (args) => {
    const sqlQuery = args;

    try {
      const response = await runQuery(sqlQuery);
      const r = await response.text();
      return r;
    } catch (error: any) {
      return `Error executing sql query ${error?.message}`;
    }
  },
});
