import { createServer } from 'http';
import log from './logger.js';

function createHttpServer() {
    const port = 3000;
    const httpServer = createServer();

    function start() {
        log('httpserver', 'Iniciando servidor http...');
        httpServer.listen(port, () => {
            log('httpserver', `O servidor está executando na porta ${port}`);
        });
    }

    function stop() {
        log('httpserver', 'Parando servidor http...')
        httpServer.close();
    }

    return {
        httpServer,
        start,
        stop
    }
}

export default createHttpServer;