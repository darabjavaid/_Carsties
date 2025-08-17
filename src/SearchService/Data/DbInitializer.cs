using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.Services;

namespace SearchService.Data;

public class DbInitializer
{

    public static async Task InitDb(WebApplication app)
    {
        // Initialize MongoDB connection and any required collections
        await DB.InitAsync("SearchDB", MongoClientSettings.FromConnectionString(app.Configuration.GetConnectionString("MongoDBConnection")));

        await DB.Index<Item>()
            .Key(i => i.Make, KeyType.Text)
            .Key(i => i.Model, KeyType.Text)
            .Key(i => i.Color, KeyType.Text)
            .CreateAsync();

        // Optionally, seed initial data if necessary
        // await SeedDataAsync();

        var count = await DB.CountAsync<Item>();
        // if (count == 0)
        // {
        //     Console.WriteLine("No items found in the SearchDB. Consider seeding initial data.");
        //     var itemData = await File.ReadAllTextAsync("Data/auctions.json");
        //     var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        //     var items = JsonSerializer.Deserialize<List<Item>>(itemData, options);
        //     if (items != null)
        //     {
        //         await DB.SaveAsync(items);
        //         Console.WriteLine("mongodb initial seeding completed.");
        //     }
        //     else
        //     {
        //         Console.WriteLine("Failed to deserialize items from JSON.");
        //     }
        // }

        using var scope = app.Services.CreateScope();

        var httpClient = scope.ServiceProvider.GetRequiredService<AuctionServiceHttpClient>();

        var items = await httpClient.GetItemsForSearchDb();

        Console.WriteLine(items?.Count + " items fetched from Auction Service for Search Service DB.");

        if(items?.Count > 0) await DB.SaveAsync(items);
    }
}
