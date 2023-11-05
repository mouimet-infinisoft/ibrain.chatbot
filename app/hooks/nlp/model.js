const { dockStart } = require('@nlpjs/basic');

(async () => {
    const dock = await dockStart({
        settings: {
            nlp: {
                forceNER: true,
                languages: ['en'],
                corpora: [
                    "./corpus2.json"
                ]
            }
        },
        use: ['Basic', 'BuiltinMicrosoft', 'LangEn'],
    });

    // Register Builtins to parse dates automatically
    const builtin = dock.get('builtin-microsoft');
    const ner = dock.get('ner');
    ner.container.register('extract-builtin-??', builtin, true);

    const manager = dock.get('nlp');

    // Train the network
    await manager.train();

    const context = {};
    const result = await manager.process('en', 'I want to travel to Madrid tomorrow', context);
    console.log(JSON.stringify(result, null, 2));
    const result2 = await manager.process('en', 'From Berlin', context);
    console.log(JSON.stringify(result2, null, 2));

})();