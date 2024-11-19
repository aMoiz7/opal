import Image from 'next/image';
import React from 'react'

interface Props {
  activeWorkspaceId:string
}

const Sidebar = ({activeWorkspaceId}: Props) => {
  return (
      <div className='bg-purple-600 flex-none relative p-4 h-full w-[250px] flex flex-col items-center overflow-hidden '><div className='p-4 gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0'>
          <Image src={"/opal-logo.svg"} height={40} width={40} alt='logo' />
      <p className='text-2xl text-black'>Opal</p>
      

    </div>
     
     <Select>
      
    
    </div>
  )  
}

export default Sidebar;