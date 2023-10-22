using Microsoft.AspNetCore.SignalR;

namespace MyWebChess.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
            
        }
        public async Task SendChessMove(string message)
        {
            await Clients.All.SendAsync("ReceiveChessMove", message);

        }
        public override Task OnConnectedAsync()
        {
            string str = Context.ConnectionId;
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            string str = Context.ConnectionId;
            return base.OnDisconnectedAsync(exception);
        }
    }
}
