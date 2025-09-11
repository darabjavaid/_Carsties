'use client'
import { useAuctionStore } from '@/hooks/useAuctionStore';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, AuctionFinished, Bid } from '@/types';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { User } from 'next-auth';
import { useParams } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast';
import AuctionCreatedToast from '../components/AuctionCreatedToast';
import { getDetailedViewData } from '../actions/auctionActions';
import AuctionFinishedToast from '../components/AuctionFinishedToast';

type Props={
    children: ReactNode;
    user: User | null;
}

export default function SignalRProvider({children, user}: Props) {
    const connection = useRef<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(s => s.setCurrentPrice);
    const addBid = useBidStore(s => s.addBid);
    const params = useParams<{id: string}>();

    const handleBidPlaced = useCallback((bid: Bid) => {
        if(bid.bidStatus.includes('Accepted')){
            setCurrentPrice(bid.auctionId, bid.amount);
        }

        if(params.id === bid.auctionId){
            addBid(bid);
        }
    },[setCurrentPrice, addBid, params.id]);


    const handleAuctionCreated = useCallback((auction: Auction) => {
        //notify user of new auction
        if(user?.username !== auction.seller){
            return toast(<AuctionCreatedToast auction={auction} />, { duration: 5000, position: 'top-right'});
        }
    }, [user?.username]);

    const handleAuctionFinished = useCallback((finishedAuction: AuctionFinished) => {
        // const auction = getDetailedViewData(finishedAuction.auctionId);
        // return toast.promise(auction,{
        //         loading: 'Loading',
        //         success: <AuctionFinishedToast  auction={auction} finishedAuction={finishedAuction} />,
        //         error: (err) => 'Auction Fiinished'
        //     }, { duration: 10000, position: 'top-right', icon: null}
        // );

        getDetailedViewData(finishedAuction.auctionId)
            .then(auction => {
                toast(<AuctionFinishedToast auction={auction} finishedAuction={finishedAuction} />, 
                    { duration: 10000, position: 'top-right', icon: null});
            })
            .catch(()=> toast.error('Auction Finished'));
    }, [])

    useEffect(() => {
        if(!connection.current){
            connection.current = new HubConnectionBuilder()
            .withUrl('http://localhost:6001/notifications')
            .withAutomaticReconnect()
            .build();

            connection.current.start()
            .then(() => {
                console.log('notification hub Connected.');
            })
            .catch(e => console.log('SignalR Connection Error: ', e));
        }
         connection.current.on('BidPlaced', handleBidPlaced);
         connection.current.on('AuctionCreated', handleAuctionCreated);
         connection.current.on('AuctionFinished', handleAuctionFinished);

         return () => {
            //cleanup
            connection.current?.off('BidPlaced', handleBidPlaced);
            connection.current?.off('AuctionCreated', handleAuctionCreated);
            connection.current?.off('AuctionFinished', handleAuctionFinished);
         }
    }, [setCurrentPrice, handleBidPlaced, handleAuctionCreated, handleAuctionFinished]);
  return (
    children
  )
}
