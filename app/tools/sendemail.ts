import { DynamicTool } from 'langchain/tools';

async function sendEmail(content: string, title: string, attachment:string, destination: string): Promise<void> {
    // const apiUrl = 'https://apis-alpha.vercel.app/sendemail';
    const apiUrl = 'http://localhost:3010/email/send';

    const payload = {
        content,
        title,
        destination,
        attachment
    };

    await fetch(apiUrl, {
        method: "post",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(payload)
    });
}

export const sendEmailTool = new DynamicTool({
    name: "send_email",
    description: 'Useful to send emails. The input to this tool should be a comma separated list, representing the address, subject, attachments, message. For example, `info@example.com,follow up, ,Hi john how are you?` would be the input if you wanted to send an email without attachement at info@example.com with subject follow up and message Hi john how are you?',
    func: async (args) => {
        console.log(args)
        const [address, subject, attachment, ...message] = args.split(',')
        console.log(address)
        console.log(subject)
        console.log(attachment)
        console.log(message.join(''))

        if (!address){
            return "Destination email address is missing, ask for the address."
        }

        if (!subject){
            return "Subject is missing, ask for th subject."
        }

        if (message?.length <=0){
            return "Email message is missing, ask for the message."
        }

        try {
            await sendEmail(message.join(''), subject, attachment, address)
            return "Email sent sucessfully."
        } catch (err: any) {
            return "Failed to send email. Error message is " + err?.message
        }

    }
})