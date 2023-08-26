
import { useEffect, useState } from "react";
import getPuzzle from "../api/db/getPuzzle";
import PuzzleChess from "@/components/puzzleChess";
import PGNViewer from "@/components/pgnViewer";
import DisplayPuzzleData from "@/components/puzzleDataDisplay";
import Stopwatch from "@/components/stopwatch";

export default function PlayPuzzlePage({puzzle, session}){
    const [gameState, setGameState] = useState(null)
    const [pgnViewerObject, setPgnViewerObject] = useState([])
    const [currentMove, setCurrentMove] = useState(null)
    const [timeSpent, setTimeSpent] = useState(null)
    const {puzzle_id, continuation, fen, turn, success_rate, attempts}=JSON.parse(puzzle)
    useEffect(()=>{
       
        const startState = {
            "puzzle_id": puzzle_id,
            "start_time": Date.now(),
            "continuation" : JSON.parse(continuation),
            "nextMove" : [...JSON.parse(continuation)][0],
            "state" : "PLAYERS_TURN",
            "fen" : fen,
            "playerTurn" : turn?"w":"b",
            "currentTurn" : turn?"w":"b",
            "startingFEN" : fen, 
            "currentMoveNumber" : 0
        }
        setGameState(startState)
    }, [puzzle])
    

    return (
    
        <div className=" w-full inline-flex justify-center flex-row mt-5 "> 
        {gameState&&
            <Stopwatch start={true} stop={gameState.state=="COMPLETED"||gameState.state=="FAILED"} setTimeSpent={setTimeSpent}></Stopwatch>
        }
            
            <div>
                {gameState&&
                    <PuzzleChess gameState={gameState} setGameState={setGameState} pgnViewerObject={pgnViewerObject} setPgnViewerObject={setPgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PuzzleChess>  
                }
                
            </div>
            <div className="ml-1">
                <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PGNViewer>
            </div>
            {(gameState&&timeSpent&&(gameState.state=="COMPLETED"||gameState.state=="FAILED"))&&
        <div className=" absolute mx-auto z-10 top-10 shadow-2xl">
        <DisplayPuzzleData attempts={attempts} successRate={success_rate} timeSpent={timeSpent} solution={"1. e4 e5 2. Nf3"} result={gameState.state}></DisplayPuzzleData>
        </div>
            
        }
        </div>
        
    )
}

export async function getServerSideProps(context){
   
    const {puzzle_id} = context.query
    console.log(puzzle_id)
    const puzzle = await getPuzzle(parseInt(puzzle_id))
    return { props : { 'puzzle': JSON.stringify(puzzle)}}
}