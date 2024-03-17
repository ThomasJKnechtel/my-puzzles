import Link from 'next/link'
import Image from 'next/image'
import { createContext, useEffect, useState} from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Popup from './popup'
import SearchBar from './searchbar'


export const LayoutContext = createContext({})


export default function Layout({ search, children, searchLink, selectPuzzles, lobby, display=true }){
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
    useEffect(()=>{
        if(display){
            document.querySelector('#footer').classList.remove('hidden')
            document.querySelector('#header').classList.remove('hidden')
        }else{
            document.querySelector('#footer').classList.add('hidden')
            document.querySelector('#header').classList.add('hidden')
        }
    }, [display])
    return (
        <div className="relative inline-flex flex-col justify-between h-full w-full">
            
            <header id="header" className="flex flex-row items-center justify-between gap-1 bg-slate-500 flex-wrap pt-1">
                <div className=' inline-flex flex-row items-center'>
                    <Image src = "https://img.icons8.com/ios-glyphs/30/pawn.png" 
                    alt = "logo"
                    width={30}
                    height={30}
                    className="h-[30px]  relative"/>
                    
                    <h1 className="text-3xl font-bold font-serif">MyPuzzles</h1>
                </div>
                
                
                {
                session?(
                    <span className=' z-20 sm:order-4 m-1'>
                        <Popup session={session}/>
                    </span>
                    

                ):(
                    <button type="button" className="button-3 green mr-1 ml-auto sm:order-4 m-1" onClick={()=>signIn()}>Sign In</button>
                )
                }
                <div className=' flex flex-row flex-wrap gap-1 sm:order-3 sm:bg-slate-500 bg-slate-50 p-1 w-full sm:w-fit'>
                   {search&&<SearchBar setGamesPgns={setGamesPgns}/>}
                   
                        {searchLink&&
                            <Link href='/' className=' hover:text-gray-300 mx-3'>Select Games</Link>
                        }
                        {selectPuzzles&&
                            <Link href='/select_puzzles' className=' hover:text-gray-300 mx-3'>Select Puzzles</Link>
                        }
                        {lobby&&
                        <Link href='/lobby' className=' hover:text-gray-300 mx-3'>Lobby</Link>
                        }
                     
                    
                        
                </div>
            </header> 
            
            <main className='h-full overflow-auto'>
                
                <LayoutContext.Provider value={{gamesPgns:gamesPgns, setGamesPgns:setGamesPgns, session:session}}>
                    {children}
                </LayoutContext.Provider>
            
            </main>
            <footer id="footer" className = "inline-flex flex-row justify-center w-full ">
                <label>Contact me:</label><Link href="thomasknechtel@outlook.com">thomasknechtel@outlook.com</Link>
            </footer>
        </div>
    )
}

