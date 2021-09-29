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
    console.log((new Date()) + ' Conexão aceita!');
    connections.push(connection);

    sendColorToClients(connections, lastColor)

    //console.log(request.resourceURL.query["clientId"]);
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log((new Date()) + ' Mensagem recebida: ' + message.utf8Data);
            lastColor = message.utf8Data;
            sendColorToClients(connections, lastColor)
        }
        else {
            console.log((new Date()) + ' A mensagem deve ser enviada em UTF-8');
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' desconectado.');
        connections = connections.filter((element) =>{
            return element != connection;
        });
    });
});

function clientIdIsAllowed(clientId) {
    if (clientId == 0 || clientId == 1) {
        return true;
    }
}

function sendColorToClients(conn, color){
    conn.forEach((element) => {
        element.sendUTF(color);
    });
}