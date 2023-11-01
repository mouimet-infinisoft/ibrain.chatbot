import { DynamicTool } from 'langchain/tools';

const API_URL = `http://localhost:3010`

async function listFiles(filepath: string): Promise<any[]> {
    try {
        const response = await fetch(`${API_URL}/fs/ls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filepath })
        });
        return response.json();
    } catch (error) {
        throw new Error('Error listing files');
    }
}

export const listFilesTool = new DynamicTool({
    name: "list_files",
    description: 'List all files and folders from the specified path',
    func: async (args) => {

        try {
            const files = await listFiles(args);
            return files.join('\n');
        } catch (error: any) {
            throw new Error(`Failed to list files. Error message: ${error?.message}`);
        }
    }
});