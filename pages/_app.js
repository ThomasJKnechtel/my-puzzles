import { SessionProvider } from "next-auth/react"
import  "../styles/globals.css"
import '../styles/ag-grid.css'
import Script from "next/script"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import NewNotificationDisplay from "@/components/newNotificationDisplay"

export const metadata = {
    title: 'MyChessPuzzles',
    description: 'Generate chess puzzles from a Lichess players games',
    openGraph: {
        title: 'MyChessPuzzles - Generate Puzzles',
        description: 'Generate chess puzzles from a Lichess players games',
        url: 'https://mychesspuzzles.com',
        siteName: 'MyChessPuzzles',
        images:[
            {
                url:'https://mychesspuzzles.com/public/images/og.png',
                width:800,
                height:395
            },
            {
                url: 'https://mychesspuzzles.com/public/images/og-alt.png',
                width: 1528, 
                height:755
            }
        ],
        locale: 'en_US',
        type: 'website'
    }
}

export default function App({
    Component,
    pageProps: { session, ...pageProps },

}){
   const [socket, setSocket] = useState(null)
   useEffect(()=>{
   
    if(!socket){
        const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL)
        setSocket(newSocket)
    }
    
    return () => {
        if(socket){
            socket.disconnect();
        }
      };
   }, [socket])
    return (
        <SessionProvider session={session}>
            <Script src="https://cdn.socket.io/3.1.3/socket.io.min.js" integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh" crossorigin="anonymous"></Script>
            <NewNotificationDisplay socket={socket}/>
            <Component {...pageProps} socket={socket}/>
            
        </SessionProvider>
    )

}
