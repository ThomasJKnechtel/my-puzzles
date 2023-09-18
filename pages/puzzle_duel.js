import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import PuzzleChess from "@/components/puzzleChess";
import Timer from "@/components/timer";

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
    useEffect(()=>{
        if(socket){
            socket.emit('ConnectToGame', {token: sessionData.token} )
            socket.on('game_message', (newGameState)=>{
                console.log(newGameState)
                setGameState(newGameState)
               
            })
        }
    }, [socket, sessionData])
    
    return (
      <div className=" w-full h-full flex flex-row justify-center items-center relative gap-5">
      <span className=" absolute right-2 top-2">
        <Timer time={3*60*1000} start />
      </span>
      
        <PuzzleChess addMove={addMove} gameState={gameState?.puzzleState} fen={gameState?.puzzleState?.fen} playersTurn={gameState?.puzzleState?.playersTurn}/>
        <div className=" basis-1/5 bg-white flex flex-col items-center gap-5 rounded-md">
          <h1 className=" font-bold text-3xl font-mono green w-full text-center text-white p-2 rounded-t-md">Puzzle Duel</h1> 
          <h1 className=" font-medium text-[20px] opacity-70">{gameState.timeControl}</h1>
          <div className=" inline-flex flex-row gap-2">
           
            <div className=" flex items-center flex-col font-medium">
              <h2 >{gameState.challenger}</h2>
              <h3 className=" text-xs opacity-50">{gameState.challengerRating}</h3>
              <h3 className=" text-[10px] opacity-50 text-green-500">{gameState.challengerState}</h3>
              </div>
            <h2 className=" italic">vs</h2>
            <div className=" flex items-center flex-col font-medium">
            <h2>{gameState.opponent}</h2>
            <h3 className=" text-xs opacity-50">{gameState.opponentRating}</h3>
            <h3  className={gameState.opponentState==="CONNECTED"||gameState.opponentState==="READY"?" text-green-500 text-[10px] opacity-50":"text-red-600 text-[10px] opacity-50"}> {gameState.opponentState}</h3>
            </div>
            
          </div>
          <h2 className=" font-medium opacity-70 mb-5">{`Puzzles: ${gameState.numberOfPuzzles}`}</h2>
          
          <button id="readyButton" type="button" className="button-3 green m-5" onClick={ready}>Ready</button>
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