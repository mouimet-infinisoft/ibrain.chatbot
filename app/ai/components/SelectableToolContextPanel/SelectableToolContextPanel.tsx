import React from "react";

export interface SelectableToolContextPanelProps {
  title: string;
  selected?: boolean;
  reverse?: boolean;
  icon?: string;
  handleClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  fadeOut?: boolean;
  fadeIn?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const SelectableToolContextPanel: React.FC<SelectableToolContextPanelProps> = ({
  title,
  selected = false,
  reverse = false,
  icon = "⭐️",
  handleClick,
  style = {},
  children,
}) => {
  const panelStyle: React.CSSProperties = {
    width: selected ? "800px" : "200px", // Increase width for the animation
    height: "75px",
    boxSizing: "border-box",
    borderRadius: "0.25rem",
    border: "2px solid white",
    marginRight: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: reverse ? "row-reverse" : "row",
    transition: "all 0.5s",
    position: "relative",
  };

  const newPanelStyle: React.CSSProperties = {
    width: selected ? "500px" : "0px", // Fixed width
    height: selected ? "500px" : "0px", // Set initial height to 0 when selected
    boxSizing: "border-box",
    borderRadius: "0.25rem",
    border: "2px solid white",
    marginRight: "1rem",
    display: "flex", //selected ? "flex" : "none",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: reverse ? "row-reverse" : "row",
    opacity: selected ? "100%":"0",
    transition: selected ? "all 0.3s 0.6s" : "all 0.3s", // Delay the height transition by 0.3s when not selected
    position: "absolute",
    bottom: selected ? -500 : 0,
    right: reverse ? 'unset':-16,
    left: reverse ? 0: 'unset' ,
    padding: "1rem"
  };

  const titleStyle: React.CSSProperties = {
    flex: 3,
    fontSize: "1.125rem",
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: "1.5rem",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: selected ? "2rem" : "1.5rem",
    color: selected ? "black" : "gray",
  };

  const iconContainerStyle: React.CSSProperties = {
    width: "45px",
    backgroundColor: "blue",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={{ ...panelStyle, ...style }} onClick={handleClick}>
      <h3 style={titleStyle}>{title}</h3>
      <span style={iconContainerStyle}>
        <span style={iconStyle}>{icon}</span>
      </span>
      <div style={{ ...newPanelStyle, ...style }}>{children}</div>
    </div>
  );
};

export default SelectableToolContextPanel;
