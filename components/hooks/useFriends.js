import { useEffect, useState } from "react";

export default function useFriends(username){
    const [friends, setFriends] = useState([])
    useEffect(()=>{
        if(username){
            fetch('/api/db/getFriends', 
            {
            method: "POST",
            headers: { 'content-type': 'application/json'},
            body: JSON.stringify({username})
            }).then(response => response?.json()).then(result => setFriends(result[0]))
        }
    }, [username])
    return friends
}