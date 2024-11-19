import { Spinner } from '@/components/ui/global/loader/spinner';
import React from 'react'

interface Props {}

const AuthLoading = (props: Props) => {
  return (
      <div className='flex h-screen w-full justify-center items-center'>
          <Spinner/>
      
      </div>
  )
}

export default AuthLoading;