"use client"
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { Public_Sans } from "next/font/google";
import { Client } from "../ai/cognitives/understanding_strategies/packages/@brainstack/voice/src/implementation";
import { nlp } from "@/ai/nlp/init";
// import { Navbar } from "@/components/Navbar";
// import dynamic from "next/dynamic";
import "../ai/nlp/init.js";
import { createBrainstack, TBrainstackOptions } from "@brainstack/react";
import Link from "next/link.js";
import React, { createContext } from "react";
import { setCookie, getCookie } from "../../ibrain.chat/src/helpers/cookie";

const options = {
  eventHubOptions: [],
  stateOptions: {
    search: "",
    me: getCookie("ID"),
    // Wait queue for user feedback
    wait: [],
  },
  loggerOptions: [5],
} as unknown as TBrainstackOptions;

export const {
  BrainStackProvider,
  useBrainStack,
  core,
  getValue,
  createEventHandlerMutator,
  createEventHandlerMutatorShallow,
} = createBrainstack(options);

// const d = dynamic<ReturnType<typeof createBrainstack>>(
//   () => import("@/app/hooks/brainstack").then((mod) => mod.default),
//   { ssr: false } // Load BrainStackProvider only on the client side
// );

// const BrainStackProvider = dynamic(
//   () =>
//     import("@/app/hooks/brainstack").then(
//       (mod) => mod.default.BrainStackProvider
//     ),
//   { ssr: false } // Load BrainStackProvider only on the client side
// );
if (typeof window === 'undefined'){
return ;
}


export const iBrainVoice = new Client(core, nlp);
iBrainVoice.startListening();

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>iBrain Chatbot</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta name="description" content="iBrain AI Companion" />
        <meta property="og:title" content="iBrain Chatbot" />
        <meta property="og:description" content="iBrain AI Companion" />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="iBrain AI Companion" />
        <meta name="twitter:description" content="iBrain AI Companion" />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body className={publicSans.className}>
        <div className="flex flex-col p-4 md:p-12 h-[100vh]">
          <BrainStackProvider>
            <Navbar></Navbar>
            {children}
          </BrainStackProvider>
        </div>
        <script src="/bundle.js" defer></script>
      </body>
    </html>
  );
}