import { SessionProvider } from "next-auth/react"
import  "../styles/globals.css"
import Script from "next/script"
import { useEffect, useState } from "react"
import getSocket from "@/utils/socket"
import { io } from "socket.io-client"

export default function App({
    Component,
    pageProps: { session, ...pageProps },

}){
   const [socket, setSocket] = useState(null)
   useEffect(()=>{
   
    const newSocket = io('http://localhost:5050')
    setSocket(newSocket)
    
    
    return () => {
       socket.disconnect();
      };
   }, [])
    return (
        <SessionProvider session={session}>
            <Script src="https://cdn.socket.io/3.1.3/socket.io.min.js" integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh" crossorigin="anonymous"></Script>
            <Component {...pageProps} socket={socket}/>
            
        </SessionProvider>
    )

}