import { useEffect, useReducer, useState } from "react";
import PGNViewer from "@/components/pgnViewer";
import PuzzleChess from "@/components/puzzleChess";
import Timer from "@/components/timer";
import getTimeInMillis from "@/utils/getTimeMillis";
import PuzzleResultsDisplay from "@/components/puzzleResultsDisplay";
import GameResultDisplay from "@/components/gameResultDisplay";
import { useSearchParams } from "next/navigation";
import { addMoveToGameState, playMove } from "@/utils/gameState";
import { addMove, getMove } from "@/utils/PGNViewerObject";
import { Chess } from "chess.js";
function reducer(state, action){
    const {finishedPuzzlesStats, gameState, puzzles, currentMove, pgnViewerObject, fen} = state
    if(action.type == "INITIALIZE"){
        return { ...state, puzzles : action.puzzles, gameState : action.gameState, fen : action.gameState.startingFEN}
    }else if(action.type == "PUZZLE_FINISHED"){
        let newFinishedPuzzlesStats = finishedPuzzlesStats.concat([{'start_time': gameState.start_time, 'state':gameState.state, 'finish_time':Date.now()}])
        let newGameState = null
        let newPuzzles = []
        if(state.puzzles.length>0){
            const puzzle = puzzles[0]
            const { continuation, fen, turn, success_rate, attempts} = puzzle
            newGameState = {
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
            newPuzzles = puzzles.slice(1)
            return {...state, finishedPuzzlesStats: newFinishedPuzzlesStats, 'gameState':newGameState, 'puzzles':newPuzzles, gameFinished:false, pgnViewerObject:[], currentMove:null, fen:newGameState.startingFEN}
        }
        return {...state, finishedPuzzlesStats: newFinishedPuzzlesStats, 'gameState':{}, 'puzzles':newPuzzles, gameFinished:true, pgnViewerObject:[], currentMove:null}
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
    }else if(action.type == "TIMES_UP"){
        return {...state, gameFinished : true}
    }
    return state
}

export default function Blitz({socket}){
    const [state, dispatch] = useReducer(reducer, {gameState:{}, puzzles:[], finishedPuzzlesStats:[], gameFinished:false, currentMove:null, pgnViewerObject:[], fen:null})
    const { puzzles, finishedPuzzlesStats, gameState, currentMove, pgnViewerObject, gameFinished, fen} = state
    const [timeControl, setTimeControl] = useState(3)
    useEffect(()=>{
        if(socket){
            
            const searchParams = new URLSearchParams(location.search)
            setTimeControl(parseInt(searchParams.get('timeControl')))
            if(timeControl==5){
                socket.emit('play5')
            } 
            else{
                socket.emit('play3')
            } 
            socket.on('timesUp', ()=>{
                dispatch({type:'TIMES_UP'})
            })
        }
        
    }, [socket, timeControl])
    useEffect(()=>{
        let puzzleList = JSON.parse(sessionStorage.getItem('puzzles'))
        const gameContianer = document.getElementById('container')
        setTimeout(()=>{gameContianer.style.display = "inline-flex"}, 300)
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
        dispatch({type : "INITIALIZE", gameState:startState, puzzles: puzzleList})

    }, [])
    function addMove(move, fen ){
        dispatch({type : 'ADD_MOVE', move: move, fen : fen})
    }
    function setCurrentMove(currentMove){
        dispatch({type: 'SET_CURRENT_MOVE', currentMove:currentMove})
    }
    /**
     * When game finished display stats and update state with new game
     */
    useEffect(()=>{
        if(gameState.state == "COMPLETED" || gameState.state == "FAILED"){
            dispatch({ type: "PUZZLE_FINISHED"})
        }
        
    }, [gameState.state])

    return (
    <div id="container" className=" w-full flex-col justify-center items-center hidden">
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
                
                    <PuzzleChess gameState={gameState.state} fen={fen} addMove={addMove} playersTurn={gameState.playerTurn}></PuzzleChess>  
            </div>
            <div className="ml-1">
                    <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}></PGNViewer>
            </div>
        </div>
        <div id="gameContainer">
                    <PuzzleResultsDisplay puzzlesStats={finishedPuzzlesStats}></PuzzleResultsDisplay>
        </div>
    </div>
    )
}