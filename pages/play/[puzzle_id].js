
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
        const gameContianer = document.getElementById('container')
                    
        setTimeout(()=>{gameContianer.style.display = "inline-flex"}, 500)
        const startState = {
            "puzzle_id": puzzle_id,
            "start_time": Date.now(),
            "continuation" : JSON.parse(continuation),
            "nextMove" : JSON.parse(continuation)[0],
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
                const gameContianer = document.getElementById('container')
                const displayContainer = document.getElementById('displayContainer')    
                gameContianer.style.display = "none"
                setTimeout(()=>{
                    gameContianer.style.display = "inline-flex"
                    displayContainer.style.display = "block"
                }, 300)
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
    
        <div id="container" className=" w-full justify-center flex-row mt-5 hidden "> 
       
            <Stopwatch start={true} stop={gameState&&(gameState.state=="COMPLETED"||gameState.state=="FAILED")} setTimeSpent={setTimeSpent}></Stopwatch>
        
            
            <div>
                
                    <PuzzleChess gameState={gameState} setGameState={setGameState} pgnViewerObject={pgnViewerObject} setPgnViewerObject={setPgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PuzzleChess>  
                
                
            </div>
            <div className="ml-1">
                <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PGNViewer>
            </div>
            
                <div id="displayContainer" className=" absolute mx-auto z-10 top-10 shadow-2xl hidden">
                <DisplayPuzzleData attempts={attempts} successRate={success_rate} timeSpent={timeSpent} solution={gameState&&gameState.continuation} result={gameState&&gameState.state} puzzle_id={puzzle_id}></DisplayPuzzleData>
                </div>
            
        </div>
        
    )
}

export async function getServerSideProps(context){
    
    const {puzzle_id} = context.query
    
    let puzzle = await getPuzzle(parseInt(puzzle_id))
    return { props : { 'puzzle': JSON.stringify(puzzle)}}
}