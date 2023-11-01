import { ConversationChain } from "langchain/chains";

export type TWaitItem = {
    timestart: Date,
    expectations: ConversationChain,
    nextAction: ConversationChain
    retry: ConversationChain
    delay: number
}

export const WaitItem = ({ timestart, expectations, nextAction, delay, retry }: TWaitItem) => {
    const duration = () => new Date().getTime() - timestart.getTime()
    const validate = async (result: any) => {
        const r = await expectations.run(result)
        
        if (r.includes("COMPLETE")) {
            clear()
            nextAction.run(``);
        } else {

            // retry()
        }
    }

    const expiration = setTimeout(() => {
        retry.withRetry()
    }, delay)

    const clear = () => clearTimeout(expiration)

    return {
        duration,
        validate,
        clear
    }
}
