
import { useEffect, useState } from "react";
import getPuzzle from "../api/db/getPuzzle";
import playPuzzle from "@/Modules/playPuzzle";
import PuzzleChess from "@/components/puzzleBoard";
import getPGN from "@/utils/jsonToPGN";
export default function PlayPuzzlePage({puzzle, session}){
    const [gameData, setGameData] = useState(null)
    const [currentVariaton, setCurrentVariation] = useState({moves:[], startingMove:0, firstMove: '', depth:0, parentVariations:[]})

    useEffect(()=>{
        sessionStorage.setItem('puzzle', puzzle)
        puzzle = JSON.parse(puzzle)
        const gameData = {'fen': puzzle.fen, 'continuation':JSON.parse(puzzle.continuation), 'movesLeft':JSON.parse(puzzle.continuation), 'playerColour':puzzle.turn, 'progress':"IN_PROGRESS" }
        sessionStorage.setItem('puzzle-game', JSON.stringify(gameData))
        
        setGameData(playPuzzle(gameData, 'Qb6'))
    }, [puzzle])
    return (<>{getPGN(gameData.fen, gameData.continuation)}</>)
}

export async function getServerSideProps(context){
   
    const {puzzle_id} = context.query
    console.log(puzzle_id)
    const puzzle = await getPuzzle(parseInt(puzzle_id))
    return { props : { 'puzzle': JSON.stringify(puzzle)}}
}