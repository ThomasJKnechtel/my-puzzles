import { useEffect, useState } from "react";
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
    useEffect(()=>{
        if(socket){
            socket.emit('ConnectToGame', {token: sessionData.token} )
            socket.on('game_message', (message)=>{

                console.log(sessionData)
                const gameState = JSON.parse(message)
                if(gameState.challenger === sessionData.user.name){
                    const puzzleState = JSON.parse(gameState.challengersPuzzleState)
                    setFen(puzzleState.fen)
                    setTurn(puzzleState.turn)
                    setPuzzleState(puzzleState.state)
                }else{
                    const puzzleState = JSON.parse(gameState.opponentsPuzzleState)
                    setFen(puzzleState.fen)
                    setTurn(puzzleState.turn)
                    setPuzzleState(puzzleState.state)
                }
               
            })
        }
    }, [socket])
    return (
        <PuzzleChess gameState={puzzleState} fen={fen} playersTurn={turn}/>
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