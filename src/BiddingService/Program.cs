using BiddingService.Consumers;
using BiddingService.Services;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using MongoDB.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddMassTransit(x =>
{

    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("bids", false));

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", h =>
        {
            h.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            h.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));            
        });
        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false; // Set to true in production
        options.TokenValidationParameters.ValidateAudience = false; // Disable audience validation
        options.TokenValidationParameters.NameClaimType = "username"; // Use 'username' as the name claim type
    });

var assemblies = AppDomain.CurrentDomain.GetAssemblies();
builder.Services.AddAutoMapper(cfg => { }, assemblies);
builder.Services.AddHostedService<CheckAuctionFinished>();
builder.Services.AddScoped<GrpcAuctionClient>();

var app = builder.Build();


app.UseAuthorization();

app.MapControllers();

await DB.InitAsync("BidDb", MongoClientSettings
    .FromConnectionString(builder.Configuration.GetConnectionString("BidDbConnection")));

app.Run();
