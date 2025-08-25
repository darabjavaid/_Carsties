'use client'


import { useParamsStore } from '@/hooks/useParamsStore'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function Search() {
    const setParams = useParamsStore(s => s.setParams);
    const searchTerm = useParamsStore(s=> s.searchTerm);
    const [value, setValue] = useState('');

    useEffect(() => {
        if(searchTerm  === '') setValue('');
    }, [searchTerm]);

    function handleChange(e: ChangeEvent<HTMLInputElement>){
        setValue(e.target.value);
    }

    function handleSearch(){
        setParams({searchTerm: value});
    }

    return (
        <div className='flex w-[50%] items-center border-2 border-gray-300 rounded-full py-2 shadow-sm'>
            <input
                onKeyDown={(e)=> {
                    if(e.key === 'Enter'){
                        handleSearch()
                    }
                }}
                onChange={handleChange}
                value={value}
                type="text"
                placeholder="search for cars by make, color, mdoel"
                className="flex-grow pl-5 bg-transparent focus: outline-none focus: border-transparent focus: ring-0 text-sm text-gray-600"
            />
            <button title="Search" aria-label="Search" onClick={handleSearch}>
                <FaSearch size={34} className='bg-blue-400 text-white rounded-full p-2 cursor-pointer mx-2'/>
            </button>
        </div>
    )
}
