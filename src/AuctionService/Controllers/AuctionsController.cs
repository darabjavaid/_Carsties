using System;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionsController(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDTO>>> GetAllAuctions()
    {
        var auctions = await _context.Auctions
                                .Include(x => x.Item)
                                .OrderBy(y => y.Item.Make)
                                .ToListAsync();

        return Ok(_mapper.Map<List<AuctionDTO>>(auctions));
    }

    [HttpGet("{id}")]

    public async Task<ActionResult<AuctionDTO>> GetAuctionById(Guid id)
    {
        var auction = await _context.Auctions
                                .Include(x => x.Item)
                                .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null)
            return NotFound();

        return Ok(_mapper.Map<AuctionDTO>(auction));
    }

    [HttpPost]
    public async Task<ActionResult<AuctionDTO>> CreateAuction(CreateAuctionDTO auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);

        //TODO: add current user as seller
        auction.Seller = "test"; // Replace with actual user retrieval logic

        _context.Auctions.Add(auction);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result)
            return BadRequest("An error occurred while saving the auction.");

        return CreatedAtAction(nameof(GetAuctionById), new { id = auction.Id }, _mapper.Map<AuctionDTO>(auction));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDTO auctionDto)
    {
        try
        {
            var auction = await _context.Auctions.Include(x => x.Item).FirstOrDefaultAsync(x => x.Id == id);

            if (auction == null)
                return NotFound();

            auction.Item.Make = auctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = auctionDto.Model ?? auction.Item.Model;
            auction.Item.Color = auctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = auctionDto.Mileage ?? auction.Item.Mileage;
            auction.Item.Year = auctionDto.Year ?? auction.Item.Year;

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
                return Ok();

            return BadRequest("An error occurred while updating the auction.");

        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating auction: {ex.ToString()}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _context.Auctions.FindAsync(id);

        if (auction == null)
            return NotFound();

        _context.Auctions.Remove(auction);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result)
            return BadRequest("An error occurred while deleting the auction.");

        return Ok();
    }
}
