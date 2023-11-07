// const nlp= require('@nlpjs/builtin-microsoft');;
// (async () => {
//   const manager = new NlpManager();
  
//   // Load the corpus from the file
//   manager.loadCorpus('./corpus.json');
  
//   // Train the model
//   await manager.train();

//   // Test the model with sample inputs
//   const input1 = 'Open chat input';
//   const input2 = 'Show dashboard';
  
//   const response1 = await manager.process('en', input1);
//   const response2 = await manager.process('en', input2);

//   console.log(response1);
//   console.log(response2);
// })();

const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ['en'],
        corpora: [
          "./corpus.json"
        ]
      }
    },
    use: ['Basic', 'LangEn'],
  });

  const manager = dock.get('nlp');

  // Train the network
  await manager.train();

  const result = await manager.process('en', 'Open the dashboard');
  console.log(JSON.stringify(result, null, 2));
})()