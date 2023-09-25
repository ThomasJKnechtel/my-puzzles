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
import LobbyPuzzleTable from "@/components/lobbyPuzzleTable";
import { useMemo } from "react";


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
    
    useEffect(()=>{

    }, [formOpen])

    function createChallenge(){
        if(socket){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle.puzzle_id)
            const timeControl = document.querySelector('input[name="timeControl"]:checked').value
            socket.emit('createChallenge', {token: sessionData.token, challenge:{challengerPuzzleIds:puzzleIds, timeControl}})
        }
    }
    function acceptChallenge(challenge){
        const {challenger, challengerPuzzleIds, timeControl} = challenge
        if(socket && challengerPuzzleIds.length === selectedPuzzles.length){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle.puzzle_id)
            socket.emit('challengeAccepted', {token: sessionData.token, challenge: {...challenge, challenger, challengerPuzzleIds, timeControl, opponentPuzzles:puzzleIds}})
            
        }
    }
    function onPuzzleChecked(event, puzzle){
        const checkedPuzzle = event.currentTarget
        if(checkedPuzzle.checked){
            setSelectedPuzzles(oldPuzzles => oldPuzzles.concat([puzzle]))
        }else{
            setSelectedPuzzles(oldPuzzles => oldPuzzles.filter(oldPuzzle => oldPuzzle.puzzle_id !== parseInt(checkedPuzzle.value, 10)))
        }
    }
    
    return (
        <div className=" flex flex-row items-stretch justify-stretch w-full h-full ">
            <div className=" flex flex-col w-full h-full justify-stretch basis-4/5">
                <div className=" bg-white flex flex-col items-center gap-3 justify-evenly basis-2/5">
                <div className=' w-full flex flex-row items-center justify-center relative'>
                    <h1 className=" font-bold font-serif text-xl self-center ">Create Challenge</h1>
                    <button id="minimize" type='button' onClick={()=>setFormOpen(true)}  className=' w-3 h-[3px] bg-slate-400 rounded-md absolute right-1' > </button>
                    <button id="maximize" type="button"  className=' hidden' ><Image src={"https://img.icons8.com/ios-filled/50/plus-math.png"} alt="maximize" width={15} height={15}/></button>
                </div>
                    
                    <table className=" border-2">
                        <thead className=" border-2">
                            <tr><th className=" px-2">Puzzle ID</th><th className=" px-2">Rating</th><th className=" px-2">Attempts</th><th className=" px-2">Success Rate</th></tr>
                        
                        </thead> 
                        <tbody className=" bg-white">
                            {
                                selectedPuzzles.map(puzzle => (
                                    <tr className=" border-b-2 border-slate-50" key={puzzle["Puzzle ID"]}><td>{puzzle["Puzzle ID"]}</td><td>{puzzle["Rating"]}</td><td>{puzzle["Attempts"]}</td><td>{puzzle["Success Rate"]}</td></tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <button className=" button-3">Challenge</button>
            </div>
                <div className=" basis-3/5">
                {
                    useMemo(()=>(<LobbyPuzzleTable setSelectedPuzzles={setSelectedPuzzles} puzzles={JSON.parse(puzzles)}/>), [puzzles])
                } 
                </div>
            </div>
            <div className=" basis-1/5">
                <h1>Incoming Challenges</h1>
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
  