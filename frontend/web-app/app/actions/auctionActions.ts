'use server';


import { Auction, PagedReult } from "@/types";

// export async function getData(pageNumber: number, pageSize: number) : Promise<PagedReult<Auction>> {
//   const res = await fetch(`http://localhost:6001/search?pageSize=${pageSize}&pageNumber=${pageNumber}`);
//   if (!res.ok) throw new Error("Failed to fetch data");

//   return res.json();
// }


export async function getData(query: string) : Promise<PagedReult<Auction>> {
  const res = await fetch(`http://localhost:6001/search${query}`);
  
  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
}