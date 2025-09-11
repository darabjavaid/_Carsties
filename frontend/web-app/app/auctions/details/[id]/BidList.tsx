'use client'
import { getBidsForAuction } from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import { useBidStore } from "@/hooks/useBidStore";
import { Auction, Bid } from "@/types";
import { User } from "next-auth";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import BidItem from "./BidItem";
import { numberWithCommas } from "@/lib/numberWithComma";
import EmptyFilter from "@/app/components/EmptyFilter";
import BidForm from "./BidForm";

type Props = {
  user: User | null;
  auction: Auction;
};

export default function BidList({ user, auction }: Props) {
  const [loading, setLoading] = React.useState(true);
  const bids = useBidStore((state) => state.bids);
  const setBids = useBidStore((state) => state.setBids);

  const highBid = bids.reduce((prev, current) => 
    prev > current.amount ? prev : current.bidStatus.includes('Accepted') ? current.amount : prev, 0);

  useEffect(() => {
    getBidsForAuction(auction.id)
      .then((res: any) => {
        if (res.error) throw res.error;
        setBids(res as Bid[]);
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [auction.id, setBids]);

  if (loading) return <div>Loading bids...</div>;

  return (
    <div className="rounded-lg shadow-md">
      <div className="py-2 px-4 bg-white">
        <div className="sticky top-0 bg-white p-2">
          <Heading title={`current high bid is ${numberWithCommas(highBid)}`} />
        </div>          
      </div>

      <div className="overflow-auto h-[350px] flex flex-col-reverse px-2">
        {bids.length === 0 ? (
          <EmptyFilter title="No bids placed yet" subtitle="Be the first to place a bid!" />
        ) : (
            <>
               {bids.map((bid) => (
                  <BidItem key={bid.id} bid={bid} />
                ))}
            </>
        )}

      </div>

      <div className="px-2 pb-2 text-gray-400">
        {
          !user ? (
            <div className="flex items-center justify-center p-2 text-lg font-semibold">Please log in to place a bid</div>
          ) 
          : user && user.username === auction.seller ? (
            <div className="flex items-center justify-center p-2 text-lg font-semibold">You can not bid on your own auction</div>
          ) 
          : (
            <BidForm auctionId={auction.id} highBid={highBid} />
          )
        }            
      </div>
     
    </div>
  );
}
