import { useEffect, useState } from "react";
import PGNViewer from "@/components/pgnViewer";
import PuzzleChess from "@/components/puzzleChess";
import Timer from "@/components/timer";
import getTimeInMillis from "@/utils/getTimeMillis";
import PuzzleResultsDisplay from "@/components/puzzleResultsDisplay";
import GameResultDisplay from "@/components/gameResultDisplay";
import { useSearchParams } from "next/navigation";
export default function Blitz({socket}){
    const [currentMove, setCurrentMove] = useState(null)
    const [gameState, setGameState] = useState(null)
    const [puzzles, setPuzzles] = useState([])
    const [pgnViewerObject, setPgnViewerObject] = useState([])
    const [gameFinished, setGameFinished] = useState(false)
    const [finishedPuzzlesStats, setFinishedPuzzlesStats] = useState([])
    const [timeControl, setTimeControl] = useState(3)
    useEffect(()=>{
        if(socket){
            const searchParams = new URLSearchParams(location.search)
            const timeControl = searchParams.get('timeControl')
            if(timeControl=="5"){
                socket.emit('play5')
                setTimeControl(5)
            } 
            else{
                socket.emit('play3')
                setTimeControl(3)
            } 
            socket.on('timesUp', ()=>{
                setGameFinished(true)
            })
        }
        
    }, [socket])
    useEffect(()=>{
        let puzzleList = JSON.parse(sessionStorage.getItem('puzzles'))
        const {puzzle_id, continuation, fen, turn, success_rate, attempts} = puzzleList.pop()
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
        setPuzzles(puzzleList)
        setGameState(startState)
    }, [])
    useEffect(()=>{
        if(gameState){
            if(gameState.state == "COMPLETED" || gameState.state == "FAILED"){
                let tempPuzzleStatas = finishedPuzzlesStats
                const {start_time, state} = gameState
                tempPuzzleStatas.push({start_time, state, finish_time: Date.now()})
                setFinishedPuzzlesStats(structuredClone(tempPuzzleStatas))
                const puzzle = puzzles.pop()
                if(puzzle){
                    const {puzzle_id, continuation, fen, turn, success_rate, attempts} = puzzles.pop()
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
                    setPgnViewerObject([])
                    setCurrentMove(null)
                    setPuzzles([...puzzles])
                    setGameState(startState)
                }else{
                   setGameFinished(true)
                }
               
                
            }
        }
    }, [gameState])

    return (
    <div className=" w-full inline-flex flex-col justify-center items-center">
        <div className=" w-full inline-flex justify-center flex-row mt-5 "> 
        {gameFinished&&
            <div className=" absolute z-50 m-10">
                <GameResultDisplay puzzleStats={finishedPuzzlesStats}></GameResultDisplay>
            </div>
        }
            
            <div>
                <Timer time={timeControl*60*1000} start={true} pause={gameFinished}></Timer>
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
        <div className="">
                    <PuzzleResultsDisplay puzzlesStats={finishedPuzzlesStats}></PuzzleResultsDisplay>
        </div>
    </div>
    )
}