 # ChatInput Component

The ChatInput component is a reusable input field for a chat application.

## Props

The ChatInput component accepts the following props:

- `visible` (boolean, required): Determines the visibility of the chat input. Set to `true` to show the input, and `false` to hide it.

## Usage

```jsx
import React, { useState } from 'react';
import ChatInput from './ChatInput';

const MyComponent: React.FC = () => {
  const [showChatInput, setShowChatInput] = useState(false);

  const toggleChatInput = () => {
    setShowChatInput(!showChatInput);
  };

  return (
    <div>
      <button onClick={toggleChatInput}>Toggle Chat Input</button>
      <ChatInput visible={showChatInput} />
    </div>
  );
};

export default MyComponent;
```