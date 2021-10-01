var WebSocketServer = require('websocket').server;
var http = require('http');

const port = 3000;

let server = http.createServer();
server.listen(port, () => {
    console.log(`Server está executando na porta ${port}`);
});

let wsServer = new WebSocketServer({
    httpServer: server
});

let connections = [];
let lastColor = '{"M": "0", "R": "10", "G": "0", "B": "0"}';

wsServer.on('request', (request) => {
    if (!clientIdIsAllowed(request.resourceURL.query["clientId"])) {
        request.reject();
        console.log((new Date()) + ' Conexão rejeitada. Origem: ' + request.origin);
        return;
    }

    let connection = request.accept(null, request.origin);
    connections.push(connection);
    console.log((new Date()) + ' Conexão aceita!');

    connection.sendUTF(lastColor);

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            lastColor = message.utf8Data;
            console.log((new Date()) + ' Mensagem recebida: ' + lastColor);
            connections.forEach((element) => { 
                element.sendUTF(lastColor);
            });
        }
        else {
            console.log((new Date()) + ' A mensagem deve ser enviada em UTF-8');
        }
    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' desconectado.');
        connections = connections.filter((element) => { element != connection });
    });
});

function clientIdIsAllowed(clientId) {
    if (clientId == 0 || clientId == 1) {
        return true;
    }
}