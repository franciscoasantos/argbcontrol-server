using WebSocketSharp;
using WebSocketSharp.Server;


WebSocketServer server = new ("ws://127.0.0.1:5000");
server.AddWebSocketService<Echo>("/Echo");
server.Start();
Console.ReadKey();
server.Stop();

public class Echo : WebSocketBehavior {
    protected override void OnMessage(MessageEventArgs e)
    {
        Console.WriteLine("Mensagem recebida: " + e.Data + "do server");
        Sessions.Broadcast(e.Data);
    }
}
