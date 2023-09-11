import { parseGame } from "@mliebelt/pgn-parser"
import { useEffect, useState } from "react"

export default function GameDataDisplay({pgn}){
    const [gameData, setGameData] = useState(null)
    useEffect(()=>{
        if(pgn){
            setGameData( parseGame(pgn).tags)
        }
        
    }, [pgn])
    
    
    return (
        <div>
        {gameData&&(
            <>
            <div><label className=" font-medium text-lg">{gameData.Event}</label></div>   
            <div><label className=" p-1 text-lg">{"♙"+gameData.White+" "+gameData.WhiteElo}</label><label className=" text-lg"> vs. </label><label className=" p-1  text-lg">{"♟"+gameData.Black+" "+gameData.BlackElo}</label></div>
            <div><label className=" p-1  text-lg">{gameData.Result}</label></div>
            <div><label className=" p-1  text-lg">{"⏰"+gameData.TimeControl.value}</label></div>
            <div><label className="p-1  text-lg">{gameData.Date.value}</label></div>   
            </>
        )}
           
        </div>
    
    )
}