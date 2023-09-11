/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */



import { useCallback, useEffect, useReducer, useState } from "react";
import Link from "next/link";

import { Chess } from "chess.js";
import LegalChess from "@/components/chessboard";
import Layout from "@/components/layout";
import getPGNViewerObject, { getMove, addMove as addMoveToPGNViewer } from "@/utils/PGNViewerObject";
import PGNViewer from "@/components/pgnViewer";
import GameDataDisplay from "@/components/displayGameData";

function reducer(state, action){
    const { currentMove, pgnViewerObject, fen} = state
    if(action.type === "INITIALIZE"){
        return { ...state, pgnViewerObject:action.pgnViewerObject}
    }
    if(action.type === "ADD_MOVE"){
        let [ newPgnViewerObject, newFEN, coordinates] = [ pgnViewerObject, fen, currentMove?currentMove.coordinates:null ]
        newFEN = action.fen
        coordinates = addMoveToPGNViewer(newPgnViewerObject, coordinates, action.move)
        const newCurrentMove = getMove(newPgnViewerObject, coordinates)
        return { ...state, currentMove : newCurrentMove, fen: newFEN, pgnViewerObject: newPgnViewerObject}
    }if(action.type === "SET_CURRENT_MOVE"){
        const newCurrentMove = action.currentMove
        const game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        newCurrentMove.variation.forEach((move)=>{
            game.move(move)
        })
        return {...state, fen : game.fen(), currentMove: newCurrentMove}
    }
    return state
}
function GameLayout(){
 const [state, dispatch] = useReducer(reducer, {currentMove: null, fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', pgnViewerObject:[]})
 const [pgn, setPgn] = useState('')
 const {pgnViewerObject, fen, currentMove} = state
  useEffect(()=>{
    // eslint-disable-next-line no-restricted-globals
    const searchParams = new URLSearchParams(location.search)
    const newPGN = JSON.parse(decodeURIComponent(searchParams.get('pgn')))
    setPgn(newPGN)
    dispatch({type:'INITIALIZE', pgnViewerObject: getPGNViewerObject(newPGN)})
    }, [])
    
    const addMove = useCallback((move, newFEN)=>{
        dispatch({type:'ADD_MOVE', fen: newFEN, move})
    }, [])
    const setCurrentMove = useCallback((newCurrentMove)=>{
        dispatch({type:'SET_CURRENT_MOVE', currentMove:newCurrentMove})
    }, [])

    return(
        <div className=" w-full inline-flex justify-center flex-row mt-5 "> 
            
            <div>
                <LegalChess fen={fen} addMove={addMove}/>         
            </div>
            <div className="ml-1">
                <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove}/>
            </div>
            <div className=" ml-2">
                <GameDataDisplay pgn={pgn}/>
                <Link href="/"><button type="button" className="button-3 green mt-4">Back to Search</button></Link>
            </div>
            
        </div>
    )
}

export default function Game(){
    
    return(
        <Layout>
            <GameLayout />
        </Layout>
        
    )
    
}

