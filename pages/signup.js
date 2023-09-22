
import Image from "next/image";
import { useEffect, useState } from "react";
import { getProviders, signIn, useSession } from "next-auth/react"


export default function SignIn({ providers }){
  
    const [errorMessage, setErrorMessage] = useState(null)
    const {data} = useSession()
    async function register(){
        const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        const username = document.getElementById('username')?.value
        if(regex.test(username)){
          setErrorMessage('No spaces or special characters')
        }else if(username){
            fetch('/api/auth/register', {"method":"POST", "headers":{"Content-Type":"application/text"}, body:username}).then( res => {
              if(res.status === 200){
                window.location.href="/"
                return null
              }
              return res.json()
            }).then(result=> setErrorMessage(result?.err))
        }
        
       
    }
    useEffect(()=>{
      if(data?.username){
        window.location.href="/"
      }
    }, [data])
    return (
      
      <div className=" relative w-full h-full flex flex-col justify-center items-center">
      <div className=" basis-3/7 bg-white p-4 flex flex-col items-center gap-5 rounded-md shadow-md justify-items-stretch">
        <span className="inline-flex items-center underline">
          <Image src = "https://img.icons8.com/ios-glyphs/30/pawn.png" alt = "logo" width={30} height={30} className=" h-[30px] relative self-end left-2"/><h1 className=" font-bold text-3xl  font-serif">{" MyPuzzles"}</h1>
        </span>
        
        <Image src="https://img.icons8.com/fluency/96/user-male-circle--v1.png" alt="blank-profile" width={96} height={96}/> 
        <div className="flex flex-col items-center gap-2 relative">
          <div className=" inline-flex flex-row items-center gap-1">
            {!data?(
              
              Object.values(providers).map((provider) => (
              <div key={provider.name} className=" m-2">
                <button className=" text-black button-3 bg-white" type="button" onClick={() => signIn(provider.id)}>
                  Login with {provider.name}
                </button>
              </div>
            ))):(
              <h1 className=" button-3 ">Logged In</h1>
            )
            }
          
          {data&&<Image src="https://img.icons8.com/tiny-color/16/checked.png" alt="checkmark" width={16} height={16} className=" h-[16px] text-center absolute right-0"/>}
          
        </div>
        
        {data&& 
        <>
        <div className=" border-t-2">
          <h1 className=" font-medium text-lg">Enter Username</h1>
          <h3 id="erorMessage" className=" text-xs text-red-600">{errorMessage}</h3>
            <div className=" border-2 rounded-md p-1">
                
                <input type="text" className="" id="username" placeholder="Username"/>
                <Image src="https://img.icons8.com/windows/32/user-male-circle.png" alt="mini-blank-profile" width={23} height={23} className=" inline opacity-60"/>
            </div>
        </div>
        <button className="button-3 mt-5" type="button" onClick={register}>Register</button></>
        }
          
          </div>
          
         
      </div>
      </div>
      
    )
  }
  
  export async function getServerSideProps(context) {

    const providers = await getProviders();
    
    return {
      props: { providers: providers ?? [] },
    }
  }