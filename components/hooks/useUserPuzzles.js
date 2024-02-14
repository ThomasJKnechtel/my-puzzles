import { useEffect, useState } from "react";

export default function useUserPuzzles(){
    const [puzzles, setPuzzles] = useState([])
    useEffect(()=>{
        
        fetch('/api/db/getUserPuzzles', 
            {
            method: "POST",
            headers: { 'content-type': 'application/json'}
            }).then(response => response?.json()).then(result => setPuzzles(result))
        
    }, [])
    return puzzles
}