
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";

const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
    });

function Puzzle({white, black, date, fen, continuation, puzzles, setPuzzles, dateUploaded, session, saved, turn }){
    const [isSaved, setSaved] = useState(saved)
    function removePuzzle(){
        const lst = []
        puzzles.map((puzzle)=>{
            if(puzzle.fen !== fen){
                lst.push(puzzle)
            }
        })
        setPuzzles(lst)
    }
    async function savePuzzle(){
        const username = session.user.name
        setSaved(true)
        await fetch('/api/db/addPuzzle', {
            method: "POST",
            headers:{
                "content-type": "application/json"
            },
            body: JSON.stringify({white, black, date, fen, continuation, dateUploaded, username, turn})
        })

    }
    return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td className="text-left align-middle"><button className=" border-slate-400 hover:border-2"><Chessboard position={fen} id={fen} width={140}></Chessboard></button></td><td>{white}</td><td>{black}</td><td>{date}</td>{dateUploaded?<td>{dateUploaded}</td>:<td>N/A</td>}<td>{!session?<label>Must be logged in</label>:saved?<label>Saved</label>:<button onClick={()=>{savePuzzle()}} className="button-3 text-xl font-medium green  hover:bg-green-500 h-14 w-24 ">Save</button>}</td><td><button onClick={()=>{removePuzzle(puzzles, setPuzzles)}} className="button-3 text-xl font-medium bg-red-700 hover:bg-red-800 "><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={20} height={20} className=""/></button></td></tr>)
  
}

export default function PuzzleTable({puzzles, setPuzzles, session, saved}){
    
    return (
        
        <div id="puzzleTable" className="  w-full  overflow-y-auto h-[500px] ">
        
        
        
        <table className=" w-full table-fixed">
            
            <thead className=" bg-slate-300 mb-2  shadow-lg h-10 sticky top-0 z-10"><tr className="h-14 sticky top-0 z-10" ><th className=" sticky top-0 z-10"></th><th  className=" sticky top-0 z-10">White</th><th className="sticky top-0 z-10">Black</th><th className="sticky top-0 z-10">Date</th><th className=" sticky top-0 z-10">Date Uploaded</th>{session&&<th className="w-13 sticky top-0 z-10"><button onClick={()=>setPuzzles([])} className=" text-2xl button-3 bg-blue-500">🖫</button></th>}<th className="w-13 sticky top-0 z-10"><button onClick={()=>setPuzzles([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800"><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={20} height={20} className=""/></button></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
        
        <tbody id="puzzleTableBody" className="border-2" >
            {   puzzles &&(
                 puzzles.map((puzzle) =>{
                        if(puzzle){
                             return <Puzzle white={puzzle.white} black = {puzzle.black} date = {formatDate(puzzle.date)} fen = {puzzle.fen} continuation={puzzle.continuation} puzzles={puzzles} setPuzzles={setPuzzles} dateUploaded={formatDate(puzzle.date_uploaded) } saved={saved}session={session} turn={puzzle.turn}></Puzzle>
                        }
                       
                    })
            )
        }   
        </tbody>
        
        </table>
        </div>

        
    )
}