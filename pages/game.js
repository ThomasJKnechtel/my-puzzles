/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */



import { useCallback, useEffect, useReducer, useState } from "react";
import Link from "next/link";

import { Chess } from "chess.js";
import LegalChess from "@/components/chessboard";
import Layout from "@/components/layout/layout";
import getPGNViewerObject, { getMove, addMove as addMoveToPGNViewer } from "@/utils/PGNViewerObject";
import PGNViewer from "@/components/pgnViewer";
import GameDataDisplay from "@/components/displayGameData";
import useWindowSize from "@/components/hooks/useWindowSize";

function reducer(state, action){
    const { currentMove, pgnViewerObject, fen} = state
    if(action.type === "INITIALIZE"){
        return { ...state, pgnViewerObject:action.pgnViewerObject}
    }
    if(action.type === "ADD_MOVE"){
        // eslint-disable-next-line prefer-const
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
 const [boardFocus, setBoardFocus] = useState(false)
 const {pgnViewerObject, fen, currentMove} = state
 const [width, height] = useWindowSize()
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
    const calculateBoardSize = useCallback(()=>{
        if(!boardFocus){
            if(width>height) return height*4/6
            return width 
        }
        if(width>height) return height*7/8
        return width 
        }, [width, height,boardFocus])
  
    return(
        <div className=" w-full flex justify-center max-sm:flex-col gap-1 max-sm:items-center "> 
            
            <div>
                <LegalChess fen={fen} addMove={addMove} boardSize={calculateBoardSize()}/>         
            </div>
            <div className=" flex  ml-1 max-h-[600px] h-[180px]">
                <PGNViewer pgnViewerObject={pgnViewerObject} currentMove={currentMove} setCurrentMove={setCurrentMove} display/>
            </div>
            {width>800&&
                <div className=" ml-2">
                    <GameDataDisplay pgn={pgn}/>
                    <Link href="/"><button type="button" className="button-3 green mt-4">Back to Search</button></Link>
                </div>
            }
            
            
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

