import createCore from './core.js';
import log from './logger.js';


const core = createCore();

try{
    core.start();
} catch (error) {
    log('index', 'Erro na execução!');
    console.log(error);
    core.stop();
}

