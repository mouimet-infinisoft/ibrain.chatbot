import { DynamicTool } from 'langchain/tools';

const API_URL = 'http://localhost:3010';

async function readFile(filepath: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/fs/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename: filepath })
    });
    const content = await response.text();
    return content;
  } catch (error) {
    throw new Error('Error reading file');
  }
}

export const readFileTool = new DynamicTool({
  name: 'read_file',
  description: 'Read the contents of a file',
  func: async (args) => {
    try {
      const content = await readFile(args);
      return content;
    } catch (error: any) {
      throw new Error(`Failed to read file. Error message: ${error?.message}`);
    }
  }
});