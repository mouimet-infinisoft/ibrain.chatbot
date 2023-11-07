"use client";

import ChatInput from "@/components/next-ui/ChatInput/ChatInput";
import MainCard from "@/components/next-ui/MainCard/MainCard";
import ToolContainer, {
  Tool,
} from "@/components/next-ui/SelectableToolContextPanel/ToolContainer";
import { useEffect, useState } from "react";
import { useBrainVoice } from "../../app/hooks/use.brain.voice";
import { useBrainStack } from "../../app/hooks/brainstack";
import { useDevTools } from "../../app/hooks/use.dev.tools";
import dynamic from "next/dynamic";
import { createBrainstack } from "@brainstack/react";
import { nlp } from "@/ai/nlp/init";
import router from "next/router";

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
  // const vstack = useBrainVoice();
  const [visible, setVisible] = useState(true);
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

  useDevTools();
  useEffect(() => {
    nlp.registerActionFunction(
      "communication.request.ui.footer.chat.close",
      (d: any) => {
        bstack.log.info("communication.request.ui.footer.chat.close", d);
        handleClose();
        return Promise.resolve(d);
      }
    );

    
    nlp.registerActionFunction("work.action.ui.navigate.to.home", (d:any) => {
      bstack.log.info("work.action.ui.navigate.to.home", d);
      bstack.store.emit("work.action.ui.navigate.to.home", d);
      router.push("/");
      return Promise.resolve(d); // Assuming the function should return a
    });


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
