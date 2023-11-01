import { DynamicTool } from 'langchain/tools';

async function generateUml(uml: string) {
    const apiUrl = 'http://localhost:3010/uml/generate';

    const payload = {
        uml
    };

    return fetch(apiUrl, {
        method: "post",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(payload)
    });
}

export const umlTool = new DynamicTool({
    name: "uml_diagram",
    description: 'Useful to create diagram. The input to this tool should be a plant uml language string. It will generate a png diagram and retun its url',
    func: async (args) => {
        console.log(args)

        try {
            const response = await generateUml(args)
            if (response.ok) {
                const { imageUrl } = await response.json()
                return `The diagram has been created successfully. Respond in markdown ![Your Diagram](${imageUrl})`
            }
            return `Failed to create diagram. `
        } catch (err: any) {
            return "Failed to create diagram. Error message is " + err?.message
        }

    }
})