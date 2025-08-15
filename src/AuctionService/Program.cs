using AuctionService.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AuctionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var assemblies = AppDomain.CurrentDomain.GetAssemblies();
builder.Services.AddAutoMapper(cfg => { }, assemblies);

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
