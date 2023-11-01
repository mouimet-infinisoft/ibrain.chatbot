"use client"

import { ChatWindow } from "@/components/ChatWindow";
import { useEffect } from "react";
import { getCookie, setCookie } from "../helpers/cookie";
import brainstack from '@/app/hooks/brainstack'
const { core, createEventHandlerMutatorShallow, getValue } = brainstack

export default function AgentsPage() {

  useEffect(()=>{
        setCookie('ID', "Martin")
        const { id, name } = getCookie('ID') ?? {}
        console.log('cookie ', getCookie('ID'))
        createEventHandlerMutatorShallow('me')({ name, id })
        console.log('cookie ', getValue(`me`))
  },[])

  return (
    <ChatWindow
      endpoint="api/chat/retrieval_agents"
      emptyStateComponent={<></>}
      showIngestForm={true}
      showIntermediateStepsToggle={true}
      placeholder={'How can i help?'}
      emoji="💡"
      titleText="iBrain AI Companion"
    ></ChatWindow>
  );
}
