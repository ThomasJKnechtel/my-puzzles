import { useEffect, useState } from "react";
import PGNViewer from "@/components/pgnViewer";
import PuzzleChess from "@/components/puzzleChess";
import Timer from "@/components/timer";
import getTimeInMillis from "@/utils/getTimeMillis";
export default function Blitz({socket}){
    const [currentMove, setCurrentMove] = useState(null)
    const [gameState, setGameState] = useState(null)
    const [puzzles, setPuzzles] = useState([])
    const [pgnViewerObject, setPgnViewerObject] = useState([])
    const [gameFinished, setGameFinished] = useState(false)
    useEffect(()=>{
        if(socket){
          
            socket.emit('playBlitz')
            socket.on('timesUp', ()=>{
                setGameFinished(true)
            })
        }
        
    }, [socket])
    useEffect(()=>{
        let puzzleList = JSON.parse(sessionStorage.getItem('puzzles'))
        let puzzle = puzzleList.pop()
        if(!puzzle) puzzle=puzzleList.pop()
        const {puzzle_id, continuation, fen, turn, success_rate, attempts} = puzzleList.pop()
        const startState = {
            "puzzle_id": puzzle_id,
            "start_time": Date.now(),
            "continuation" : continuation,
            "nextMove" : [...continuation][0],
            "state" : "PLAYERS_TURN",
            "fen" : fen,
            "playerTurn" : turn?"w":"b",
            "currentTurn" : turn?"w":"b",
            "startingFEN" : fen, 
            "currentMoveNumber" : 0
        }
        setPuzzles(puzzleList)
        setGameState(startState)
    }, [])
    useEffect(()=>{
        if(gameState){
            if(gameState.state == "COMPLETED" || gameState.state == "FAILED"){
                const puzzle = puzzles.pop()
                if(puzzle){
                    const {puzzle_id, continuation, fen, turn, success_rate, attempts} = puzzles.pop()
                    const startState = {
                        "puzzle_id": puzzle_id,
                        "start_time": Date.now(),
                        "continuation" : continuation,
                        "nextMove" : [...continuation][0],
                        "state" : "PLAYERS_TURN",
                        "fen" : fen,
                        "playerTurn" : turn?"w":"b",
                        "currentTurn" : turn?"w":"b",
                        "startingFEN" : fen, 
                        "currentMoveNumber" : 0
                    }
                    setPgnViewerObject([])
                    setCurrentMove(null)
                    setPuzzles([...puzzles])
                    setGameState(startState)
                }else{
                    console.log('complete')
                }
               
                
            }
        }
    }, [gameState])

    return (
    <div className=" w-full inline-flex justify-center flex-row mt-5 "> 
        <div>
            <Timer time={gameFinished?0:3*60*1000} start={true} pause={gameFinished}></Timer>
        </div>
        <div>
            {gameState&&
                <PuzzleChess gameState={gameState} setGameState={setGameState} pgnViewerObject={pgnViewerObject} setPgnViewerObject={setPgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PuzzleChess>  
            }
            
        </div>
        <div className="ml-1">
                <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PGNViewer>
        </div>
    </div>
    )
}