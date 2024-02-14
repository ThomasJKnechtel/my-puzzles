import { useEffect, useState } from "react";


export default function useNotifications(socket, session){
    const [notifications, setNotifications] = useState({})
    useEffect(()=>{
       
        if(socket && session){
          socket.on('notifications', newNotifications=>setNotifications(JSON.parse(newNotifications)))
            socket.emit('getNotifications', session.token)
        } 
        
    }, [socket, session])
    return notifications
}