'use client'; //to be used when the component is based on client side rendering


import React from 'react'
import Image from 'next/image'

type Props = {
    imageUrl: string;
}

export default function CardImage({imageUrl}: Props) {
    const [loading, setLoading] = React.useState(true);
  return (
    <Image 
        src={imageUrl}
        alt= 'image of car'
        fill
        className={`
            object-cover duration-700 ease-in-out
            ${loading ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}
        `}
        priority
        sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 25vw"
        unoptimized
        onLoad={() => setLoading(false)}
    />
  )
}
