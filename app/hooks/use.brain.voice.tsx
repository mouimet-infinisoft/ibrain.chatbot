"use client";
import "react-toastify/dist/ReactToastify.css";
import { useRef, useState, useEffect, useMemo } from "react";
import LanguageDetect from "languagedetect";
import brainstack from "./brainstack";
import { nlp } from "../../ai/nlp/init";
const { useBrainStack } = brainstack;

const lngDetector = new LanguageDetect();

// let lang = "fr"
const langCodes: { [x: string]: string } = {
  fr: "fr-CA",
  en: "en-US",
};

function getRandomSentence() {
  const sentences = [
    "Please give me a second to gather my thoughts.",
    "I just need a moment to reflect on that.",
    "Let me take a brief pause to consider.",
    "Give me a second to mull it over.",
    "I require a moment of contemplation.",
    "I need a moment to process the information.",
    "Allow me a moment to ponder and respond.",
    "Let me think about it for a moment.",
    "Please give me a moment to consider my response."
  ];

  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
}

export const useBrainVoice = () => {
  const bstack = useBrainStack();
  const recognitionRef = useRef<any>(null);
  const idleTimerRef = useRef<any>(null);
  /**
   * stopped: ignoring micro stopped
   * listening: micro started but no speaking
   * processing: someone speaking
   * idle: speaking completed speaking
   */
  const microRef = useRef<any>("stopped");
  const [isTalkEnable, setIsTalkEnable] = useState(true);
  const [isMicEnable, setIsMicEnable] = useState(true);

  const SpeakerToggle = () => (
    <div>
      <input
        type="checkbox"
        id="show_speak"
        name="show_speak"
        checked={isTalkEnable}
        onChange={(e) => setIsTalkEnable(e.target.checked)}
      ></input>
      <label htmlFor="show_speak"> Speak</label>
    </div>
  );

  const MicToggle = () => (
    <div>
      <input
        type="checkbox"
        id="show_mic"
        name="show_mic"
        checked={isMicEnable}
        onChange={(e) => setIsMicEnable(e.target.checked)}
      ></input>
      <label htmlFor="show_mic"> Microphone</label>
    </div>
  );

  function speak(text: string) {
    if (!isTalkEnable) {
      return;
    }
    if (microRef.current !== "stopped") {
      microRef.current = "stopped";
      recognitionRef.current.abort();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    lngDetector.setLanguageType("iso2");
    const lang = lngDetector.detect(text, 1)?.[0]?.[0] ?? "en";
    recognitionRef.current.lang = langCodes?.[lang] ?? "en-US";
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!isMicEnable) {
      return;
    }
    // Weird hack to fix SSR build problem
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any)?.webkitSpeechRecognition ||
        (window as any)?.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = langCodes["fr"];

      recognitionRef.current.onresult = async function (event: any) {
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
        }
        if (speechSynthesis.speaking) {
          microRef.current = "stopped";
          recognitionRef.current.abort();
          return;
        }

        /**
         * Debounced timer to speed conversation lifecycle
         * onspeechend is very slow to trigger
         * therefore, when stop speaking it may take 5-10s
         * to send request
         */
        idleTimerRef.current = setTimeout(() => {
          if (microRef.current === "idle") {
            microRef.current = "stopped";
            recognitionRef.current.stop();
          }
        }, 3000);

        microRef.current = "idle";
        let finalMsg = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          bstack.log.info(transcript, event);
          finalMsg = finalMsg + " " + transcript;
        }

        const resultnlp = await nlp.process(finalMsg);
        if (resultnlp?.answer) {
          speak(resultnlp?.answer);
          bstack.store.emit("ibrain.voice.message.nlp", {
            answer: resultnlp.answer,
            utterance: resultnlp.utterance,
          });
        } else {
          const feedback = getRandomSentence();
          speak(feedback)
          bstack.store.emit("ibrain.voice.message.complex", {
            feedback,
            utterance: finalMsg,
          });
        }
      };

      recognitionRef.current.onspeechstart = function (event: any) {
        console.log(
          `ON speech start in language ${recognitionRef.current.lang}`
        );

        if (speechSynthesis.speaking) {
          microRef.current = "stopped";
          recognitionRef.current.abort();
          return;
        }

        microRef.current = "processing";
      };

      recognitionRef.current.onspeechend = function (event: any) {
        console.log("ON speech end");
        microRef.current = "stopped";

        if (speechSynthesis.speaking) {
          recognitionRef.current.abort();
          return;
        }

        recognitionRef.current.stop();
      };

      recognitionRef.current.onstart = function () {
        console.log(`ON start in language ${recognitionRef.current.lang}`);
        if (speechSynthesis.speaking) {
          console.log("AI Speaking: stoping recognition");
          microRef.current = "stopped";
          recognitionRef.current.abort();
          return;
        }

        microRef.current = "listening";
        console.log("Audio capturing started");
      };

      recognitionRef.current.onend = function () {
        microRef.current = "stopped";
        bstack.log.info("Audio capturing ended");
        bstack.store.emit("ibrain.voice.end");
      };
    }

    timerRef.current = setInterval(() => {
      try {
        if (!speechSynthesis.speaking && microRef.current === "stopped") {
          microRef.current = "listening";
          recognitionRef.current.start();
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000);
    return () => {
      clearTimeout(idleTimerRef.current);
      clearInterval(timerRef.current);
    };
  }, [isMicEnable]);

  return {
    listen: recognitionRef.current?.start,
    abort: recognitionRef.current?.abort,
    stop: recognitionRef.current?.stop,
    speak,
    SpeakerToggle,
    MicToggle,
  };
};
