var WebSocketServer = require('websocket').server;
var http = require('http');

const port = 3000;
let client1;
let client2;

var server = http.createServer();
server.listen(port, () => {
    console.log(`Server está executando na porta ${port}`);
});

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', (request) => {
    if (client1 == undefined) {
        client1 = request.accept(null, request.origin);
        console.log("Cliente 1 conectado!");
    }
    else {
        client2 = undefined;
        client2 = request.accept(null, request.origin);
        console.log("Cliente 2 conectado!");
    }

    client1.on('message', (message) => {
        if (message.type === 'utf8') {
            const colorJSON = JSON.parse(message.utf8Data);
            console.log(colorJSON);
            if (client2 != undefined) {
                client2.sendUTF(`{R: ${colorJSON["R"]}, G: ${colorJSON["G"]}, B: ${colorJSON["B"]}}`);
            }
        }
    });

    client1.on('close', () => {
        client1 = undefined;
        console.log("Conexão fechada (Client 1)");
    });

    if (client2 != undefined) {
        client2.on('close', () => {
            client2 = undefined;
            console.log("Conexão fechada (Client 2)");
        });
    }
});