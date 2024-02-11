import { useEffect, useState } from "react";


export default function useNotifications(socket, session){
    const [notifications, setNotifications] = useState([])
    useEffect(()=>{
        async function listenForNotifications(){
           if(socket && session){
            await socket.on('notifications', newNotifications=>setNotifications(JSON.parse(newNotifications)))
            await socket.emit('getNotifications', session.token)
        } 
        
        }
        listenForNotifications()
        
    }, [socket, session])
    return notifications
}