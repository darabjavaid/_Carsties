using System;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class BidPlacedConsumer: IConsumer<BidPlaced>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public BidPlacedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    public Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("BidPlaced event received in NotificationService");
        return _hubContext.Clients.All.SendAsync("BidPlaced", context.Message);
    }
}

