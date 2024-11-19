import { onAuthenticateUser } from "@/actions/user";
import { redirect } from 'next/navigation'

import React from 'react'

interface Props {}

const page = async(props: Props) => {

  const auth = await onAuthenticateUser();

  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.firstname}${auth.user?.lastname}`);
  } else {
    return redirect("/auth/sign-in");
  }


}

export default page