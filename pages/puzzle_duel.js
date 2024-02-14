import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]";
import PuzzleChess from "@/components/puzzleChess";
import Timer from "@/components/timer";
import useWindowSize from "@/components/hooks/useWindowSize";
import PuzzleDuelInfo from "@/components/puzzleDuelInfo";
import FocusButton from "@/components/FocusButton";

export default function PuzzlePage({socket}){
   
    const {data: sessionData } = useSession()
    const [gameState, setGameState]= useState({state: {}, opponentState: {}, playerState: {}})
    const [boardFocus, setBoardFocus] = useState(false)
    const [width, height] = useWindowSize()

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
              const { challenger,  opponent} = newGameState
              
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
    const calculateBoardSize = useCallback(()=>{
      if(!boardFocus){
          if(width>height) return height*4/6
          return width 
      }
      if(width>height) return height*7/8
      return width 
      }, [width, height,boardFocus])

    return (
      <div className=" w-full h-full flex max-sm:flex-col justify-center items-center relative gap-5">
      <span className=" absolute right-2 top-2">
        <Timer time={(gameState.state.finishTime)?(gameState.state.finishTime-Date.now()):3*60*1000} start={gameState.state.state === "IN_PROGRESS"} pause={gameState.state.state==="FINISHED"} />
      </span>
      <div className=" relative">
        <PuzzleChess addMove={addMove} gameState={gameState.playerState?.puzzleState?.state} fen={gameState?.playerState?.puzzleState?.fen} playersTurn={gameState.playerState.puzzleState?.playerTurn} boardSize={calculateBoardSize()}/>
        <span className=" absolute top-0 right-0"><FocusButton setFocus={setBoardFocus} focus={boardFocus}/></span>
      </div>
        
        {(gameState.state.state!=="IN_PROGRESS"||width>800)&&!boardFocus&&<span className=" max-sm:absolute z-20"><PuzzleDuelInfo gameState={gameState} ready={ready} resign={resign}/></span>}
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
    if(!session.username){
      return {
          redirect: {
            destination: '/signup',
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