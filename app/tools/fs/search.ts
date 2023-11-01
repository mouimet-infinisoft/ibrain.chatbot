import { DynamicTool } from 'langchain/tools';

const API_URL = 'http://localhost:3010/fs/search';

async function searchFile(filename: string) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename })
    });

    if (!response.ok) {
      throw new Error('Error searching for file');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('An error occurred during the file search');
  }
}

export const searchFileTool = new DynamicTool({
  name: 'search_file',
  description: 'Useful for searching files. The input argument should be a file name provided as a string.',
  func: async (args: string) => {
    const filename = args;
    try {
      const result = await searchFile(filename);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to search for file. Error message: ${error?.message}`);
    }
  }
});