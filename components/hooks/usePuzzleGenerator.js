import { parseGame } from "@mliebelt/pgn-parser";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

export default function usePuzzleGenerator(){
    const [puzzles, setPuzzles] = useState([])
    useEffect(()=>{
        const puzzles =  JSON.parse(sessionStorage.getItem('gamesPgns'))
        if(puzzles && puzzles.length > 0){

        }
    }, [])

    function createBatches(pgn){
       const game = new Chess()
       
       game.loadPgn(pgn)
       const moves = game.moves()
       moves.forEach((move, index) => {
        if(index < 10 ){
            game.move({from:move.from, to:move.to, promotion:move.promotion})
        }else
       
        
       });
    }
}