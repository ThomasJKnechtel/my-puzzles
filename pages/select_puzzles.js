import { useState, useEffect } from "react"
import PuzzleTable  from "../components/puzzleTable"
import Layout from "../components/layout"
import PuzzleFormSelection from "@/components/puzzleSelection"
import { useSession } from "next-auth/react";
import LoadingIcon from "@/components/loadingIcon";

import getPuzzles from "./api/db/getPuzzles";
import PlayForm from "@/components/playForm";

export default function SelectPuzzlesPage({puzzlesFromSearch, saved, socket}){
    const { data : session } = useSession()
    const [puzzles, setPuzzles] = useState(JSON.parse(puzzlesFromSearch))
    const [progress,  setProgress] = useState(0)
    const [displayProgress, setDisplayProgress] = useState(false)
    const [displayTable, setDisplayTable] = useState(true)
    const [popupOpen, setPopupOpen] = useState(false)

    useEffect(() => {
        if(socket && !puzzles){
            socket.emit('gamesPgns', sessionStorage.getItem('gamePgns'))
            sessionStorage.setItem('gamePgns',JSON.stringify([])) 
            setProgress(0)
            setDisplayProgress(true)
        }   

      }, [socket]) 
      useEffect(()=>{
        if(socket){
            socket.on('puzzles', newPuzzles=>{
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
            socket.on('progress', progress=>{
              setProgress(progress)
            })
            socket.on('puzzlesCompleted', ()=>{
              setDisplayProgress(false)
              setProgress(0)
            })
        }
        sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
      }, [socket, puzzles])
      
      function onTableButtonClick(e){
        document.getElementById('puzzleTable').style.display="block"
        document.getElementById('puzzleForm').style.display="none"
        document.getElementById('formButton').style.opacity=0.5
        document.getElementById('tableButton').style.opacity=1
        setDisplayTable(true)

      }
      function onFormButtonClick(e){
        document.getElementById('puzzleTable').style.display="none"
        document.getElementById('puzzleForm').style.display="block"
        document.getElementById('formButton').style.opacity=1
        document.getElementById('tableButton').style.opacity=0.5
        setDisplayTable(false)
        
      }
      //
      return (
        <Layout>
        <div className=" flex flex-col items-center w-full ">

        
          <div className=" bg-white pl-8 w-full"><button  id="tableButton" onClick={onTableButtonClick} className=" text-2xl font-medium text-blue-600 border-b-4 pb-2 px-3 border-blue-600">Puzzles</button><button id="formButton" onClick={onFormButtonClick} className=" text-2xl font-medium text-blue-600 border-b-4 pb-2 px-3 border-blue-600 opacity-50">Select Puzzles</button>
            <PuzzleFormSelection loggedIn={session} ></PuzzleFormSelection>
            <PuzzleTable puzzles={puzzles} setPuzzles={setPuzzles} session={session} saved={saved}></PuzzleTable>
          </div>
          {displayProgress&&<><LoadingIcon progress={progress}></LoadingIcon>
            <label>{progress}%</label></>
          }
          <PlayForm puzzles={puzzles}></PlayForm>
        
        </div>
        </Layout>
      )

}
export async function getServerSideProps(context){
  console.log(context.query)
  let puzzles = null
  let saved = false
  if(Object.keys(context.query).length){
    puzzles = await getPuzzles(context.query)
    saved = true
  }
  return { props : { 'puzzlesFromSearch': JSON.stringify(puzzles), 'saved':saved }}
}