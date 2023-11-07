"use client";

import ChatInput from "@/components/next-ui/ChatInput/ChatInput";
import MainCard from "@/components/next-ui/MainCard/MainCard";
import ToolContainer, {
  Tool,
} from "@/components/next-ui/SelectableToolContextPanel/ToolContainer";
import { useEffect, useState } from "react";
import { useBrainVoice } from "../../hooks/use.brain.voice";
import { useBrainStack } from "../../hooks/brainstack";
import { useDevTools } from "../../hooks/use.dev.tools";
import dynamic from "next/dynamic";
import { createBrainstack } from "@brainstack/react";
import { nlp } from "@/ai/nlp/init";
import { useInitialize } from "../navigation/actions";
// import { useRouter } from "next/router";

const leftSide: Tool[] = [
  { name: "History", render: () => <h1>History</h1>, reverse: false },
  { name: "Tool", render: () => <h1>Tool</h1>, reverse: false },
  {
    name: "Configuration",
    render: () => <h1>Configuration</h1>,
    reverse: false,
  },
];

const rightSide: Tool[] = [
  { name: "Task1", render: () => <h1>Task1</h1>, reverse: true },
  { name: "Task2", render: () => <h1>Task2</h1>, reverse: true },
  { name: "Task3", render: () => <h1>Task3</h1>, reverse: true },
];

export default function AgentsPage() {
  const bstack = useBrainStack();
  const vstack = useBrainVoice();
  const [visible, setVisible] = useState(true);
  const { initialize } = useInitialize();
  // const router = useRouter();
  const handleOpen = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };

  const d = dynamic<ReturnType<typeof createBrainstack>>(
    //@ts-ignore
    () => import("@/app/hooks/brainstack").then((mod) => mod.default),
    { ssr: false } // Load BrainStackProvider only on the client side
  );

  // useDevTools();
  useEffect(() => {
    initialize()
    nlp.registerActionFunction(
      "communication.request.ui.footer.chat.close",
      (d: any) => {
        bstack.log.info("communication.request.ui.footer.chat.close", d);
        handleClose();
        return Promise.resolve(d);
      }
    );
    nlp.registerActionFunction(
      "communication.request.ui.footer.chat.open",
      (d: any) => {
        bstack.log.info("communication.request.ui.footer.chat.open", d);
        handleOpen();
        return Promise.resolve(d);
      }
    );
  }, []);

  return (
    <>
      <div style={{ display: "flex", alignContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <ToolContainer tools={leftSide} />
        </div>
        <div style={{ flex: "1 1" }}>
          <MainCard />
        </div>
        <div style={{ flex: 1 }}>
          <ToolContainer tools={rightSide} reverse />
        </div>
      </div>
      <div>
        <ChatInput visible={visible} />
      </div>
    </>
  );
}
