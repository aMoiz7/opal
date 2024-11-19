import { onAuthenticateUser } from "@/actions/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import React from "react";

interface Props {}

const page = async (props: Props) => {
  const auth = await onAuthenticateUser();
  const user = await currentUser();

console.log(auth)
  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.firstname}${auth.user?.lastname}`);
  }

  if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
    return redirect("/auth/sign-in");
  }
};

export default page;
