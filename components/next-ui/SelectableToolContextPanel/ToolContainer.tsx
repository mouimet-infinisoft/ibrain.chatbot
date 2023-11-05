"use client";
import React, { useEffect, useState } from "react";
import SelectableToolContextPanel from "./SelectableToolContextPanel";
import "./styles.css";

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

  const handleToolSelect = (tool: string) => {
    setSelectedTool((prev) => (prev === tool ? "" : tool));
  };

  useEffect(() => {
    const handleShowConfig = () => {
      setSelectedTool("Config");
    };
    const handleHideConfig = () => {
      setSelectedTool("");
    };
    document.addEventListener(
      "main.panel.configuration.open",
      handleShowConfig
    );
    document.addEventListener(
      "main.panel.configuration.close",
      handleHideConfig
    );

    return () => {
      document.removeEventListener(
        "main.panel.configuration.open",
        handleShowConfig
      );
      document.removeEventListener(
        "main.panel.configuration.close",
        handleHideConfig
      );
    };
  }, []);

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
