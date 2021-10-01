var WebSocketServer = require('websocket').server;
var http = require('http');
var moment = require('moment');

const port = 3000;

let server = http.createServer();
server.listen(port, () => {
    log(`Server está executando na porta ${port}`);
});

let wsServer = new WebSocketServer({
    httpServer: server
});

let connections = [];
let lastColor = '{"M": "0", "R": "10", "G": "0", "B": "0"}';

wsServer.on('request', (request) => {
    if (!clientIdIsAllowed(request.resourceURL.query["clientId"])) {
        request.reject();
        log('Conexão rejeitada. Origem: ' + request.origin);
        return;
    }

    let connection = request.accept(null, request.origin);
    connections.push(connection);
    log('Conexão aceita!');

    connection.sendUTF(lastColor);

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            lastColor = message.utf8Data;
            log('Mensagem recebida: ' + lastColor);
            connections.forEach((element) => { 
                element.sendUTF(lastColor);
            });
        }
        else {
            log('A mensagem deve ser enviada em UTF-8');
        }
    });

    connection.on('close', function (reasonCode, description) {
        log('Peer ' + connection.remoteAddress + ' desconectado.');
        connections = connections.filter((element) => { element != connection });
    });
});

function clientIdIsAllowed(clientId) {
    if (clientId == 0 || clientId == 1) {
        return true;
    }
}

function log(message){
    let date = moment().format('YYYY-MM-DD hh:mm:ss.SSS: ');
    console.log(date + message);
}