/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import PuzzleTable  from "../components/select_puzzles/puzzleTable"
import Layout from "../components/layout/layout"
import PuzzleFormSelection from "@/components/select_puzzles/puzzleSelection"
import LoadingIcon from "@/components/select_puzzles/loadingIcon";
import PlayForm from "@/components/select_puzzles/playForm2";
import getPuzzles from "./api/db/getPuzzles";
import usePuzzleGenerator from "@/components/hooks/usePuzzleGenerator";


export default function SelectPuzzlesPage({puzzlesFromSearch, saved, socket}){
    const { data : session } = useSession()
    const [puzzles, setPuzzles] = useState(JSON.parse(puzzlesFromSearch))
    const [puzzlesGenerated, setPuzzlesGenerated] = usePuzzleGenerator()

      function onTableButtonClick(){
        document.getElementById('puzzleTable').style.display="block"
        document.getElementById('puzzleForm').style.display="none"
        document.getElementById('formButton').style.opacity=0.5
        document.getElementById('tableButton').style.opacity=1
        document.querySelector('#play')?.classList?.remove('hidden')
        document.querySelector('#play')?.classList?.add('block')
      }
      function onFormButtonClick(){
        document.getElementById('puzzleTable').style.display="none"
        document.getElementById('puzzleForm').style.display="block"
        document.getElementById('formButton').style.opacity=1
        document.getElementById('tableButton').style.opacity=0.5
        document.querySelector('#play')?.classList?.add("hidden")
        
      }
      //
      return (
        <Layout searchLink lobby>
        <div className=" flex flex-col items-center w-full relative overflow-clip h-full">

        
          <div className=" bg-white sm:pl-8 w-full mb-4 ">
            <button type="button"  id="tableButton" onClick={onTableButtonClick} className=" text-2xl font-medium text-blue-600 border-b-4 pb-2 px-3 border-blue-600">Puzzles</button>
            <button type="button" id="formButton" onClick={onFormButtonClick} className=" text-2xl font-medium text-blue-600 border-b-4 pb-2 px-3 border-blue-600 opacity-50">Select Puzzles</button>
            <PuzzleFormSelection loggedIn={session}  />
            <PuzzleTable puzzles={puzzles || puzzlesGenerated} setPuzzles={puzzles?setPuzzles:setPuzzlesGenerated} session={session} saved={saved} socket={socket}/>
          </div>
          
          {(puzzles?.length>0||puzzlesGenerated.length>0)&&
          <div id="play" htmlFor="play" type="button" className="font-bold text-xl border-2  rounded-md bg-white ring-blue-300 ring-2 hover:bg-slate-100 focus:bg-slate-100 focus:ring-blue-500 group" >
          
            <button  className=" w-full h-full px-3 py-1" type="button">Play</button>
            <span className=" absolute left-1/2 traslate-x-[-50%] top-1/2 translate-y-[-50%] z-50 translate-x-[-150px] hidden group-focus-within:block">
            
            {(puzzles?.length>0||puzzlesGenerated.length>0)&&
              
                <PlayForm puzzles={puzzles||puzzlesGenerated} saved={saved}/>
             
            }
            
          </span>
          </div>
          }
          
          
        </div>
        </Layout>
      )

}
export async function getServerSideProps(context){
  const session = await getServerSession(context.req, context.res, authOptions)
  if(session){
    if(!session.username) return {
      redirect: {
        destination: '/signup',
        permanent: false,
      },
    };
  }
  let puzzles = null
  let saved = false
  if(Object.keys(context.query).length){
    puzzles = await getPuzzles(context.query)
    puzzles = puzzles.map((puzzle)=>({ ...puzzle, continuation :JSON.parse(puzzle.continuation)}))
    saved = true
  }
  return { props : { 'puzzlesFromSearch': JSON.stringify(puzzles), 'saved':saved }}
}
