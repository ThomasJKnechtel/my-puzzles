/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { authOptions } from "./api/auth/[...nextauth]";
import getPuzzles from "./api/db/getPuzzles";
import { useCallback } from "react";
import Image from "next/image";

import Layout from "@/components/layout";
import LobbyPuzzleTable from "@/components/lobby/lobbyPuzzleTable";
import { useMemo } from "react";
import ChallengeForm from "@/components/lobby/challengeForm";
import ChallengePuzzleTable from "@/components/lobby/challengePuzzleTable";


const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
});


export default function LobbyPage({socket, puzzles}){
    const [challenges, setChallenges] = useState([])
    const [selectedPuzzles, setSelectedPuzzles] = useState([])
    const [formOpen, setFormOpen] = useState(true)
    const {data: sessionData } = useSession()

    useEffect(()=>{
        if(socket){
            socket.emit('getChallenges')
            socket.on('challenges', (currentChallenges)=>{
                setChallenges(currentChallenges)
            })
            socket.on('game_message', (gameState)=>{
                if(gameState.state.state === "WAITING") window.location.href = "/puzzle_duel"
            })
        }
    }, [socket])
   
    return (
        <div className=" flex flex-row items-stretch justify-stretch w-full h-full ">
            <div className=" flex flex-col w-full h-full justify-stretch basis-3/5">
                <div className={formOpen?" basis-2/5":" basis-10"}>
                    <ChallengeForm formOpen={formOpen} setFormOpen={setFormOpen} selectedPuzzles={selectedPuzzles} socket={socket} token={sessionData?.token}/>
                </div>
                
                <div className={ formOpen?" basis-3/5":" basis-full"}>
                {
                    useMemo(()=><LobbyPuzzleTable setSelectedPuzzles={setSelectedPuzzles} puzzles={JSON.parse(puzzles)}/>, [puzzles])
                    
                } 
                </div>
            </div>
            <div className=" basis-2/5 ">
                <ChallengePuzzleTable challenges={challenges} username={sessionData?.username} socket={socket} selectedPuzzles={selectedPuzzles} token={sessionData?.token}></ChallengePuzzleTable>
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
    const puzzles = JSON.stringify(await getPuzzles({username: session.username, sortCriteria:'dateUploaded'}))
    return {
      props: {
        puzzles
      },
    };
  }
  