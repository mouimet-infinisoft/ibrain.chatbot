import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import brainstack from '../app/hooks/brainstack'
const {core,getValue} =brainstack

export const welcomeChain = async () =>{
// We can construct an LLMChain from a PromptTemplate and an LLM.
const model = new OpenAI({ temperature: 0.7 });
const promptUnknownPerson = PromptTemplate.fromTemplate(
  "You will great "
);
const promptWelcomeBack = PromptTemplate.fromTemplate(
    "You will great "
  );
const isUnknownPerson = getValue(`me`) === undefined
const prompt = isUnknownPerson ? promptUnknownPerson: promptWelcomeBack
const chainA = new LLMChain({ llm: model, prompt });

// // The result is an object with a `text` property.
const resA = await chainA.call({});
console.log({ resA });
// { resA: { text: '\n\nSocktastic!' } }
}





// // Since this LLMChain is a single-input, single-output chain, we can also `run` it.
// // This convenience method takes in a string and returns the value
// // of the output key field in the chain response. For LLMChains, this defaults to "text".
// const resA2 = await chainA.run("colorful socks");
// console.log({ resA2 });
// // { resA2: '\n\nSocktastic!' }