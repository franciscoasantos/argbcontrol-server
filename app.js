var WebSocketServer = require('websocket').server;
var http = require('http');

const port = 3000;

var server = http.createServer();
server.listen(port, () => {
    console.log(`Server está executando na porta ${port}`);
});

var wsServer = new WebSocketServer({
    httpServer: server
});

var connections = [];

wsServer.on('request', (request) => {
    if (!clientIdIsAllowed(request.resourceURL.query["clientId"])) {
        request.reject();
        console.log((new Date()) + ' Conexão rejeitada. Origem: ' + request.origin);
        return;
    }
    var connection = request.accept(null, request.origin);

    connections.push(connection);

    console.log((new Date()) + ' Conexão aceita!');
    //console.log(request.resourceURL.query["clientId"]);
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Mensagem recevida: ' + message.utf8Data);
            connections.forEach((element) => {
                element.sendUTF(message.utf8Data);
            });
        }
        else {
            console.log('A mensagem deve ser enviada em UTF-8');
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' desconectado.');
    });
});

function clientIdIsAllowed(clientId) {
    if (clientId == 0 || clientId == 1) {
        return true;
    }
}