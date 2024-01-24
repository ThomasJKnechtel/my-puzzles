/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import formatDate from "@/utils/formatDate";
import Link from "next/link";
import { getSession } from "next-auth/react";

const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
    });

// eslint-disable-next-line camelcase
function Puzzle({id, white, black, date, fen, continuation, puzzles, setPuzzles, dateUploaded, session, saved, turn, attempts, success_rate }){
    const [isSaved, setSaved] = useState(saved)
    const [puzzleId, setPuzzleId] = useState(id)
    function removePuzzle(){
        const lst = []
        puzzles.forEach((puzzle)=>{
            if(puzzle.fen !== fen){
                lst.push(puzzle)
            }
        })
        setPuzzles(lst)
    }
    async function savePuzzle(){
        const {username} = session
        setSaved(true)
        fetch('/api/db/addPuzzle', {
            method: "POST",
            headers:{
                "content-type": "application/json"
            },
            body: JSON.stringify({white, black, date, fen, continuation, dateUploaded, username, turn})
        }).then(response => {
            if(!response.ok){
                console.log(response.status)
                return null
            }
            return response.json()
        }).then(result => {
            if(result){
                setPuzzleId(result.recordset[0].puzzle_id)
                setSaved(true)
            }
        })

    }
    // eslint-disable-next-line no-nested-ternary
    return (<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td className="text-left align-middle"><button type="button" className=" border-slate-400 hover:border-2"><Chessboard position={fen} id={fen} width={140} /></button></td><td>{white}</td><td>{black}</td><td>{date}</td>{dateUploaded?<td>{dateUploaded}</td>:<td>N/A</td>}<td>{attempts&&<label>{attempts}</label>}</td><td>{success_rate&&<label>{success_rate}</label>}</td><td>{!session?<label>Must be logged in</label>:isSaved?<label>Saved</label>:<button type="button" onClick={()=>{savePuzzle()}} className=" text-2xl button-3 bg-blue-500">🖫</button>}</td><td><button type="button" onClick={()=>{removePuzzle(puzzles, setPuzzles)}} className="button-3 text-xl font-medium bg-red-700 hover:bg-red-800 "><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={20} height={20} className=""/></button></td><td>{isSaved?<Link className="button-3 green" href={{pathname:`/play/${puzzleId}`}}>View</Link>:<label>Must be saved</label>}</td></tr>)
  
}

export default function PuzzleTable({puzzles, setPuzzles, session, saved}){
    
    return (
        
        <div id="puzzleTable" className="  w-full  overflow-y-auto h-[500px] ">
        
        
        
        <table className=" w-full table-fixed">
            
            <thead className=" bg-slate-300 mb-2  shadow-lg h-10 sticky top-0 z-10"><tr className="h-14 sticky top-0 z-10" ><th className=" sticky top-0 z-10" /><th  className=" sticky top-0 z-10">White</th><th className="sticky top-0 z-10">Black</th><th className="sticky top-0 z-10">Date</th><th className=" sticky top-0 z-10">Date Uploaded</th><th className=" sticky top-0 z-10">Attempts</th><th className=" sticky top-0 z-10">Success Rate</th><th className="w-13 sticky top-0 z-10"><label className=" ">Save</label></th><th className="w-13 sticky top-0 z-10"><button type="button" onClick={()=>setPuzzles([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800"><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={20} height={20} className=""/></button></th><th className="" sticky top-0 z-10>View</th></tr></thead>
         <tbody>
             <tr className="h-10" />
         </tbody>   
        
        <tbody id="puzzleTableBody" className="border-2" >
            {   puzzles &&(
                 // eslint-disable-next-line array-callback-return, consistent-return
                 puzzles.map((puzzle, index) =>{
                        if(puzzle){
                             // eslint-disable-next-line react/no-array-index-key
                             return <Puzzle key={index} id={puzzle.puzzle_id} white={puzzle.white} black = {puzzle.black} date = {formatDate(puzzle.date)} fen = {puzzle.fen} continuation={puzzle.continuation} puzzles={puzzles} setPuzzles={setPuzzles} dateUploaded={puzzle.dateUploaded?formatDate(puzzle.date_uploaded):"N/A" } saved={saved}session={session} turn={puzzle.turn} attempts={puzzle.attempts} success_rate={puzzle.success_rate} />
                        }
                       
                    })
            )
        }   
        </tbody>
        
        </table>
        </div>

        
    )
}