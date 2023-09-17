import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import LegalChess from "@/components/chessboard";
import PuzzleChess from "@/components/puzzleChess";

export default function PuzzlePage({socket}){
    const [fen, setFen] = useState('')
    const {data: sessionData } = useSession()
    const [turn, setTurn] = useState('w')
    const [puzzleState, setPuzzleState] = useState(null)
    
    const addMove = useCallback((move)=>{
      if(socket){
        socket.emit('ADD_MOVE', {'move':move.notation.notation})
      }
    }, [socket])

    useEffect(()=>{
        if(socket){
            socket.emit('ConnectToGame', {token: sessionData.token} )
            socket.on('game_message', (message)=>{

                const gameState = JSON.parse(message)
                console.log(gameState)
                if(gameState.challenger === sessionData.user.name){
                    const puzzleState = gameState.challengerPuzzleState
                    setFen(puzzleState.fen)
                    setTurn(puzzleState.playerTurn)
                    setPuzzleState(puzzleState.state)
                }else{
                    const puzzleState = gameState.opponentPuzzleState
                    setFen(puzzleState.fen)
                    setTurn(puzzleState.playerTurn)
                    setPuzzleState(puzzleState.state)
                }
               
            })
        }
    }, [socket, sessionData])
    return (
        <PuzzleChess addMove={addMove} gameState={puzzleState} fen={fen} playersTurn={turn}/>
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