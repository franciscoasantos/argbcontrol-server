var WebSocketServer = require('websocket').server;
var http = require('http');

const port = 3000;

var server = http.createServer();
server.listen(port, () => {
    console.log(`Server está executando na porta ${port}`);
});

wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', (request) => {
    let state = false;

    let client = request.accept(null, request.origin);

    client.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log(message.utf8Data);
        }
    });
    let r = 255, g = 0, b = 0;
    let interval = setInterval(function () {
        if (r > 0 && b == 0) {
            r--;
            g++;
        }
        if (g > 0 && r == 0) {
            g--;
            b++;
        }
        if (b > 0 && g == 0) {
            r++;
            b--;
        }
        //client.sendUTF(`{R: ${r}, G: ${g}, B: ${b}}`);
        client.sendUTF(`{R: ${getRandom(0,255)}, G: ${getRandom(0,255)}, B: ${getRandom(0,255)}}`);
    }, 100);

    client.on('close', () => {
        console.log("Conexão fechada");
        clearInterval(interval);
    });
});

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}