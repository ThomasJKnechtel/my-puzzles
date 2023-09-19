import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import PuzzleChess from "@/components/puzzleChess";
import Timer from "@/components/timer";
import Link from "next/link";

export default function PuzzlePage({socket}){
   
    const {data: sessionData } = useSession()
    const [gameState, setGameState]= useState({})
    
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
              if(newGameState.state === "IN_PROGRESS" || newGameState.state === "FINISHED"){
                if(newGameState.challenger === sessionData.user.name){
                  setGameState({...newGameState, puzzleState: newGameState.challengerPuzzleState}) 
                }else{
                  setGameState({...newGameState, puzzleState: newGameState.opponentPuzzleState}) 
                }
              }else{
                setGameState(newGameState)
              }
            })
        }
    }, [socket, sessionData])
    useEffect(()=>{
      if(gameState.finishTime){
        setTimeout(()=>{
        if(socket){
          socket.emit('TIMES_UP')
        }
      }, gameState.finishTime-Date.now())
      }
      
    }, [socket, gameState.finishTime])
    return (
      <div className=" w-full h-full flex flex-row justify-center items-center relative gap-5">
      <span className=" absolute right-2 top-2">
        <Timer time={gameState.finishTime?gameState.finishTime-Date.now():3*60*1000} start={gameState.state === "IN_PROGRESS"} pause={gameState.state==="FINISHED"} />
      </span>
      
        <PuzzleChess addMove={addMove} gameState={gameState?.puzzleState?.state} fen={gameState?.puzzleState?.fen} playersTurn={gameState?.puzzleState?.playerTurn}/>
        <div className=" basis-1/5 bg-white flex flex-col items-center gap-5 rounded-md">
          <h1 className=" font-bold text-3xl font-mono green w-full text-center text-white p-2 rounded-t-md">Puzzle Duel</h1> 
          <h1 className=" font-medium text-[20px] opacity-70">{gameState.timeControl}</h1>
          <div className=" inline-flex flex-row gap-2">
           
            <div className=" flex items-center flex-col font-medium">
              <h2 >{gameState.challenger}</h2>
              <h3 className=" text-xs opacity-50 inline-flex flex-row">{`${gameState.challengerRating}`}{gameState.state === "FINISHED"&&<span className=" opacity-60 inline-flex flex-row"><h3 className=" ml-1">{gameState.challengerRatingChange>=0?"+":"-"}</h3><h3>{Math.abs(gameState.challengerRatingChange)}</h3></span>}</h3>
              <h3  className={gameState.challengerState==="CONNECTED"||gameState.challengerState==="READY"||gameState.challengerState==="WON"||gameState.challengerState==="FINISHED"?" text-green-500 text-[10px] opacity-50":"text-red-600 text-[10px] opacity-50"}>{gameState.challengerState}</h3>
              <h3>{gameState.challengerPuzzlesCompleted}</h3>
              </div>
            <h2 className=" italic">vs</h2>
            <div className=" flex items-center flex-col font-medium">
            <h2>{gameState.opponent}</h2>
            <h3 className=" text-xs opacity-50">{gameState.opponentRating}{gameState.state === "FINISHED"&&<span className=" opacity-60 inline-flex flex-row"><h3 className=" ml-1">{gameState.opponentRatingChange>=0?"+":"-"}</h3><h3>{Math.abs(gameState.opponentRatingChange)}</h3></span>}</h3>
            <h3  className={gameState.opponentState==="CONNECTED"||gameState.opponentState==="READY"||gameState.opponentState==="WON"||gameState.opponentState==="FINISHED"?" text-green-500 text-[10px] opacity-50":"text-red-600 text-[10px] opacity-50"}> {gameState.opponentState}</h3>
            <h3>{gameState.opponentPuzzlesCompleted}</h3>
            </div>
            
          </div>
          <h2 className=" font-medium opacity-70 mb-5">{`Puzzles: ${gameState.numberOfPuzzles}`}</h2>
          {gameState.state === "WAITING"&&
            <button id="readyButton" type="button" className="button-3 green m-5" onClick={ready}>Ready</button>
          }
          {gameState.state === "IN_PROGRESS"&&
            <button id="resignButton" type="button" className="button-3 green m-5" onClick={resign}>Resign</button>
          }
          {gameState.state === "FINISHED"&&
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