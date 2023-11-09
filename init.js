import chatinput from './corpus/ui/chat-input-en.json'
import config from './corpus/ui/config-en.json'
import navigationCorpus from './app/ai/navigation/corpus/en.json'
import { core } from '@/app/layout';
export let _nlplib;
export let nlp;
core

// function loadNlpData(nlp, jsonData) {
//     jsonData.documents.forEach((doc) => {
//         nlp.addDocument(doc.lang, doc.utterance, doc.intent);
//     });

//     jsonData.answers.forEach((ans) => {
//         nlp.addAnswer(ans.lang, ans.intent, ans.answer);
//     });
// }

const init = async (core) => {
    if (typeof window !== "undefined") {
        _nlplib = window?.nlpjs;
        let container = await _nlplib?.containerBootstrap();
        container.use(_nlplib?.Nlp);
        container.use(_nlplib?.LangEn);
        // container.use(_nlplib?.LangFr);

        nlp = container.get("nlp");
        nlp.settings.autoSave = false;
        nlp.addLanguage("en");
        // loadNlpData(nlp, enDataSet);
        nlp.addCorpus(chatinput)
        nlp.addCorpus(config)
        nlp.addCorpus(navigationCorpus)
        // nlp.addCorpus(activeListen)
        console.log(nlp)

        nlp.registerActionFunction('communication.request.ui.main.panel.configuration.open', (d) => {
            core.log.info('communication.request.ui.main.panel.configuration.open', d);
            core.store.emit('communication.request.ui.main.panel.configuration.open', d);
            return Promise.resolve(d); // Assuming the function should return a 
        });

        nlp.registerActionFunction('communication.request.ui.main.panel.configuration.close', (d) => {
            core.log.info('communication.request.ui.main.panel.configuration.close', d);
            core.store.emit('communication.request.ui.main.panel.configuration.close', d);
            return Promise.resolve(d);
        });

        nlp.registerActionFunction('communication.request.ui.footer.chat.close', (d) => {
            core.log.info('communication.request.ui.footer.chat.close', d);
            core.store.emit('communication.request.ui.footer.chat.close', d);
            return Promise.resolve(d);
        });

        nlp.registerActionFunction('communication.request.ui.footer.chat.open', (d) => {
            core.log.info('communication.request.ui.footer.chat.open', d);
            core.store.emit('communication.request.ui.footer.chat.open', d);
            return Promise.resolve(d);
        });

        // nlp.registerActionFunction('communication.request.expectation.active.listening.required', (d) => {
        //     core.log.info('communication.request.expectation.active.listening.required', d);
        //     core.store.emit('communication.request.expectation.active.listening.required', d);
        //     return Promise.resolve(d);
        // });

        // nlp.registerActionFunction('communication.request.accepted.expect.active.listening.activated', (d) => {
        //     core.log.info('communication.request.accepted.expect.active.listening.activated', d);
        //     core.store.emit('communication.request.accepted.expect.active.listening.activated', d);
        //     return Promise.resolve(d);
        // });

        // nlp.registerActionFunction('communication.inform.expectation.active.listening.finished', (d) => {
        //     core.log.info('communication.inform.expectation.active.listening.finished', d);
        //     core.store.emit('communication.inform.expectation.active.listening.finished', d);
        //     return Promise.resolve(d);
        // });

        // nlp.registerActionFunction('communication.request.expectation.wait.delay.thinking', (d) => {
        //     core.log.info('communication.request.expectation.wait.delay.thinking', d);
        //     core.store.emit('communication.request.expectation.wait.delay.thinking', d);
        //     return Promise.resolve(d);
        // });


        await nlp.train();
    };



}

init()
    .then(() => {
        console.log(`NLP Initialized with success.`);
    })
    .catch((err) => {
        console.log(`Error initilalizing client side NLP `, err);
    });


