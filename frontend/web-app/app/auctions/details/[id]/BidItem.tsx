import { numberWithCommas } from '@/lib/numberWithComma';
import { Bid } from '@/types'
import { format } from 'date-fns/format';
import React from 'react'

type Props = {
    bid: Bid
}

export default function BidItem({bid}: Props) {
    function getBidInfo(){
        let bgColor = '';
        let text = '';
        switch(bid.bidStatus){
            case 'Accepted':
                bgColor = 'bg-green-200';
                text = 'Bid Accepted';
                break;
            case 'AcceptedBelowReserve':
                bgColor = 'bg-amber-600';
                text = 'Reserve not met';
                break;
            case 'TooLow':
                bgColor = 'bg-red-600';
                text = 'Bid was too Low';
                break;
            default: 
                bgColor = 'bg-red-600';
                text = 'bid placed after auction finished';
                break;
        }

        return {bgColor, text};
    }

    
  return (
    <div className={`
        border-gray-200 border-2 py-2 px-3 rounded-lg
        flex justify-between items-center mb-2 ${getBidInfo().bgColor}
    `}>
        <div className='flex flex-col'>
            <span>Bidder: {bid.bidder}</span>
            <span className='text-gray-700 text-sm'>Time: {format(bid.bidTime, 'dd MMM yyyy h:mm:ss a') }</span>
        </div>
        <div className='flex flex-col text-right'>
            <div className='text-xl font-semibold'>${numberWithCommas(bid.amount)}</div>
            <div className='flex flex-row items-center'>
                <span>{getBidInfo().text}</span>
            </div>
        </div>
    </div>
  )
}
