"use client"

import { signIn, useSession } from "next-auth/react";

const ProfileUserPage = () => {
  const session = useSession()
  console.log(session);
  
return(
  <button onClick={() => signIn("github")}>Logar com o Github</button>
)
}

export default ProfileUserPage; 