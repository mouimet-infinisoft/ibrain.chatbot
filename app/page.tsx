//@ts-nocheck
"use client";
import React from "react";
import dynamic from "next/dynamic";
import "../ai/nlp/init.js";
import { createBrainstack } from "@brainstack/react";

const d = dynamic<ReturnType<typeof createBrainstack>>(
  () => import("@/app/hooks/brainstack").then((mod) => mod.default),
  { ssr: false } // Load BrainStackProvider only on the client side
);

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

export default function Home() {
  return (
    <BrainStackProvider>
      <AgentsPage />
    </BrainStackProvider>
  );
}
