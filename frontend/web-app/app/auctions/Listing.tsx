'use client'

import React, { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";
import Filters from "./Filters";
import { useParamsStore } from "@/hooks/useParamsStore";
import { useShallow } from "zustand/shallow";
import queryString from "query-string";
import EmptyFilter from "../components/EmptyFilter";
import { useAuctionStore } from "@/hooks/useAuctionStore";



export default function Listing() {
  const [loading, setLoading] = useState(true);
  // const [auctions, setAuctions] = useState<Auction[]>([]);
  // const [pageCount, setPageCount] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [pageSize, setPageSize] = useState(4);

  //instaed of using above, now we will use zustand store
  // const [data, setData] = useState<PagedReult<Auction>>();
  const data = useAuctionStore(useShallow((state) => ({
    auctions: state.auctions,
    totalCount: state.totalCount,
    pageCount: state.pageCount
  })));

  const setData = useAuctionStore((state) => state.setData);

  const params = useParamsStore(useShallow((state) => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy,
    seller: state.seller,
    winner: state.winner
  })));
  const setParams = useParamsStore((state) => state.setParams);
  const url = queryString.stringifyUrl({url:'', query: params}, {skipEmptyString: true});

  function setPageNumber(pageNumber: number){
    setParams({pageNumber});
  }


  useEffect(() => {
    getData(url).then(data => {
      // setAuctions(data.results);
      // setPageCount(data.pageCount);
      setData(data);
      setLoading(false);
    });
  }, [url,setData]);

  if(loading) return <div>loading...</div>

  return (
    <>
      {/* <Filters pageSize={pageSize} setPageSize={setPageSize}   /> */}
      <Filters />
      {data.totalCount === 0 ? (
        <EmptyFilter showReset/>
      ) : (
          <>
            <div className="grid grid-cols-4 gap-6">
                {data && data.auctions.map(auction => (
                    <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            <div className="flex justify-center mt-10">
              <AppPagination pageChanged={setPageNumber} currentPage={params.pageNumber} pageCount={data.pageCount} /> 
            </div>
          </>
      )}
      
    </>
  )
}
