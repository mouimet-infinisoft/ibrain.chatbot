//@ts-nocheck
"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { enDataSet } from "./hooks/nlp/datasets/en";
// import { frDataSet } from "./hooks/nlp/fr";

// Dynamically import BrainStackProvider and AgentsPage
const BrainStackProvider = dynamic(
  () =>
    import("@/app/hooks/brainstack").then(
      (mod) => mod.default.BrainStackProvider
    ),
  { ssr: false } // Load BrainStackProvider only on the client side
);

const AgentsPage = dynamic(
  () => import("./retrieval_agents/page"),
  { ssr: false } // Load AgentsPage only on the client side
);

export let _nlplib;
export let nlp;

export default function Home() {

  function loadNlpData(nlp, jsonData) {
    jsonData.documents.forEach((doc) => {
      nlp.addDocument(doc.lang, doc.utterance, doc.intent);
    });

    jsonData.answers.forEach((ans) => {
      nlp.addAnswer(ans.lang, ans.intent, ans.answer);
    });
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      _nlplib = (window as any)?.nlpjs;
      //@ts-ignore
      const init = async () => {
        let container = await _nlplib?.containerBootstrap();
        container.use(_nlplib?.Nlp);
        container.use(_nlplib?.LangEn);
        // container.use(_nlplib?.LangFr);
        nlp = container.get("nlp");
        nlp.settings.autoSave = false;
        nlp.addLanguage("en");
        loadNlpData(nlp, enDataSet);
        // loadNlpData(nlp, frDataSet);

        await nlp.train();
      };

      init()
        .then(() => {
          console.log(`NLP Initialized with success.`);
        })
        .catch((err) => {
          console.log(`Error initilalizing client side NLP `, err);
        });
    }
  }, []);

  return (
    <BrainStackProvider>
      <AgentsPage />
    </BrainStackProvider>
  );
}
