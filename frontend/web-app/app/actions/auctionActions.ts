'use server';


import { fetchWrapper } from "@/lib/fetchWrapper";
import { Auction, Bid, PagedReult } from "@/types";
import { FieldValues } from "react-hook-form";

// export async function getData(pageNumber: number, pageSize: number) : Promise<PagedReult<Auction>> {
//   const res = await fetch(`http://localhost:6001/search?pageSize=${pageSize}&pageNumber=${pageNumber}`);
//   if (!res.ok) throw new Error("Failed to fetch data");

//   return res.json();
// }


export async function getData(query: string) : Promise<PagedReult<Auction>> {
  // const res = await fetch(`http://localhost:6001/search${query}`);//fetch is server side utility, react hooks axios are client side utiltiy
  
  // if (!res.ok) throw new Error("Failed to fetch data");

  // return res.json();

  return fetchWrapper.get(`search${query}`);
}


export async function createAuction(data: FieldValues){
  return fetchWrapper.post('auctions', data);
}

export async function getDetailedViewData(id: string) : Promise<Auction>{
  return fetchWrapper.get(`auctions/${id}`);
}

export async function updateAuction(data: FieldValues, id: string){
  return fetchWrapper.put(`auctions/${id}`, data);
}


export async function deleteAuction(id: string){
  return fetchWrapper.del(`auctions/${id}`);
}

export async function getBidsForAuction(id: string) : Promise<Bid[]> {
  return fetchWrapper.get(`bids/${id}`);
}

export async function paceBidForAuction(auctionId: string, amount:number) {
  return fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`, {});
}
