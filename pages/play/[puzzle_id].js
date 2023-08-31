
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
    const {puzzle_id, continuation, fen, turn}=JSON.parse(puzzle)
    const [success_rate, setSuccessRate] = useState(0)
    const [attempts, setAttempts] = useState(0)
    useEffect(()=>{
       
        const startState = {
            "puzzle_id": puzzle_id,
            "start_time": Date.now(),
            "continuation" : JSON.parse(continuation),
            "nextMove" : JSON.parse([continuation][0]),
            "state" : "PLAYERS_TURN",
            "fen" : fen,
            "playerTurn" : turn?"w":"b",
            "currentTurn" : turn?"w":"b",
            "startingFEN" : fen, 
            "currentMoveNumber" : 0
        }
        setGameState(startState)
    }, [puzzle])
    useEffect(()=>{
        if(gameState){
            if(gameState.state == "COMPLETED" || gameState.state == "FAILED"){
                fetch("/api/db/getPuzzleStats", {
                    'method': "POST",
                    'headers':{
                        'content-type': 'application/text'
                    },
                    'body': puzzle_id
                }).then( response => {
                    if(!response.ok){
                        console.log(response.status)
                    }
                    return response.json()
                }).then( result => {
                    console.log(result)
                    let [newSuccessRate, newAttempts] = [result.success_rate, result.attempts+1]
                    if(gameState.state == "COMPLETED") newSuccessRate += 1
                    fetch('/api/db/updatePuzzleStats', {
                        'method':"POST",
                        'headers':{
                            'content-type':'application/json'
                        },
                        'body':JSON.stringify({puzzle_id, newSuccessRate, newAttempts})
                    })
                    setAttempts(newAttempts)
                    setSuccessRate(newSuccessRate)
                })
            }
        }
        
    }, [gameState])

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
        <DisplayPuzzleData attempts={attempts} successRate={success_rate} timeSpent={timeSpent} solution={gameState.continuation} result={gameState.state}></DisplayPuzzleData>
        </div>
            
        }
        </div>
        
    )
}

export async function getServerSideProps(context){
    
    const {puzzle_id} = context.query
    
    let puzzle = await getPuzzle(parseInt(puzzle_id))
    return { props : { 'puzzle': JSON.stringify(puzzle)}}
}