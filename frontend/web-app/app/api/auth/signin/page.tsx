import EmptyFilter from '@/app/components/EmptyFilter'
import React from 'react'

export default function signIn({searchParams}: {searchParams: {callbackUrl: string}}) {
  return (
    <EmptyFilter
        title='login to see session page'
        subtitle='Please click below to login'
        showLogin
        callbackUrl={searchParams.callbackUrl}
    />
        
  )
}
