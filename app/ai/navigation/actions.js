import { core } from '../../hooks/brainstack'
import { nlp } from '../../../ai/nlp/init'
import { useRouter } from 'next/navigation';

export const useInitialize = () => {
    const router = useRouter();

    const initialize = () => {
        nlp.registerActionFunction('work.action.ui.navigate.to.home', (d) => {
            core.log.info('work.action.ui.navigate.to.home', d);
            core.store.emit('work.action.ui.navigate.to.home', d);
            alert(":kjlkjhlkhkj")
            router.push('/');
            return Promise.resolve(d); // Assuming the function should return a 
        });

        nlp.registerActionFunction('work.action.ui.navigate.to.chat', (d) => {
            core.log.info('work.action.ui.navigate.to.chat', d);
            core.store.emit('work.action.ui.navigate.to.chat', d);
            router.push('/retrieval');
            return Promise.resolve(d); // Assuming the function should return a 
        });
    }

    return {
        initialize
    }
}
