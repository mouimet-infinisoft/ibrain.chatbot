"use client"
//@ts-nocheck
import React from 'react'
import AgentsPage from "./retrieval_agents/page";
import brainstack from '@/app/hooks/brainstack'
const { BrainStackProvider } = brainstack


export default function Home() {
  return (
    <>
      <BrainStackProvider>
        <AgentsPage />
      </BrainStackProvider>
    </>
  );
}
