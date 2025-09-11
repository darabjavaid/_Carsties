using System;
using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services;

public class CheckAuctionFinished : BackgroundService //singleton services: runs when application starts and stops when application shuts down
{
    private readonly ILogger<CheckAuctionFinished> _logger;
    private readonly IServiceProvider _serviceProvider;

    public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting check for finished auctions");

        stoppingToken.Register(() => _logger.LogInformation("auction check is stopping"));

        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctions(stoppingToken);
            await Task.Delay(5000, stoppingToken);
        }
    }

    private async Task CheckAuctions(CancellationToken stoppingToken)
    {
        var finishedAuctions = await DB.Find<Auction>()
        .Match(x => x.AuctionEnd <= DateTime.UtcNow)
        .Match(x => !x.Finished)
        .ExecuteAsync(stoppingToken);

        if (finishedAuctions.Count == 0) return;

        _logger.LogInformation($"===> found {finishedAuctions.Count} auctions that have completed");

        using var scope = _serviceProvider.CreateScope();
        var publishEndpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        foreach (var auction in finishedAuctions)
        {
            auction.Finished = true;
            await auction.SaveAsync(null, stoppingToken);

            var winningbid = await DB.Find<Bid>()
            .Match(x => x.AuctionId == auction.ID)
            .Match(y => y.BidStatus == BidStatus.Accepted)
            .Sort(x => x.Descending(y => y.Amount))
            .ExecuteFirstAsync();

            await publishEndpoint.Publish(new AuctionFinished
            {
                ItemSold = winningbid != null,
                AuctionId = auction.ID,
                Winner = winningbid?.Bidder,
                Amount = winningbid?.Amount,
                Seller = auction.Seller
            }, stoppingToken);
        }

    }
}
