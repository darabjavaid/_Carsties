

using MassTransit;
using Polly;
using Polly.Extensions.Http;
using SearchService.Consumers;
using SearchService.Data;
using SearchService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var assemblies = AppDomain.CurrentDomain.GetAssemblies();
builder.Services.AddAutoMapper(cfg => { }, assemblies);

builder.Services.AddHttpClient<AuctionServiceHttpClient>().AddPolicyHandler(GetPolicy()); 

builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.ReceiveEndpoint("search-auction-created", e =>
        {
            e.UseMessageRetry(r => r.Interval(5, 5));

            e.ConfigureConsumer<AuctionCreatedConsumer>(context);
        });
        cfg.ConfigureEndpoints(context);
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

// try
// {
//     await DbInitializer.InitDb(app);
// }
// catch (System.Exception e)
// {
//     Console.WriteLine("An error occurred while initializing the database: " + e);
// }

app.Lifetime.ApplicationStarted.Register(async () =>
{ // run the app and register below InitDb to run after the app starts
    try
    {
        await DbInitializer.InitDb(app);
    }
    catch (System.Exception e)
    {
        Console.WriteLine("An error occurred while initializing the database: " + e);
    }
});

app.Run();


static IAsyncPolicy<HttpResponseMessage> GetPolicy()
    => HttpPolicyExtensions
        .HandleTransientHttpError()
        .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));