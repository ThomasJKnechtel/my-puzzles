import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]";
import PuzzleChess from "@/components/puzzleChess";
import Timer from "@/components/timer";

export default function PuzzlePage({socket}){
   
    const {data: sessionData } = useSession()
    const [gameState, setGameState]= useState({state: {}, opponentState: {}, playerState: {}})
    
    const addMove = useCallback((move)=>{
      if(socket){
        socket.emit('ADD_MOVE', {'move':move.notation.notation})
      }
    }, [socket])
    function ready(){
      if(socket){
        socket.emit('READY')
      }
    }
    function resign(){
      if(socket){
        socket.emit('RESIGNED')
      }
    }
    
    useEffect(()=>{
        if(socket){
            socket.emit('ConnectToGame', {token: sessionData.token} )
            socket.on('game_message', (newGameState)=>{
              console.log(newGameState)
              const {state, challenger,  opponent} = newGameState
              
                if(challenger.username === sessionData.username){
                  setGameState({...newGameState, playerState: challenger, opponentState: opponent}) 
                }else{
                  setGameState({...newGameState, playerState: opponent, opponentState: challenger}) 
                }
              
            })
        }
    }, [socket, sessionData])
    useEffect(()=>{
      if(gameState.state.finishTime){
        setTimeout(()=>{
        if(socket){
          socket.emit('TIMES_UP')
        }
      }, gameState.state.finishTime-Date.now())
      }
      
    }, [socket, gameState.state.finishTime])
    return (
      <div className=" w-full h-full flex flex-row justify-center items-center relative gap-5">
      <span className=" absolute right-2 top-2">
        <Timer time={(gameState.state.finishTime)?(gameState.state.finishTime-Date.now()):3*60*1000} start={gameState.state.state === "IN_PROGRESS"} pause={gameState.state.state==="FINISHED"} />
      </span>
      
        <PuzzleChess addMove={addMove} gameState={gameState.playerState?.puzzleState?.state} fen={gameState?.playerState?.puzzleState?.fen} playersTurn={gameState.playerState.puzzleState?.playerTurn}/>
        <div className=" basis-1/5 bg-white flex flex-col items-center gap-5 rounded-md">
          <h1 className=" font-bold text-3xl font-mono green w-full text-center text-white p-2 rounded-t-md">Puzzle Duel</h1> 
          <h1 className=" font-medium text-[20px] opacity-70">{gameState.state.timeControl}</h1>
          <div className=" inline-flex flex-row gap-2">
           
            <div className=" flex items-center flex-col font-medium">
              <h2 >{gameState.playerState.username}</h2>
              <h3 className=" text-xs opacity-50 inline-flex flex-row">{`${gameState.playerState.rating}`}{gameState.state?.state === "FINISHED"&&<span className=" opacity-60 inline-flex flex-row"><h3 className=" ml-1">{gameState.playerState?.ratingChange>=0?"+":"-"}</h3><h3>{Math.abs(gameState.playerState?.ratingChange)}</h3></span>}</h3>
              <h3  className={gameState.playerState.state==="CONNECTED"||gameState.playerState.state==="READY"||gameState.playerState?.state==="WON"||gameState.playerState?.state==="FINISHED"?" text-green-500 text-[10px] opacity-50":"text-red-600 text-[10px] opacity-50"}>{gameState?.playerState.state}</h3>
              <h3>{gameState.playerState?.puzzlesCompleted}</h3>
              </div>
            <h2 className=" italic">vs</h2>
            <div className=" flex items-center flex-col font-medium">
            <h2>{gameState.opponentState.username}</h2>
            <h3 className=" text-xs opacity-50">{gameState.opponentState.rating}{gameState.state.state === "FINISHED"&&<span className=" opacity-60 inline-flex flex-row"><h3 className=" ml-1">{gameState.opponentState.ratingChange>=0?"+":"-"}</h3><h3>{Math.abs(gameState.opponentState.ratingChange)}</h3></span>}</h3>
            <h3  className={gameState?.opponentState?.state==="CONNECTED"||gameState.opponentState.state==="READY"||gameState.opponentState.state==="WON"||gameState.opponentState.state==="FINISHED"?" text-green-500 text-[10px] opacity-50":"text-red-600 text-[10px] opacity-50"}> {gameState.opponentState.state}</h3>
            <h3>{gameState.opponentState.puzzlesCompleted}</h3>
            </div>
            
          </div>
          <h2 className=" font-medium opacity-70 mb-5">{`Puzzles: ${gameState.state.numberOfPuzzles}`}</h2>
          {gameState?.state?.state === "WAITING"&&
            <button id="readyButton" type="button" className="button-3 green m-5" onClick={ready}>Ready</button>
          }
          {gameState?.state?.state === "IN_PROGRESS"&&
            <button id="resignButton" type="button" className="button-3 green m-5" onClick={resign}>Resign</button>
          }
          {gameState?.state?.state === "FINISHED"&&
            <Link className=" button-3 green mb-5" href="/challenge">To Lobby</Link>
          }
          
        </div>
      </div>
        
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    
    return {
      props: {
        session
      },
    };
  }