import { SessionProvider } from "next-auth/react"
import  "../styles/globals.css"
import Script from "next/script"


export default function App({
    Component,
    pageProps: { session, ...pageProps },

}){
   
   
    return (
        <SessionProvider session={session}>
            <Script src="https://cdn.socket.io/3.1.3/socket.io.min.js" integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh" crossorigin="anonymous"></Script>
            <Component {...pageProps}/>
            
        </SessionProvider>
    )

}