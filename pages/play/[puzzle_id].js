
import { useEffect, useReducer, useState } from "react";
import getPuzzle from "../api/db/getPuzzle";
import PuzzleChess from "@/components/puzzleChess";
import PGNViewer from "@/components/pgnViewer";
import DisplayPuzzleData from "@/components/puzzleDataDisplay";
import Stopwatch from "@/components/stopwatch";
import { addMove, getMove } from "@/utils/PGNViewerObject";
import { addMoveToGameState, playMove } from "@/utils/gameState";
import { Chess } from "chess.js";
function reducer(state, action){
    const { gameState, currentMove, pgnViewerObject, fen} = state
    if(action.type == "INITIALIZE"){
        return { ...state, gameState : action.gameState, fen : action.gameState.startingFEN}
    }else if(action.type == "ADD_MOVE"){
        let [newGameState, newPgnViewerObject, newFEN, coordinates] = [gameState, pgnViewerObject, fen, currentMove?currentMove.coordinates:null ]
        if(newGameState.state == "PLAYERS_TURN"){
            newFEN = action.fen
            addMoveToGameState(newGameState, action.move.notation.notation, newFEN)
            coordinates = addMove(newPgnViewerObject, coordinates, action.move)
            let newCurrentMove = getMove(newPgnViewerObject, coordinates)
            if(newGameState.state == "OPPONENTS_TURN"){
                const game = new Chess(newFEN)
                const [turn, moveNumber, MOVE] = [game.turn(), game.moveNumber(), game.move(gameState.nextMove)]
                coordinates = addMove(newPgnViewerObject, newCurrentMove.coordinates, {'turn':turn, 'moveNumber': moveNumber, 'notation': {notation:MOVE.san }} )
                newCurrentMove = getMove(newPgnViewerObject, coordinates)
                newFEN = game.fen()
                playMove(newGameState, newFEN)
            }else{
                newGameState.finishedTime = Date.now()
            }
            return { ...state, gameState: newGameState, currentMove : newCurrentMove, pgnViewerObject : newPgnViewerObject, fen: newFEN}
        }
        
    }else if(action.type == "SET_CURRENT_MOVE"){
        const newCurrentMove = action.currentMove
        const game = new Chess(gameState.startingFEN)
        newCurrentMove.continuation.map((move)=>{
            game.move(move)
        })
        return {...state, fen : game.fen()}
    }
    return state
}
export default function PlayPuzzlePage({puzzle, session}){
    const [state, dispatch] = useReducer(reducer, {gameState:[], pgnViewerObject:[], currentMove:null, fen:''})
    const [success_rate, setSuccessRate] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const {gameState, fen, currentMove, pgnViewerObject} = state
    useEffect(()=>{
        const {puzzle_id, continuation, fen, turn} = JSON.parse(puzzle)
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
        dispatch({type:'INITIALIZE', gameState:startState})
    }, [puzzle])
    useEffect(()=>{
            if(gameState.state == "COMPLETED" || gameState.state == "FAILED"){
                
                fetch("/api/db/getPuzzleStats", {
                    'method': "POST",
                    'headers':{
                        'content-type': 'application/text'
                    },
                    'body': gameState.puzzle_id
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
                        'body':JSON.stringify({'puzzle_id':gameState.puzzle_id, newSuccessRate, newAttempts})
                    })
                    setAttempts(newAttempts)
                    setSuccessRate(newSuccessRate)
                })
                document.getElementById('displayContainer').style.display = 'flex'
            }
        }, [gameState.puzzle_id, gameState.state])

        function addMove(move, fen){
            dispatch({type:'ADD_MOVE', move:move, fen:fen})
        }
        function setCurrentMove(move){
            dispatch({type:'SET_CURRENT_MOVE', currentMove:move})
        }
    return (
    
        <div id="container" className=" w-full inline-flex justify-center flex-row mt-5"> 
       
            <Stopwatch start={true} stop={gameState.state=="COMPLETED"||gameState.state=="FAILED"}></Stopwatch>
        
            
            <div>
                
                    <PuzzleChess fen={fen} gameState={gameState.state} addMove={addMove} playersTurn={gameState.playerTurn}></PuzzleChess>  
                
                
            </div>
            <div className="ml-1">
                <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PGNViewer>
            </div>
            
                <div id="displayContainer" className=" absolute mx-auto z-10 top-10 shadow-2xl hidden">
                <DisplayPuzzleData attempts={attempts} successRate={success_rate} timeSpent={gameState.finishedTime-gameState.start_time} solution={gameState.continuation} result={gameState.state} puzzle_id={gameState.puzzle_id}></DisplayPuzzleData>
                </div>
            
        </div>
        
    )
}

export async function getServerSideProps(context){
    
    const {puzzle_id} = context.query
    
    let puzzle = await getPuzzle(parseInt(puzzle_id))
    return { props : { 'puzzle': JSON.stringify(puzzle)}}
}