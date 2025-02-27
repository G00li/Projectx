import { useSession } from "next-auth/react"


const BemVindo = () =>{
  const user = useSession(); 
  return(
    <div>
      <h1>Bem vindo</h1>
    </div>
  )
}

export default BemVindo; 