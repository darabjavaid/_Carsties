'use client'; //to be used when the component is based on client side rendering

import React from 'react'
import Countdown, { zeroPad } from 'react-countdown';


const renderer = ({ days, hours, minutes, seconds, completed }: any) => {

    return (
        <div className={`
            border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center
            ${completed ? 'bg-red-600' : (days === 0 && hours < 10) ? 'bg-amber-600' : 'bg-green-600'}
        `}>
            {completed ? (
                <span>Auction Finished</span>
            ) : (
                // because of hydration issue, we need to add suppressHydrationWarning (meaning there can be seconds different between nextjs server and client render)
                // https://react.dev/learn/react-hydration
                <span suppressHydrationWarning={true}>
                    {days}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
            )}
        </div>
    )
  }

type Props ={
    auctionEnd: string;
}


export default function CountdownTimer({auctionEnd}: Props) {
  return (
    <div>
        <Countdown date={auctionEnd} renderer={renderer}/>
    </div>
  )
}
