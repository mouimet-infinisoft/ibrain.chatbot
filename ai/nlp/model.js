const { dockStart } = require('@nlpjs/basic');
const readline = require('readline');

// Create readline interface for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
    const dock = await dockStart({
        settings: {
            nlp: {
                forceNER: true,
                languages: ['en',"fr"],
                corpora: [
                    __dirname + "/corpus/email-en.json",
                    __dirname + "/corpus/email-fr.json",
                    __dirname + "/corpus/run_sql_query.json"
                ]
            }
        },
        use: ['Basic', 'BuiltinMicrosoft', 'LangEn', "LangFr"],
    });

    // Register Builtins to parse dates automatically
    const builtin = dock.get('builtin-microsoft');
    const ner = dock.get('ner');
    ner.container.register('extract-builtin-??', builtin, true);

    const manager = dock.get('nlp');

    // Train the network
    await manager.train();

    const context = {};

    // Function to prompt user input and process the result
    const askAndProcess = async () => {
        rl.question('You: ', async (input) => {
            // Process the user's input
            const result = await manager.process(input);
            console.log('Bot:', result.answer);

            // Wait for the next user input
            askAndProcess();
        });
    };

    // Start the conversation loop
    askAndProcess();

})();
