using System;
using AutoMapper;
using Contracts;
using SearchService.Models;

namespace SearchService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Add your mapping configurations here
        // For example:
        // CreateMap<SourceType, DestinationType>();

        CreateMap<AuctionCreated, Item>();

        CreateMap<AuctionUpdated, Item>();
    }
}
