using System;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public AuctionCreatedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    public Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("AuctionCreated event received in NotificationService");
        return _hubContext.Clients.All.SendAsync("AuctionCreated", context.Message);
    }
}
