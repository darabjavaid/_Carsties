using System;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
    public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
    {
        Console.WriteLine("----> Consuming Auction Created Fault Event: " + context.Message.Exceptions[0].Message);

        // Handle the fault, e.g., log it or take corrective action
        // This could involve notifying an admin, retrying the operation, etc.

        var exception = context.Message.Exceptions.First();

        if (exception.ExceptionType == "System.ArgumentException")
        {
            context.Message.Message.Model = "FooBar";
            await context.Publish(context.Message.Message);
            Console.WriteLine("----> Retrying Auction Created with modified model: " + context.Message);
        }
        else
        {
            Console.WriteLine("----> No retry for non-argument exception - update error dashboard somewhere" );
        }
    }
}