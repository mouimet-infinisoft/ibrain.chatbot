"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { useEffect } from "react";
import { getCookie, setCookie } from "../../app/helpers/cookie";
import brainstack from "@/app/hooks/brainstack";
import { nlp } from "../../ai/nlp/init";
import { useBrainVoice } from "../../app/hooks/use.brain.voice";
const { core, useBrainStack, createEventHandlerMutatorShallow, getValue } =
  brainstack;

export default function AgentsPage() {
  const bstack = useBrainStack();
  const {state, startListening} = useBrainVoice()

  bstack.useOn('ibrain.voice.message', async (payload:any)=>{
    console.log(payload)
    const response = await nlp.process("en", payload?.message);
    console.log(response);
  },[nlp])

  useEffect(() => {
    setCookie("ID", "Martin");
    const { id, name } = getCookie("ID") ?? {};
    console.log("cookie ", getCookie("ID"));
    createEventHandlerMutatorShallow("me")({ name, id });
    console.log("cookie ", getValue(`me`));
  }, []);


  useEffect(() => {
    const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    if (devTools) {
      // Send initial state
      devTools.connect().init(core.store.getState());
      core.log.info(`Connected to Redux Devtools`);

      // Subscribe to state changes
      core.store.on(/.*/, ({ event, ...payload }:any) => {
        core.log.info(event, payload);
        devTools.send({ type: event, payload }, core.store.getState(), {
          trace: true,
          name: 'brainstack iBrain',
        });
      });

      return () => {
        devTools.disconnect();
        core.log.info(`Disconnected from Redux Devtools`);
      };
    }
  }, []);

  return (
    <ChatWindow
      endpoint="api/chat/retrieval_agents"
      emptyStateComponent={<></>}
      showIngestForm={true}
      showIntermediateStepsToggle={true}
      placeholder={"How can i help?"}
      emoji="💡"
      titleText="iBrain AI Companion"
    ></ChatWindow>
  );
}
