using System;
using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions options) : base(options)
    {
    }

    // Define DbSets for your entities here, e.g.:
    public DbSet<Auction> Auctions { get; set; } 

}
