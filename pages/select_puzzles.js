/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import PuzzleTable  from "../components/puzzleTable"
import Layout from "../components/layout"
import PuzzleFormSelection from "@/components/puzzleSelection"
import LoadingIcon from "@/components/loadingIcon";

import getPuzzles from "./api/db/getPuzzles";
import PlayForm from "@/components/playForm";

export default function SelectPuzzlesPage({puzzlesFromSearch, saved, socket}){
    const { data : session } = useSession()
    const [puzzles, setPuzzles] = useState(JSON.parse(puzzlesFromSearch))
    const [progress,  setProgress] = useState(0)
    const [displayProgress, setDisplayProgress] = useState(false)

    useEffect(() => {
        if(socket && !puzzles){
            socket.emit('gamesPgns', sessionStorage.getItem('gamePgns'))
            sessionStorage.setItem('gamePgns',JSON.stringify([])) 
            setProgress(0)
            setDisplayProgress(true)
        }   

      }, [socket, puzzles]) 
      useEffect(()=>{
        if(socket){
            socket.on('puzzles', newPuzzles=>{
                // eslint-disable-next-line no-param-reassign
                newPuzzles = JSON.parse(newPuzzles)
               
                if(puzzles){
                  setPuzzles(newPuzzles.concat(puzzles))
                  
                }else{
                  setPuzzles(newPuzzles)
                  
                }
                
                })
            socket.on('disconnect', () => {
                setDisplayProgress(false)
                setProgress(0)
            })
            socket.on('progress', newProgress=>{
              setProgress(newProgress)
            })
            socket.on('puzzlesCompleted', ()=>{
              setDisplayProgress(false)
              setProgress(0)
            })
        }
        sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
      }, [socket, puzzles])
      
      function onTableButtonClick(){
        document.getElementById('puzzleTable').style.display="block"
        document.getElementById('puzzleForm').style.display="none"
        document.getElementById('formButton').style.opacity=0.5
        document.getElementById('tableButton').style.opacity=1

      }
      function onFormButtonClick(){
        document.getElementById('puzzleTable').style.display="none"
        document.getElementById('puzzleForm').style.display="block"
        document.getElementById('formButton').style.opacity=1
        document.getElementById('tableButton').style.opacity=0.5
        
      }
      //
      return (
        <Layout>
        <div className=" flex flex-col items-center w-full ">

        
          <div className=" bg-white pl-8 w-full mb-4">
            <button type="button"  id="tableButton" onClick={onTableButtonClick} className=" text-2xl font-medium text-blue-600 border-b-4 pb-2 px-3 border-blue-600">Puzzles</button>
            <button type="button" id="formButton" onClick={onFormButtonClick} className=" text-2xl font-medium text-blue-600 border-b-4 pb-2 px-3 border-blue-600 opacity-50">Select Puzzles</button>
            <PuzzleFormSelection loggedIn={session}  />
            <PuzzleTable puzzles={puzzles} setPuzzles={setPuzzles} session={session} saved={saved} />
          </div>
          {displayProgress&&<><LoadingIcon progress={progress} />
            <label>{progress}%</label></>
          }
          <PlayForm puzzles={puzzles} />
        
        </div>
        </Layout>
      )

}
export async function getServerSideProps(context){
  let puzzles = null
  let saved = false
  if(Object.keys(context.query).length){
    puzzles = await getPuzzles(context.query)
    saved = true
  }
  return { props : { 'puzzlesFromSearch': JSON.stringify(puzzles), 'saved':saved }}
}