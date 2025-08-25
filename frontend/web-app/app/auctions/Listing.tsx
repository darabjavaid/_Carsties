'use client'

import React, { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";
import { Auction, PagedReult } from "@/types";
import Filters from "./Filters";
import { useParamsStore } from "@/hooks/useParamsStore";
import { useShallow } from "zustand/shallow";
import queryString from "query-string";
import EmptyFilter from "../components/EmptyFilter";



export default function Listing() {
  // const [auctions, setAuctions] = useState<Auction[]>([]);
  // const [pageCount, setPageCount] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [pageSize, setPageSize] = useState(4);

  //instaed of using above, now we will use zustand store
  const [data, setData] = useState<PagedReult<Auction>>();
  const params = useParamsStore(useShallow((state) => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy
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
    });
  }, [url]);

  if(!data) return <div>loading...</div>

  return (
    <>
      {/* <Filters pageSize={pageSize} setPageSize={setPageSize}   /> */}
      <Filters />
      {data.totalCount === 0 ? (
        <EmptyFilter showReset/>
      ) : (
          <>
            <div className="grid grid-cols-4 gap-6">
                {data && data.results.map(auction => (
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
