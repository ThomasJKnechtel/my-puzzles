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
   async function connectWebSocket(){
        try{
            const newSocket = await io(process.env.NEXT_PUBLIC_WEBSOCKET_URL)
            setSocket(newSocket)
            if(!newSocket.connected){
                window.alert('Not Connected to WebSocket')
            }
        }catch(err){
            window.alert(err)
        }
    }
    if(!socket){
        connectWebSocket()
    }
    
    return () => {
        if(socket){
            socket.disconnect();
        }
      };
   }, [socket])
    return (
        <SessionProvider session={session}>
            <Script src="/socket.io/socket.io.js"/>
            <NewNotificationDisplay socket={socket}/>
            <Component {...pageProps} socket={socket}/>
            
        </SessionProvider>
    )

}
