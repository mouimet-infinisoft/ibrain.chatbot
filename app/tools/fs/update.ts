import { DynamicTool } from 'langchain/tools';

const API_URL = 'http://localhost:3010';

async function updateFile(filename: string, content: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/fs/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, content })
    });

    if (!response.ok) {
      throw new Error('Error updating file');
    }
  } catch (error) {
    throw new Error('Error updating file');
  }
}

export const updateFileTool = new DynamicTool({
  name: 'update_file',
  description: 'Useful to update a file. The input argument is a list seperated by a comma, representing the filename and content as a string. For example: `text.txt, this is an update.`',
  func: async (args) => {
    try {
      const [filename, ...content] = args.split(',');
      await updateFile(filename, content.join(','));
      return 'File updated successfully';
    } catch (error: any) {
      return `Failed to update file. Error message: ${error?.message}`;
    }
  }
});