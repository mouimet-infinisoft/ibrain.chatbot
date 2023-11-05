# SelectableToolContextPanel Component

The SelectableToolContextPanel component is a component that represents a selectable panel with a title, an icon, and a collapsible content panel.

## Props

The SelectableToolContextPanel component accepts the following props:

- `title` (string, required): The title of the panel.
- `selected` (boolean, optional): Determines if the panel is selected. Default value is `false`.
- `reverse` (boolean, optional): Determines the direction of the panel. Set to `true` to reverse the direction. Default value is `false`.
- `icon` (string, optional): The icon to display in the panel. Default value is ⭐️.
- `handleClick` (React.MouseEventHandler<HTMLDivElement>, optional): The event handler for the panel click event.
- `style` (React.CSSProperties, optional): Additional CSS styles to apply to the panel.
- `children` (React.ReactNode, required): The content to display inside the collapsible panel.

## Usage

```jsx
import React from "react";
import SelectableToolContextPanel from "./SelectableToolContextPanel";

const MyComponent: React.FC = () => {
  return (
    <div>
      <SelectableToolContextPanel
        title="My Panel"
        selected={true}
        reverse={false}
        icon="⭐️"
        handleClick={handlePanelClick}
        style={{ backgroundColor: "lightblue" }}
      >
        {/* Content */}
      </SelectableToolContextPanel>
    </div>
  );
};

export default MyComponent;
```

In the above example, the SelectableToolContextPanel component is used to create a selectable panel with the title "My Panel". The panel is selected, has a normal direction, displays a star icon, and has a click event handler. The background color of the panel is set to light blue.
