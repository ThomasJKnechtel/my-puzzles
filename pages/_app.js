import { SessionProvider } from "next-auth/react"
import  "../styles/globals.css"
import '../styles/ag-grid.css'
import Script from "next/script"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import NewNotificationDisplay from "@/components/newNotificationDisplay"

export default function App({
    Component,
    pageProps: { session, ...pageProps },

}){
   const [socket, setSocket] = useState(null)
   useEffect(()=>{
    if(!socket){
        const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL)
        setSocket(newSocket)
        newSocket.on('connect_error', (err)=>{
            window.alert(err)
        })
	    window.alert(process.env.NEXT_PUBLIC_WEBSOCKET_URL)
    }
    
    return () => {
        if(socket){
            socket.disconnect();
        }
      };
   }, [socket])
    return (
        <SessionProvider session={session}>
            <NewNotificationDisplay socket={socket}/>
            <Component {...pageProps} socket={socket}/>
            
        </SessionProvider>
    )

}
