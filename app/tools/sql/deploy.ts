import { DynamicTool } from 'langchain/tools';

async function deployStoredProcScript(sqlScript: string): Promise<void> {
  const apiUrl = 'http://localhost:3010/sql/deploy/sp';
  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: sqlScript,
      }),
    });
  } catch (error:any) {
    throw new Error(`Error deploying stored procedure: ${error?.message}`);
  }
}

export const deployStoredProcTool = new DynamicTool({
  name: 'deploy_stored_procedure',
  description: 'Useful tool to deploy SQL stored procedure. The argument is the SQL script as a string.',
  func: async (args) => {
    const sqlScript = args;

    try {
      await deployStoredProcScript(sqlScript);
      return 'Stored procedure deployed successfully.';
    } catch (error:any) {
      return `Error deploying stored procedure: ${error?.message}`;
    }
  },
});