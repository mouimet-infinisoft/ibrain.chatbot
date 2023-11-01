import { DynamicTool } from 'langchain/tools';
import brainstack from '@/app/hooks/brainstack';
const { core } = brainstack

export const aiExpectationTool = new DynamicTool({
    name: "ai_expectation",
    description: "Tool to detect if the AI is expecting an answer or asking a question. The input argument is the explaination of the expectation as a string. For example: `AI asked question whats your name to user and waits for an answer.",
    func: async (args) => {
        core.log.info('ai.expecting.answer', { expectation: args })
        core.store.emit('ai.expecting.answer', { expectation: args })
        return "The AI is expecting an answer from the user and is waiting.";
    }
});
