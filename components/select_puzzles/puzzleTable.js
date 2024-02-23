/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import formatDate from "@/utils/formatDate";
import Link from "next/link";
import { getSession } from "next-auth/react";
import Share from "../share";

const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
    });

// eslint-disable-next-line camelcase
function Puzzle({id, white, black, date, fen, continuation, puzzles, setPuzzles, dateUploaded, session, saved, turn, attempts, success_rate, socket, username, token }){
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
    return (
    <tr className="bg-slate-50 p-4 odd:bg-slate-300 ">
    <td className=" inline-flex flex-col items-start ">
        <label>{black}</label>
        <button type="button" className=" border-slate-400 hover:border-2"><Chessboard position={fen} id={fen} width={140} /></button>
        <label>{white}</label>
    </td>
    <td className=" whitespace-nowrap">{date}</td>
    {dateUploaded?
        <td className=" whitespace-nowrap">{dateUploaded}</td>:
        <td>N/A</td>
    }
    <td>{attempts&&<label>{attempts}</label>}</td>
    <td>{success_rate&&<label>{success_rate}</label>}</td>
    <td>{!session?<label className=" whitespace-nowrap">Log In</label>:isSaved?<label>Saved</label>:<button type="button" onClick={()=>{savePuzzle()}} className=" p-1 rounded-md bg-blue-500"><Image src="https://img.icons8.com/ios-filled/100/save--v1.png" width={50} height={50} alt="save"/></button>}</td>
    <td><button type="button" onClick={()=>{removePuzzle(puzzles, setPuzzles)}} className=" p-1 rounded-md text-xl font-medium bg-red-700 hover:bg-red-800 "><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={50} height={50} className="sm:w-[50px] sm:h-[50px]"/></button></td>
    <td>{isSaved?<Link href={{pathname:`/play/${puzzleId}`}}><button className=" p-1 rounded-md bg-green-600 hover:bg-green-700 "><Image src="https://img.icons8.com/fluency-systems-regular/48/binoculars.png" alt="look" width={50} height={50} className="sm:w-[50px] sm:h-[50px]"/></button></Link>:<label className="whitespace-nowrap">Must be saved</label>}</td>
    <td>{isSaved&&<Share socket={socket} puzzleId={puzzleId} username={username} token={token} />}</td>
    </tr>)
  
}

export default function PuzzleTable({puzzles, setPuzzles, session, saved, socket}){
    
    return (
        
        <div id="puzzleTable" className=" min-w-full  overflow-y-auto h-[500px]  md:overflow-x-auto ">
        
        
        
        <table className=" min-w-full table-fixed text-xl m-2">
            
            <thead className=" bg-slate-300 mb-2  shadow-lg h-10 sticky top-0 z-10"><tr className="h-14 sticky top-0 z-10 " ><th className=" sticky top-0 z-10 w-[150px]" /><th className="sticky top-0 z-10 order-5">Date</th><th className=" sticky top-0 z-10 p-1 ">Uploaded</th><th className="  sticky top-0 z-10 p-1">Attempts</th><th className="  sticky top-0 z-10 p-1 whitespace-nowrap">Success Rate</th><th className="sticky top-0 z-10 p-1"><label className=" ">Save</label></th><th className=" sticky top-0 z-10 min-w-[50px] p1 "><button type="button" onClick={()=>setPuzzles([])} className=" p-1 rounded-md bg-red-700 hover:bg-red-800 order-3"><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={20} height={20} className=""/></button></th><th className=" sticky top-0 z-10 min-w-[50px] order-3"/><th className=" sticky top-0 z-10"/></tr></thead>
         <tbody>
             <tr className="h-10" />
         </tbody>   
        
        <tbody id="puzzleTableBody" className="border-2" >
            {   puzzles &&(
                 // eslint-disable-next-line array-callback-return, consistent-return
                 puzzles.map((puzzle, index) =>{
                        if(puzzle){
                             // eslint-disable-next-line react/no-array-index-key
                             return <Puzzle key={index} id={puzzle.puzzle_id} white={puzzle.white} black = {puzzle.black} date = {formatDate(puzzle.date)} fen = {puzzle.fen} continuation={puzzle.continuation} puzzles={puzzles} setPuzzles={setPuzzles} dateUploaded={puzzle.dateUploaded?formatDate(puzzle.date_uploaded):"N/A" } saved={saved} session={session} turn={puzzle.turn} attempts={puzzle.attempts} success_rate={puzzle.success_rate} socket={socket} username={session?.username} token={session?.token}/>
                        }
                       
                    })
            )
        }   
        </tbody>
        
        </table>
        </div>

        
    )
}