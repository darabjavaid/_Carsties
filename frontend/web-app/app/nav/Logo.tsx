'use client'
import { useParamsStore } from '@/hooks/useParamsStore'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { AiOutlineCar } from 'react-icons/ai'

export default function Logo() {
    const router = useRouter();
    const pathname = usePathname();
    const reset = useParamsStore(s=> s.reset);

    function handleReset(){
        if(pathname !== '/') router.push('/');
        reset();
    }

    return (
        <div onClick={handleReset} className=' cursor-pointer flex items-center gap-2 text-3xl font-semibold text-blue-500'>
                    <AiOutlineCar size={34}/>
                    <div>Carsties</div>
                </div>
    )
}
