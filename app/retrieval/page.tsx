"use client";
import ChatInput from "@/components/next-ui/ChatInput/ChatInput";
import ToolContainer, {
  Tool,
} from "@/components/next-ui/SelectableToolContextPanel/ToolContainer";
import { useState } from "react";

const leftSide: Tool[] = [
  { name: "History", render: () => <h1>History</h1>, reverse: false },
  { name: "Tool", render: () => <h1>Tool</h1>, reverse: false },
  { name: "Config", render: () => <h1>Config</h1>, reverse: false },
];

const rightSide: Tool[] = [
  { name: "HIstory", render: () => <h1>History</h1>, reverse: true },
  { name: "Tool", render: () => <h1>Tool</h1>, reverse: true },
  { name: "Config", render: () => <h1>Config</h1>, reverse: true },
];

export default function AgentsPage() {
  const [visible, setVisible] = useState(true)
  return (
    <>
      <div style={{ display: "flex", alignContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <ToolContainer tools={leftSide} />
        </div>
        <div style={{ flex: 1 }}>
          <ToolContainer tools={rightSide} reverse />
        </div>
      </div>
      <div>
        <button onClick={()=>{setVisible(prev => !prev)}}>Toggle button</button>
        <ChatInput visible={visible}/>
      </div>
    </>
  );
}
