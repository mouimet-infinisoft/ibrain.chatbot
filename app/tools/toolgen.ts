import { DynamicTool } from 'langchain/tools';

export const toolGenerator = new DynamicTool({
    name: "tool_generator",
    description: `Useful to create tools. The input of this tool is the intention as string.`,
    func: async (args) => {
        console.log(args)

        try {

            return  `You will generate the new tool according to this intention: ${args}
    
            Here is an example of a tool to send email, it is mandatory to use DynamicTool class and func must be async:
            
            import axios from 'axios';
        import { DynamicTool } from 'langchain/tools';
        
        async function sendEmail(content: string, title: string, destination: string): Promise<void> {
         // implementation
        }
        
        export const sendEmailTool = new DynamicTool({
            name: "send_email",
            description: 'Useful to send emails. The input to this tool should be a comma separated list, representing the address, subject, message. For example, info@example.com,follow up,Hi john how are you? would be the input if you wanted to send an email at info@example.com with subject follow up and message Hi john how are you?',
            func: async (args) => {
              // implementation
        
                try {
                    await sendEmail(message.join(''), subject, address)
                    return "Email sent sucessfully."
                } catch (err: any) {
                    return "Failed to send email. Error message is " + err?.message
                }
        
            }
        })
            `
        } catch (err: any) {
            return "Failed to create tool. Error message is " + err?.message
        }

    }
})