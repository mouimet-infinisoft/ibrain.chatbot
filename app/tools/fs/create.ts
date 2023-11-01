import { DynamicTool } from 'langchain/tools';

const API_URL = 'http://localhost:3010';

async function createFile(filename: string, content: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/fs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename, content })
    });

    if (!response.ok) {
      throw new Error('Error creating file');
    }
  } catch (error) {
    throw new Error('Error creating file');
  }
}

export const createFileTool = new DynamicTool({
  name: 'create_file',
  description: 'Useful to create a file. The input argument is a list seperated by a comma, representing the filename and content as a string. For example: `bob.txt, hi my name is bob.`',
  func: async (args) => {
    try {
      const [filename, ...content] = args.split(',')
      await createFile(filename, content.join(','));
      return "File created successfuly"
    } catch (error: any) {
      return `Failed to create file. Error message: ${error?.message}`
    }
  }
});