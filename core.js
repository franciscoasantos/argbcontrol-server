import createHttpServer from './httpServer.js'
import createWebSocket from './webSocketServer.js'
import log from './logger.js';

function createCore() {
    const httpServer = createHttpServer();
    const webSocket = createWebSocket(httpServer.httpServer);

    function start() {
        log('core', 'Iniciando servidores:')
        httpServer.start();
        webSocket.start();
        log('core', 'Servidores iniciados!');
    }

    function stop() {
        log('core', 'Parando servidores:')
        webSocket.stop();
        httpServer.stop();
        log('core', 'Servidores parados!')
    }

    return {
        start,
        stop
    }
}

export default createCore;