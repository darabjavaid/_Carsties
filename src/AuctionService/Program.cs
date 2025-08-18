using AuctionService.Consumers;
using AuctionService.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AuctionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var assemblies = AppDomain.CurrentDomain.GetAssemblies();
builder.Services.AddAutoMapper(cfg => { }, assemblies);

builder.Services.AddMassTransit(x =>
{

    x.AddEntityFrameworkOutbox<AuctionDbContext>(o => {
        o.QueryDelay = TimeSpan.FromSeconds(10);
        o.UsePostgres();
        o.UseBusOutbox();
    });

    x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

try
{
    DbInitializer.InitDb(app);
    Console.WriteLine("Database initialized successfully.");
}
catch (Exception e)
{
    Console.WriteLine("An error occurred while initializing the database: " + e.Message);
}

app.Run();
