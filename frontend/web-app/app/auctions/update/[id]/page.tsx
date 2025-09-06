import { getDetailedViewData } from '@/app/actions/auctionActions';
import Heading from '@/app/components/Heading';
import React from 'react'
import AuctionForm from '../../AuctionForm';

export default async function Update({params}: {params: Promise<{id: string}>}) {//getting the ID from route params
    const {id} = await params;
    const data = await getDetailedViewData(id);

  return (
    <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg  '  >
      <Heading title='update auction' subtitle='update the details of your car'/>
      <AuctionForm auction={data} />
    </div>
  )
}
