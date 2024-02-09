import Image from "next/image";
import { getProviders, signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react";


export default function SignUp({ providers }){
  const {data: session} = useSession()
  const [error, setError] = useState('')
  async function submit(e){
    e.preventDefault()
    const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    const username = document.querySelector('#username').value
    if(!regex.test(username)&&username.length>3&&username.length<15){
      await fetch('/api/auth/register', {
      method: 'POST',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify({username})
      }).then(response =>{
        if(!response.ok){
          window.alert('Error registering user')
        }
        return response.json()
      }).then(result => {
        if(result.Status === "User added successfully"){
          window.location.href = '/'
        }else{
          setError(result.Status)
        }
      })
    }
    
  }
  useEffect(()=>{
    if(error===''){
      document.querySelector('#usernameError').classList.add('invisible')
    }else{
      document.querySelector('#usernameError').classList.remove('invisible')
    }
  }, [error])
  function usernameChange(){
    const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    const username = document.querySelector('#username').value
    if(regex.test(username)){
     setError('Invalid Username')
    }else{
      setError('')
    }
  }
  return (
    <div className=" flex flex-col w-full h-full items-center justify-center">
    <div className=" flex flex-col items-center gap-1 bg-white p-2 rounded-md shadow-md ">
      <div className=' inline-flex items-center mb-5'>
        <Image src = "https://img.icons8.com/ios-glyphs/30/pawn.png" alt = "logo" width={30} height={30}/>
        <h1 className="text-3xl font-bold font-serif">MyPuzzles</h1>
      </div>
        {!session&&Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className=" text-black button-3 shadow-md hover:bg-slate-50" type="button" onClick={() => signIn(provider.id, {redirect: true})}>
            Sign up with {provider.name}
          </button>
        </div>
        ))}
        {session&&
        <div className=" inline-flex flex-row px-2 py-1 rounded-md items-center  font-medium text-gray-600 bg-slate-100 opacity-60 shadow-inner">
          <label>Authenticated </label>
          <Image src="https://img.icons8.com/skeuomorphism/32/experimental-checked-skeuomorphism.png" alt="checkmark" width={30} height={30}></Image>
          </div>

        }
        <hr className= " w-full border-b-2 mt-1"/>

      <form onSubmit={submit} className=" flex flex-col items-center mx-3">
          <label className=" font-medium text-slate-600">Create Username</label>
          <label id="usernameError" className=" text-xs font-thin text-red-800 invisible "  >{error}</label>
          <input id="username" className=" border-2 rounded-md px-1" type="text" name="username" placeholder="username" width={20} onChange={usernameChange}/>
          
          <button className=" px-2 py-1 border-2 rounded-md font-bold mt-3  hover:bg-slate-50 shadow-md" type="submit">Sign Up</button>
      </form>
    </div>
      
    </div>
    
  )
    
}
  
  export async function getServerSideProps(context) {
    // const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders();
    
    return {
      props: {  providers: providers ?? [] },
    }
  }