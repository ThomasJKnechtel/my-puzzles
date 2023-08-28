import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Popup} from "./popup"
import { createContext, useEffect, useState} from 'react'
import SearchBar from './searchbar'


export const LayoutContext = createContext({})

export default function Layout({ search, children }){
    const { data : session } = useSession()
    const [gamesPgns , setGamesPgns ] = useState([])
    
    useEffect(()=>{
        if(gamesPgns.length !== 0){
             sessionStorage.setItem('gamePgns', JSON.stringify(gamesPgns))
        }
       
    }, [gamesPgns])
    useEffect(()=>{
        const storedPgns = JSON.parse(sessionStorage.getItem('gamePgns'))
        if(storedPgns){
            setGamesPgns(storedPgns)
        }
        
    }, [])
    return (
        <div className="relative inline-flex flex-col align-middle h-full w-full">
            
            <header className="inline-flex flex-row items-center bg-slate-500 p-2">
                <Image src = "https://img.icons8.com/ios-glyphs/30/pawn.png" 
                    alt = "logo"
                    width={30}
                    height={30}
                    className="h-[30px]  relative"/>
                    
                    <h1 className="text-3xl font-bold font-serif">MyPuzzles</h1>
                {search&&<SearchBar setGamesPgns={setGamesPgns}></SearchBar>}
                {
                session?(
                    <Popup 
                        buttonChildren={<Image src={session.user.image} alt="profilePick" width={50} height={50} className="rounded-lg focus:border-2 border-gray-400 "/>}
                        headerChildren={<><h3 className="text-center my-2  font-bold">{session.user.name}</h3><label className="text-center text-xs mx-2 font-semibold">{session.user.email}</label></>}
                        children={<><button className='button-3 green'>Profile</button><br></br><button className='button-3 green' onClick={()=>{signOut()}}>Log Out</button></>}
                    ></Popup>
                        
                    
                ):(
                    <button className="button-3 green mr-0 ml-auto" onClick={()=>signIn()}>Sign In</button>
                )
                }
            </header> 
            
            <main className='h-full overflow-auto'>
                {
                <LayoutContext.Provider value={{gamesPgns:gamesPgns, setGamesPgns:setGamesPgns, session:session}}>
                    {children}
                </LayoutContext.Provider>
                    
                    }
            </main>
            <footer className = "inline-flex flex-row justify-center w-full align-middle">
                <label>Contact me:</label><Link href="thomasknechtel@cmail.carleton.ca">thomasknechtel@cmail.carleton.ca</Link>
            </footer>
        </div>
    )
}

