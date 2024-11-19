import { Menu, User } from 'lucide-react'
import React from 'react'
import  Image  from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type props={}

const nanvar = () => {
  return (
    <div className="flex w-full justify-between items-center text-white ">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Menu className="w-8 h-8" />
        <Image alt="logo" src="" width={40} height={40} />
        Opal
        <div className="hidden gap-x-10 items-center lg:flex justify-center">
          <Link
            href={"/"}
            className="bg-[#7320DD] rounded-full hover:bg-[#7320DD]/80"
          >
            home
          </Link>
          <Link href={"/"}>pricing</Link>
          <Link href={"/"}>contact</Link>
        </div>
      </div>
      <Link href={"/auth/sign-in"}>
        <Button className="text-base flex gap-x-2"> <User fill={"#000"} /> Login</Button>
        </Link>
    </div>
  );
}

export default nanvar