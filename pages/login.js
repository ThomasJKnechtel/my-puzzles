
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]";

export default function SignIn({ providers }){
    return (
      
      <div className=" relative w-full h-full flex flex-col justify-center items-center">
      <div className=" basis-3/7 bg-white p-4 flex flex-col items-center gap-5 rounded-md shadow-md">
      <span className="inline-flex items-center underline">
        <Image src = "https://img.icons8.com/ios-glyphs/30/pawn.png" alt = "logo" width={30} height={30} className=" h-[30px] relative self-end left-2"/><h1 className=" font-bold text-3xl  font-serif">{" MyPuzzles"}</h1>
      </span>
      
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button className=" text-black button-3 bg-white" type="button" onClick={() => signIn(provider.id, {redirect: true})}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
      </div>
      
    )
  }
  
  export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    
    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
      return { redirect: { destination: "/" } };
    }
  
    const providers = await getProviders();
    
    return {
      props: { providers: providers ?? [] },
    }
  }