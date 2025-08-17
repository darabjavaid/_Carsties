

using Polly;
using Polly.Extensions.Http;
using SearchService.Data;
using SearchService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddHttpClient<AuctionServiceHttpClient>().AddPolicyHandler(GetPolicy()); 

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