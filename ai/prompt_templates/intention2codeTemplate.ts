import { PromptTemplate } from "langchain/prompts";

export const intention2codeTemplate = new PromptTemplate({
  template: `You will generate code based on the intentions, requirements, example and use the template provided.
Intentions:
{intention}

Requirements
{requirements}

Example:
{example}

Template:
{template} 
`,
  inputVariables: ["intention", "requirements", "example", "template"],
});


