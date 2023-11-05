import { DynamicTool } from 'langchain/tools';

async function createFolder(args) {
  const { folderPath = '', folderName = '' } = args;
  
  if (!folderPath || !folderName) {
    return 'Both folderPath and folderName are required';
  }
  
  try {
    const response = await fetch('/fs/mkdir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderPath, folderName }),
    });
    
    if (!response.ok) {
      throw new Error('Folder creation failed');
    }
    
    return 'Folder created successfully';
  } catch (error) {
    console.error('Error creating folder:', error);
    return 'Error creating folder: ' + error.message;
  }
}

export const createFolderTool = new DynamicTool({
  name: 'create_folder',
  description: 'Tool to create a new folder using the provided API endpoint',
  func: createFolder,
});