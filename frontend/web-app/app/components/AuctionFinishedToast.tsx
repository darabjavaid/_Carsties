import { numberWithCommas } from '@/lib/numberWithComma'
import { Auction, AuctionFinished } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    finishedAuction: AuctionFinished
    auction: Auction
}


export default function AuctionFinishedToast({auction, finishedAuction}: Props) {
  return (
    <Link href={`/auctions/details/${auction.id}`} className='flex flex-col items-center'>
        <div className='flex flex-row items-center gap-2'>
            <Image
                src={auction.imageUrl}
                alt='image of car'
                height={80}
                width={80}
                className='rounded-lg w-auto h-auto'
             />
             <div className='flex flex-col'>
                <span>Auction for {auction.make} {auction.model} has finished</span>
                {
                    finishedAuction.itemSold && finishedAuction.amount ? 
                    (
                        <p>Congrats to winner ${finishedAuction.winner} , won for $${numberWithCommas(finishedAuction.amount)}</p>
                    )
                    :
                    (
                        <p>Auction ended without any winning bids</p>
                    )
                }
             </div>
        </div>
    </Link>
  )
}
