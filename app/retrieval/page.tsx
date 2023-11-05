"use client";
import ChatInput from "@/components/next-ui/ChatInput/ChatInput";
import MainCard from "@/components/next-ui/MainCard/MainCard";
import ToolContainer, {
  Tool,
} from "@/components/next-ui/SelectableToolContextPanel/ToolContainer";
import { useEffect, useState } from "react";
import { useBrainVoice } from "../hooks/use.brain.voice";

const leftSide: Tool[] = [
  { name: "History", render: () => <h1>History</h1>, reverse: false },
  { name: "Tool", render: () => <h1>Tool</h1>, reverse: false },
  { name: "Config", render: () => <h1>Config</h1>, reverse: false },
];

const rightSide: Tool[] = [
  { name: "Task1", render: () => <h1>Task1</h1>, reverse: true },
  { name: "Task2", render: () => <h1>Task2</h1>, reverse: true },
  { name: "Task3", render: () => <h1>Task3</h1>, reverse: true },
];

export default function AgentsPage() {
  const d = useBrainVoice();
  const [visible, setVisible] = useState(true);
  const handleOpen = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  useEffect(() => {
    document.addEventListener("main.footer.chat.open", handleOpen);
    document.addEventListener("main.footer.chat.close", handleClose);

    return () => {
      document.removeEventListener("main.footer.chat.open", handleOpen);
      document.removeEventListener("main.footer.chat.close", handleClose);
    };
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
        {/* <button
          onClick={() => {
            setVisible((prev) => !prev);
          }}
        >
          Toggle button
        </button> */}
        <ChatInput visible={visible} />
      </div>
    </>
  );
}
