/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import { getServerSession } from "next-auth";
import { useEffect, useState , useMemo } from "react";

import { authOptions } from "./api/auth/[...nextauth]";
import getPuzzles from "./api/db/getPuzzles";


import Layout from "@/components/layout/layout";
import LobbyPuzzleTable from "@/components/lobby/lobbyPuzzleTable";
import FocusButton from "@/components/FocusButton";
import ChallengeSection from "@/components/lobby/challengeSection";
import connectDB from "@/utils/dbConnect";

export default function LobbyPage({socket, puzzles, query}){
    const [challenges, setChallenges] = useState([])
    const [selectedPuzzles, setSelectedPuzzles] = useState([])
    const [formFocus, setFormFocus] = useState(true)

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
        if(formFocus){
            document.querySelector('#tableContainer').classList.remove('hidden')
        }else{
            document.querySelector('#tableContainer').classList.add('hidden')
        }
    }, [formFocus])
   
    return (
        <Layout searchLink selectPuzzles>
            <form className=" flex flex-col items-stretch p-2 gap-1 relative">
                <label className=" relative inline-flex justify-center bg-slate-500 text-slate-300 font-bold rounded-sm text-center shadow-md hover:bg-slate-600 p-1 ">3 Minute<input type="radio" value="3Minute" name="timeControl" checked className=" absolute right-3 top-[10px] checked:text-gray-400"  /></label>
                <label className=" relative inline-flex justify-center bg-slate-500 text-slate-300 font-bold rounded-sm text-center shadow-md hover:bg-slate-600 p-1">5 Minute<input type="radio" value="5Minute" name="timeControl" className=" absolute right-3 top-[10px] checked:text-gray-400"  /></label>

            </form>
            <div  className=" w-full h-4/5 relative  ">
                {!formFocus&&<label className=" font-bold text-sm text-center w-full block border-b-2 p-1">Select Puzzles</label>}
                <div id="tableContainer" className=" w-full h-full max-h-[500px] max-w-[1220px] mx-auto flex flex-col items-center">
                    {useMemo(()=><LobbyPuzzleTable setSelectedPuzzles={setSelectedPuzzles} puzzles={JSON.parse(puzzles)}/>, [puzzles])}
                    <button onClick={()=>setFormFocus(false)} className=" items-center m-2 px-3 py-1 font-medium border-2 rounded-md bg-white ring-2 hover:bg-slate-100 hover:ring-blue-500 hover:font-bold ">Next</button>
                </div>
                
                <div className=" absolute top-0 right-0"><FocusButton focus={formFocus} setFocus={setFormFocus}/></div>
                <div className=" h-full">
                    <span className=" relative w-full"><button type="button" onClick={()=>setFormFocus(focus=>!focus)} className=" font-bold p-1 block w-full border-t-2 border-b-2 text-center relative ">Challenge</button> <span className=" absolute top-0 right-0" ><FocusButton setFocus={setFormFocus} focus={formFocus}/></span></span>
                    
                    {!formFocus&&
                        <ChallengeSection selectedPuzzles={selectedPuzzles} challenges={challenges} socket={socket} query={query} defaultForm={query?.friendId?'FriendsForm':'ChallengeForm'}/>
                    }
                </div>
             
             </div>
           
        </Layout>
       
        
       
            
    
       
       
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
    const puzzleIds =  context.query?.puzzleIds
    if(puzzleIds){
        try{
            const query = `EXEC GetPuzzlesById @idList = ${puzzleIds}`
            const db = await connectDB()
            const puzzles = JSON.stringify((await db.query(query)).recordsets[0])
            return {
                props: {
                  puzzles,
                  query: context.query
                },
              };
        }catch(err){
            console.log(err)
        }
        
    }
    const puzzles = JSON.stringify(await getPuzzles({username: session.username, sortCriteria:'dateUploaded'}))
    return {
      props: {
        puzzles,
        query: context.query
      },
    };
  }
  