'use client'
import { useParamsStore } from '@/hooks/useParamsStore'
import React from 'react'
import { AiOutlineCar } from 'react-icons/ai'

export default function Logo() {

    const reset = useParamsStore(s=> s.reset);

    return (
        <div onClick={reset} className=' cursor-pointer flex items-center gap-2 text-3xl font-semibold text-blue-500'>
                    <AiOutlineCar size={34}/>
                    <div>Carsties</div>
                </div>
    )
}
