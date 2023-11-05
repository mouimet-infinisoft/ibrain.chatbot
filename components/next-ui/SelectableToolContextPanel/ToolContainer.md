 # ToolContainer Component

The ToolContainer component is a container that holds multiple tools.

## Props

The ToolContainer component accepts the following props:

- `title` (string, optional): The title of the container.
- `children` (React.ReactNode, required): The tools to be rendered inside the container.

## Usage

```jsx
import React from "react";
import ToolContainer from "./ToolContainer";

const MyComponent: React.FC = () => {
  return (
    <div>
      <ToolContainer title="My Tool Container">
        {/* Tools */}
      </ToolContainer>
    </div>
  );
};

export default MyComponent;
```