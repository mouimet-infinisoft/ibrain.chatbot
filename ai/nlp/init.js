import { enDataSet } from './datasets/en.js'
import chatinput from './corpus/ui/chat-input-en.json'
import config from './corpus/ui/config-en.json'
import activeListen from './corpus/humanity/active-listening-em.json'
export let _nlplib;
export let nlp;


function loadNlpData(nlp, jsonData) {
    jsonData.documents.forEach((doc) => {
        nlp.addDocument(doc.lang, doc.utterance, doc.intent);
    });

    jsonData.answers.forEach((ans) => {
        nlp.addAnswer(ans.lang, ans.intent, ans.answer);
    });
}

const init = async () => {
    if (typeof window !== "undefined") {
        _nlplib = window?.nlpjs;
        let container = await _nlplib?.containerBootstrap();
        container.use(_nlplib?.Nlp);
        container.use(_nlplib?.LangEn);
        // container.use(_nlplib?.LangFr);

        nlp = container.get("nlp");
        nlp.settings.autoSave = false;
        nlp.addLanguage("en");
        loadNlpData(nlp, enDataSet);
        nlp.addCorpus(chatinput)
        nlp.addCorpus(config)
        nlp.addCorpus(activeListen)
        console.log(nlp)
        
        nlp.registerActionFunction('main.panel.configuration.open', () => {
            console.log('main.panel.configuration.open')
            document.dispatchEvent(new CustomEvent('main.panel.configuration.open'))
            return Promise.resolve()
        });
        nlp.registerActionFunction('main.panel.configuration.close', () => {
            console.log('chat.input.close')
            document.dispatchEvent(new CustomEvent('main.panel.configuration.close'))
            return Promise.resolve()
        });
        nlp.registerActionFunction('main.footer.chat.open', () => {
            console.log('main.footer.chat.open')
            document.dispatchEvent(new CustomEvent('main.footer.chat.open'))
            return Promise.resolve()
        });
        nlp.registerActionFunction('main.footer.chat.close', () => {
            console.log('main.footer.chat.close')
            document.dispatchEvent(new CustomEvent('main.footer.chat.close'))
            return Promise.resolve()
        });


        nlp.registerActionFunction('accept.active.listeninge', () => {
            console.log('accept.active.listening')
            document.dispatchEvent(new CustomEvent('accept.active.listening'))
            return Promise.resolve()
        });
        nlp.registerActionFunction('inform.finished.speaking', () => {
            console.log('inform.finished.speaking')
            document.dispatchEvent(new CustomEvent('inform.finished.speaking'))
            return Promise.resolve()
        });






        nlp.registerActionFunction('accept.active.listening', async (...d) => {
            console.log('accept.active.listening ', d)
            document.dispatchEvent(new CustomEvent('accept.active.listening'))
            return Promise.resolve()
        });
        nlp.registerActionFunction('inform.finished.speaking', (...d) => {
            console.log('inform.finished.speaking', d)
            document.dispatchEvent(new CustomEvent('inform.finished.speaking'))
            return Promise.reject("I dont give a fuck!")
        });

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


