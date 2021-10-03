import { server as WebSocketServer } from 'websocket';
import log from './logger.js';

function createWebSocket(httpServer) {
    const wsServer = new WebSocketServer({ httpServer: httpServer });
    let connections = [];
    let lastColor = {};

    function start() {
        log('websocketserver', 'Iniciando servidor webSocket...');
        lastColor = '{"M": "0", "R": "10", "G": "0", "B": "0"}';

        wsServer.on('request', (request) => {
            if (!clientIdIsAllowed(request.resourceURL.query["clientId"])) {
                request.reject();
                log('websocketserver', 'Conexão rejeitada. Origem: ' + request.origin);
                return;
            }

            let connection = request.accept(null, request.origin);
            connections.push(connection);
            log('websocketserver', 'Conexão aceita!');

            connection.sendUTF(lastColor);

            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    lastColor = message.utf8Data;
                    log('websocketserver', 'Mensagem recebida: ' + lastColor);
                    connections.forEach((element) => {
                        element.sendUTF(lastColor);
                    });
                }
                else {
                    log('websocketserver', 'A mensagem deve ser enviada em UTF-8');
                }
            });

            connection.on('close', function (reasonCode, description) {
                log('websocketserver', 'Peer ' + connection.remoteAddress + ' desconectado.');
                connections = connections.filter((element) => { element != connection });
            });
        });

        function clientIdIsAllowed(clientId) {
            if (clientId == 0 || clientId == 1) {
                return true;
            }
        }
    }

    function stop() {
        log('websocketserver', 'Parando servidor webSocket...')
        wsServer.closeAllConnections();
    }

    return {
        start,
        stop
    }
}

export default createWebSocket;