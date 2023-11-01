//@ts-nocheck
"use client"
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import BrainStackProvider and AgentsPage
const BrainStackProvider = dynamic(
  () => import('@/app/hooks/brainstack').then(mod => mod.default.BrainStackProvider),
  { ssr: false }  // Load BrainStackProvider only on the client side
);

const AgentsPage = dynamic(
  () => import('./retrieval_agents/page'),
  { ssr: false }  // Load AgentsPage only on the client side
);

export default function Home() {
  return (
    <BrainStackProvider>
      <AgentsPage />
    </BrainStackProvider>
  );
}