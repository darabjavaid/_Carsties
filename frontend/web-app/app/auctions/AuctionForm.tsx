'use client';

import { Button, Spinner } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/auctionActions';
import toast from 'react-hot-toast';
import { Auction } from '@/types';

type Props ={
    auction?: Auction;
}

export default function AuctionForm({auction}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const {control, handleSubmit, setFocus, reset, formState: {isSubmitting, isValid, isDirty}} = useForm({
        mode: 'onTouched'
    });

    useEffect(()=> {
        if(auction){
            const {make, model, color, mileage, year} = auction;
            reset({make, model, color, mileage, year});
        }

        setFocus('make');
    }, [setFocus, auction, reset]);

    async function onSubmit(data: FieldValues){
        try {
            let id = '';
            let res;
            if(pathname === '/auctions/create'){
                res = await createAuction(data);
                id = res.id
            }else{
                if(auction){
                    res = await updateAuction(data, auction.id);
                    id = auction.id;
                }
            }
            
            if(res.error) throw res.error;

            router.push(`/auctions/details/${id}`);
        } catch (error: any) {
            toast.error(error.status + ' ' + error.message);
        }
    }
  return (
    <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>
        <Input name="make" label='make' control={control} rules={{required: 'make is required'}} />
        <Input name="model" label='model' control={control} rules={{required: 'model is required'}} />        
        <Input name="color" label='color' control={control} rules={{required: 'color is required'}} />        

        <div className='grid grid-cols-2 gap-3'>
            <Input name="year" label='year' control={control} type='number' rules={{required: 'year is required'}} />        
            <Input name="mileage" label='mileage' control={control} rules={{required: 'mileage is required'}} />        
        </div>

       {
        pathname === '/auctions/create' &&
        <>
             <Input name="imageUrl" label='imageUrl' control={control} rules={{required: 'imageUrl is required'}} />        

            <div className='grid grid-cols-2 gap-3'>
                <Input name="reservePrice" label='reserve Price (enter 0 if no reserve)' control={control} type='number' rules={{required: 'reserve Price is required'}} />        
                <DateInput 
                    name="auctionEnd" 
                    label='auctionEnd Date/Time' 
                    control={control} 
                    rules={{required: 'auction End Date is required'}} 
                    showTimeSelect
                    dateFormat='dd MMMM yyyy h:mm a'
                />
            </div>
        </>
       }

        <div className='flex justify-between'>
            <Button color="alternative" onClick={()=> router.push('/')} >Cancel</Button>
            <Button
                color='green'
                type='submit'
                disabled={!isValid || !isDirty}
            >
                {isSubmitting && <Spinner size='sm' />}
                Submit
            </Button>
        </div>
    </form>
  )
}
