'use client'
import { Button } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import React from 'react'

export default function LoginButton() {
  return (
    // "id-server" is the id: if providerr that we manually put in auth.ts
    <Button onClick={()=> signIn('id-server', {redirectTo: '/'}, {prompt: 'login'})}> 
        Login
    </Button>
  )
}
