"use client";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useChat } from "ai/react";
import { useRef, useState, ReactElement, useEffect, useMemo } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { IntermediateStep } from "./IntermediateStep";
import LanguageDetect from 'languagedetect'
const lngDetector = new LanguageDetect();

let lang = "fr"
const langCodes: { [x: string]: string } = {
  fr: "fr-CA",
  en: "en-US"
}

function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  lngDetector.setLanguageType('iso2')
  lang = lngDetector.detect(text, 1)?.[0]?.[0] ?? 'en'
  utterance.lang = lang
  speechSynthesis.speak(utterance);
}

function stripMarkdown(code: string) {
  let text = code.replace(/`{3}[\s\S]*?`{3}/g, ''); // Remove triple backtick code blocks
  text = text.replace(/`[^`]+`/g, ''); // Remove inline code blocks
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, (match, label) => label);

  return text.trim();
}

export function ChatWindow(props: {
  endpoint: string,
  emptyStateComponent: ReactElement,
  placeholder?: string,
  titleText?: string,
  emoji?: string;
  showIngestForm?: boolean,
  showIntermediateStepsToggle?: boolean,
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { endpoint, emptyStateComponent, placeholder, titleText = "An LLM", showIngestForm, showIntermediateStepsToggle, emoji } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [isSpeak, setIsSpeak] = useState(true);
  const [intermediateStepsLoading, setIntermediateStepsLoading] = useState(false);
  const ingestForm = showIngestForm && <UploadDocumentsForm></UploadDocumentsForm>;
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input type="checkbox" id="show_intermediate_steps" name="show_intermediate_steps" checked={showIntermediateSteps} onChange={(e) => setShowIntermediateSteps(e.target.checked)}></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const speakerToggle = (
    <div>
      <input type="checkbox" id="show_speak" name="show_speak" checked={isSpeak} onChange={(e) => setIsSpeak(e.target.checked)}></input>
      <label htmlFor="show_speak"> Speak</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});
  const submitRef = useRef<any>(null)
  const timerRef = useRef<any>(null)
  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
    useChat({
      api: endpoint,
      onResponse(response) {
        const sourcesHeader = response.headers.get("x-sources");
        const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
        const messageIndexHeader = response.headers.get("x-message-index");
        if (sources.length && messageIndexHeader !== null) {
          setSourcesForMessages({ ...sourcesForMessages, [messageIndexHeader]: sources });
        }
      },
      onError: (e) => {
        toast(e.message, {
          theme: "dark"
        });
      },
      onFinish(message) {
        if (isSpeak) {
          console.log(message?.content)
          console.log(stripMarkdown(message?.content))
          recognitionRef.current.stop()
          speak(stripMarkdown(message?.content))
        }
      }
    });

  let SpeechRecognition = useRef<any>(null)
  const recognitionRef = useRef<any>(null)
  const recognizing = useRef<any>(false)
  const started = useRef<any>(false)


  useEffect(() => {
    // Weird hack to fix SSR build problem
    if (typeof window !== 'undefined') {
      SpeechRecognition.current = (window as any)?.webkitSpeechRecognition || (window as any)?.SpeechRecognition
      recognitionRef.current = new SpeechRecognition.current()
    }

    timerRef.current = setInterval(() => {
      try {
        if (!started.current) {
          recognitionRef.current.start()
        }
      } catch (e) { console.error(e) }
    }, 1000)
    return () => { clearInterval(timerRef.current) }
  }, [])

  function startListening() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      recognitionRef.current.continuous = true;

      // Event handler for speech recognition results
      recognitionRef.current.onresult = function (event: any) {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const language = event.results[i][0].lang;
          console.log(transcript, language, event);
          setInput(prev => prev + " " + transcript);
        }
      };

      recognitionRef.current.onspeechstart = function (event: any) {
        recognitionRef.current.lang = langCodes?.[lang] ?? "en-US"
        console.log('ON speech start');
        recognizing.current = true;
      }

      recognitionRef.current.onspeechend = function (event: any) {
        console.log('ON speech end');
        recognizing.current = false;
        recognitionRef.current.stop()
      }

      // Event handler for language detection
      recognitionRef.current.onstart = function () {
        started.current = true;
        console.log('ON audio start');
        if (speechSynthesis.speaking) {
          console.log('AI Speaking: stoping recognition');
          recognitionRef.current.stop()
        } else {
          console.log('Audio capturing started');
        }

      };



      recognitionRef.current.onend = function () {
        started.current = false;
        console.log('Audio capturing ended');
        submitRef.current?.click()
        setInput("");
      };

    } else {
      alert('Web Speech API is not supported in this browser.');
    }
  }

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return;
    }
    if (!showIntermediateSteps) {
      handleSubmit(e);
      // Some extra work to show intermediate steps properly
    } else {
      setIntermediateStepsLoading(true);
      setInput("");
      const messagesWithUserReply = messages.concat({ id: messages.length.toString(), content: input, role: "user" });
      setMessages(messagesWithUserReply);
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true
        })
      });
      const json = await response.json();
      setIntermediateStepsLoading(false);
      if (response.status === 200) {
        // Represent intermediate steps as system messages for display purposes
        const intermediateStepMessages = (json.intermediate_steps ?? []).map((intermediateStep: AgentStep, i: number) => {
          return { id: (messagesWithUserReply.length + i).toString(), content: JSON.stringify(intermediateStep), role: "system" };
        });
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise(resolve => setTimeout(resolve, 1))// + Math.random() * 1000));
        }
        setMessages([...newMessages, { id: (newMessages.length + intermediateStepMessages.length).toString(), content: json.output, role: "assistant" }]);
      } else {
        if (json.error) {
          toast(json.error, {
            theme: "dark"
          });
          throw new Error(json.error);
        }
      }
    }
  }

  useEffect(() => {
    startListening()
  }, [])

  return (
    <div className={`flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden ${(messages.length > 0 ? "border" : "")}`}>
      <h2 className={`${messages.length > 0 ? "" : "hidden"} text-2xl`}>{emoji} {titleText}</h2>
      {messages.length === 0 ? emptyStateComponent : ""}
      <div
        className="flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out  min-h-[70%]"
        ref={messageContainerRef}
      >
        {messages.length > 0 ? (
          [...messages]
            .reverse()
            .map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return (m.role === "system" ? <IntermediateStep key={m.id} message={m}></IntermediateStep> : <ChatMessageBubble key={m.id} message={m} aiEmoji={emoji} sources={sourcesForMessages[sourceKey]}></ChatMessageBubble>)
            })
        ) : (
          ""
        )}
      </div>

      {/* {messages.length === 0 && ingestForm} */}

      <form onSubmit={sendMessage} className="flex w-full flex-col">
        <div className="flex gap-1">
          {intemediateStepsToggle}
          {speakerToggle}
        </div>
        <div className="flex w-full mt-4 gap-1 flex-wrap">
          <input
            className="grow mr-8 p-4 rounded"
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
          />
          <button ref={submitRef} type="submit" className="shrink-0 px-8 py-4 bg-sky-600 rounded w-28">
            <div role="status" className={`${(chatEndpointIsLoading || intermediateStepsLoading) ? "" : "hidden"} flex justify-center`}>
              <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin dark:text-white fill-sky-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <span className={(chatEndpointIsLoading || intermediateStepsLoading) ? "hidden" : ""}>Send</span>
          </button>
          <button type='button' className="shrink-0 px-8 py-4 bg-sky-600 rounded w-28" onClick={startListening}>Talk</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
