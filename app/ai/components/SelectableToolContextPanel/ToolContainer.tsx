"use client";
import React, { useEffect, useState } from "react";
import SelectableToolContextPanel from "./SelectableToolContextPanel";
import "./styles.css";
import { useBrainStack } from "@/app/hooks/brainstack";

export interface Tool {
  name: string;
  render: () => React.ReactNode;
  reverse: boolean;
}

export interface ToolContainerProps {
  tools: Tool[];
  reverse?: boolean;
}

const ToolContainer: React.FC<ToolContainerProps> = ({
  tools,
  reverse = false,
}) => {
  const [selectedTool, setSelectedTool] = useState("");
  const bstack = useBrainStack();

  const handleToolSelect = (tool: string) => {
    setSelectedTool((prev) => (prev === tool ? "" : tool));
  };
  const handleShowConfig = () => {
    setSelectedTool("Configuration");
  };
  const handleHideConfig = () => {
    setSelectedTool("");
  };

  bstack.useOn("communication.request.ui.main.panel.configuration.open", handleShowConfig, [
    handleShowConfig,
  ]);
  bstack.useOn("communication.request.ui.main.panel.configuration.close", handleHideConfig, [
    handleHideConfig,
  ]);

  return (
    <div
      className="ToolContainer"
      style={{
        display: "flex",
        alignItems: reverse ? "flex-end" : "flex-start",
      }}
    >
      {tools.map((tool: Tool, index: number) => (
        <SelectableToolContextPanel
          key={tool.name}
          title={tool.name}
          selected={tool.name === selectedTool}
          handleClick={() => handleToolSelect(tool.name)}
          style={{ order: tool.name === selectedTool ? 1 : index + 2 }}
          reverse={tool.reverse}
        >
          {tool.render()}
        </SelectableToolContextPanel>
      ))}
    </div>
  );
};

export default ToolContainer;
