"use client";
import "react-toastify/dist/ReactToastify.css";
import { useRef, useState, useEffect, useMemo } from "react";
import LanguageDetect from "languagedetect";
import brainstack, { BrainStackProvider } from "./brainstack";
import { nlp } from "../../ai/nlp/init";
import { string } from "zod";
const { useBrainStack } = brainstack;

// const lngDetector = new LanguageDetect();

// // let lang = "fr"
// const langCodes: { [x: string]: string } = {
//   fr: "fr-CA",
//   en: "en-US",
// };

// function getRandomSentence() {
//   const sentences = [
//     "Please give me a second to gather my thoughts.",
//     "I just need a moment to reflect on that.",
//     "Let me take a brief pause to consider.",
//     "Give me a second to mull it over.",
//     "I require a moment of contemplation.",
//     "I need a moment to process the information.",
//     "Allow me a moment to ponder and respond.",
//     "Let me think about it for a moment.",
//     "Please give me a moment to consider my response.",
//   ];

//   const randomIndex = Math.floor(Math.random() * sentences.length);
//   return sentences[randomIndex];
// }

type RecognitionState =
  | "Active Listening"
  | "Thinking"
  | "Speaking"
  | "Idle"
  | "Your Turn"
  | "Re-engage";

export const useBrainVoice = () => {
  const bstack = useBrainStack();
  const recognitionRef = useRef<any>(null);
  const [state, setState] = useState<RecognitionState>("Idle");
  const accumulatedSpeechRef = useRef<string>("");
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

    const utterance = new SpeechSynthesisUtterance(text);
    setState("Speaking");
    speechSynthesis.speak(utterance);
  }

  // const handleState = () => {
  //   bstack.log.info(`State Your Turn`);
  //   setState("Your Turn");
  // };

  // bstack.useOn(
  //   "communication.inform.expectation.active.listening.finished",
  //   handleState,
  //   [handleState]
  // );

  // const handleActiveListening = () => {
  //   bstack.log.info(`Active Listening`);
  //   setState("Active Listening");
  // };
  // bstack.useOn(
  //   "communication.request.accepted.expect.active.listening.activated",
  //   handleActiveListening,
  //   [handleActiveListening]
  // );

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    if (!recognitionRef.current) {
      throw new Error("Speech Recognition is not supported by this browser.");
    }

    recognitionRef.current.continuous = true;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.start();

    recognitionRef.current.onresult = async (event: any) => {
      bstack.log.info(event);

      const x = event.resultIndex;
      const newCommunication = event.results[x][0].transcript;
      const r = await nlp.process(newCommunication);
      bstack.log.info(r);
      // console.log(
      //   string(r?.actions?.[0])?.includes("communication.request.ui")
      // );
      // // dont add ui or commands to dialoges
      // if (string(r?.actions?.[0])?.includes("communication.request.ui")) {
      //   return;
      // }

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        accumulatedSpeechRef.current += event.results[i][0].transcript;
      }
      // evaluateTimeState(accumulatedSpeechRef.current);
    };

    recognitionRef.current.onend = () => {
      recognitionRef.current?.start(); // Restart recognition if it stops
    };

    return () => {
      recognitionRef.current?.abort(); // Cleanup on unmount
    };
  }, []);

  // const evaluateTimeState = async (transcript: string) => {
  //   // try {
  //   //   // const d = await nlp.process(transcript);
  //   //   bstack.log.info(d);
  //   //   bstack.log.info(state);
  //   // } catch (err: any) {
  //   //   console.error(`Error` + err?.message);
  //   // }
  //   if (state === "Your Turn" || state === "Idle") {
  //     // speak(
  //     //   "Thanks for sharing I can feel you. Give me a moment to think about how  I will structure my answer..."
  //     // );
  //     // setState("Thinking");
  //     // processSpeech(transcript);
  //   }

  //   // if (state === "Re-engage") {
  //   //   // implement logic here
  //   //   // Compute elapsed times for everyone. Last talk
  //   // }

  //   // if (state === 'Re-engage'){
  //   // implement logic here
  //   // Compute elapsed times for everyone. Last talk
  //   // }
  // };

  // // const processSpeech = async (accumulatedSpeech: string) => {
  //   const resultnlp = await nlp.process(accumulatedSpeech);
  //   if (resultnlp?.answer) {
  //     // speak(resultnlp?.answer);
  //     bstack.store.emit("sharing.basic.reasoning", {
  //       answer: resultnlp.answer,
  //       utterance: resultnlp.utterance,
  //     });
  //   } else {
  //     const feedback = getRandomSentence();
  //     // speak(feedback);
  //     bstack.store.emit("request.complex.reasoning", {
  //       feedback,
  //       utterance: accumulatedSpeech,
  //     });
  //   }
  // };

  return {
    state,
    speak,
    stopListening: () => recognitionRef.current?.stop(),
    startListening: () => recognitionRef.current?.start(),
    SpeakerToggle,
    MicToggle,
  };
};
