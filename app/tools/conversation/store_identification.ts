import { DynamicTool } from 'langchain/tools';
import brainstack from '@/app/hooks/brainstack';
import { getCookie, setCookie } from '@/app/helpers/cookie';
const { core, createEventHandlerMutatorShallow, getValue } = brainstack

export const storeIdentificationTool = new DynamicTool({
    name: "user_identification",
    description: "Useful when user share his name, it will be stored to remember. The input argument is the name of the user as a string. For example: `John Deer",
    func: async (args) => {
        // console.log('user.identification', { args })
        // setCookie('ID', args)
        // const { id, name } = getCookie('ID') ?? {}
        // console.log('cookie ', getCookie('ID'))
        // createEventHandlerMutatorShallow('me')({ name, id })
        // console.log('cookie ', getValue(`me`))

        return "You are glad to get to know each other.";
    }
});
