import { useEffect, useState } from "react";
import splitPGN from "@/utils/splitPgns";

export default function usePuzzleGenerator(){
    const [puzzles, setPuzzles] = useState([])
    useEffect(()=>{
        const games =  JSON.parse(sessionStorage.getItem('gamePgns'))
        if(games && games.length > 0){
            sessionStorage.removeItem('gamePgns')
            let pgns = []
            games.forEach((game)=>{
                try{
                     pgns = pgns.concat(splitPGN(game, [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]))
                }catch{
                    console.log("INVALID PGN")
                }
               
            })
            pgns.forEach((pgn)=>{
                fetch("https://chesspuzzlegenerator2.azurewebsites.net/api/generatePuzzles", {
                    method: "POST",
                    headers: {"content-type":"application/text"},
                    body: pgn
                }).then(async (response)=>{
                    if(response.ok){
                        const newPuzzles = await response.json()
                        setPuzzles((prevPuzzles) => prevPuzzles.concat(newPuzzles));
                    }
                })
            })
        }
    }, [puzzles])
    return [puzzles, setPuzzles] 

}