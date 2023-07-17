import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import LogIn from './login-btn'
import styles from "./layout.module.css"
import { Popup} from "./popup"
import { parse } from '@mliebelt/pgn-parser'
import { createContext, useState} from 'react'
import { GamesTable } from "@/components/table";

export const LayoutContext = createContext({})

export default function Layout({ search, children }){
    const { data : session } = useSession()
    const [games , setGames ] = useState([])
    
    async function getGames(){
        fetch("https://lichess.org/api/games/user/chessiandoceo?vs=jdrc&rated=true&analysed=false&tags=true&clocks=false&evals=false&opening=false&max=8&since=1651377600000&until=1651723200000&perfType=ultraBullet%2Cbullet%2Cblitz%2Crapid%2Cclassical%2Ccorrespondence").then(response => {
            if(!response.ok){
                console.log(response.status)
            }
            return response.text()
        }).then(gamesStr=> {
            setGames(parse(gamesStr))
           console.log(games)
        })
        
    }

    return (
        <div className="relative inline-flex flex-col align-middle h-full w-full">
            
            <header className="inline-flex flex-row items-center bg-slate-500 p-2">
                <Image src = "https://img.icons8.com/ios-glyphs/30/pawn.png" 
                    alt = "logo"
                    width={30}
                    height={30}
                    className="h-[30px]  relative"/>
                    
                    <h1 className="text-3xl font-bold font-serif">MyPuzzles</h1>
                {search&& 
                    <div className="inline-flex flex-row items-center mx-24">
                        <input type="text" placeholder="Enter a Lichess username" className=" rounded-l-sm h-[25px] w-80"></input>
                        <button className=" bg-white rounded-r-full h-[25px] w-[25px]" onClick = {getGames} ><Image src="https://img.icons8.com/ios/50/search--v1.png" alt="search" width={15} height={15} className=""/></button>
                    </div>
                    
                }
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
            
            <main className='h-full'>
                {
                <LayoutContext.Provider value={{games:games, setGames:setGames, session:session}}>
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

