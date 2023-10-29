const imaps = require('imap-simple');
const { OpenAI } = require('openai');
const mailparser = require('mailparser');

// Initialize OpenAI with your API key
const openai = new OpenAI({ apiKey: "" })

const config = {
    imap: {
        user: "mouimet@infinisoft.world",
        password: "-",
        host: "mail.privateemail.com",
        port: 993,
        tls: true,
        authTimeout: 3000,
    },
};

async function classifyWithOpenAI(emailText) {
    try {
        // const gptResponse = await openai.completions.create({
        //     model: "text-davinci-002",
        //     prompt: `Based on the content and context of the following email, suggest a suitable folder name where it should be stored for easy retrieval later. The folder name should reflect the main theme or subject of the email. Folder name must me alpha numeric, do not contains space or special characters. \n\n${emailText}`,
        //     max_tokens: 50,
        // });

        // Define the prompt text separately
        const promptText = `Based on the content and context of the following email, generate a folder name where it should be stored for easy retrieval later respecting requirements.
        
        Requirements:
        1. The folder name must be alphanumeric only without space or special characters
        2. The folder name should be maxumum 15 characters
        3. The folder name should reflect the main theme or subject of the email.
        4. The folder name do not contain special characters and do not contain punctuation.
        5. You will answer the folder name only without anything else.
        
        Email:\n\n`;

        // Calculate the remaining character space available for emailText
        const remainingChars = 4096 - promptText.length;

        // Truncate emailText to fit within the remaining character limit
        const truncatedEmailText = emailText.substring(0, remainingChars);

        // Now create the prompt
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: [
                {role:'system', content:"You are an AI helpful assistance."},
                {role:'user', content: `${promptText}${truncatedEmailText}`}
            ],
            max_tokens: 20,
        });

        console.log(`Answer `, gptResponse)

        const classification = gptResponse.choices[0].message.content.trim();
        return classification;
    } catch (error) {
        console.error('Error classifying email:', error);
        throw error;
    }
}

async function ensureFolderExists(connection, folderName) {
    try {
        // Try to open the folder
        await connection.openBox(folderName);
    } catch (error) {
        // If opening the folder fails, try to create it
        try {
            await connection.addBox(folderName);
        } catch (addError) {
            // If creating the folder also fails, log the error
            console.error('Error creating folder:', addError);
            throw addError;
        }
    }
}


async function processEmails() {
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('Inbox');
        connection.addBox('test', (err, boxName)=>{
            console.log(err)
            console.log(boxName)
            connection.end();
        })


        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };
        // const messages = await connection.search(searchCriteria, fetchOptions);

        // for await (let message of messages) {
        //     const rawEmail = message.parts.find(part => part.which === 'TEXT').body;
            
        //     // Parse the raw email to extract the text content
        //     const parsedEmail = await mailparser.simpleParser(rawEmail);
        //     const emailText = parsedEmail.text || '';  // Use the text content, or an empty string if there's no text content
            
        //     const folderName = await classifyWithOpenAI(emailText);
        //     console.log(`emailText = `, emailText);
        //     console.log(`moving to folder `, folderName);
            
        //     await ensureFolderExists(connection, folderName);
        //     const uid = message.attributes.uid;
        //     // connection.moveMessage(uid, folderName);
        // }

      
      
        console.log('Emails processed successfully');
    } catch (error) {
        console.error('Error processing emails:', error);
    }
}

// Call the function to start the email processing task
processEmails();