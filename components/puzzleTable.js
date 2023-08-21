
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";

const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
    });

function Puzzle({white, black, date, fen, continuation, puzzles, setPuzzles, dateUploaded, session, saved }){
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
            body: JSON.stringify({white, black, date, fen, continuation, dateUploaded, username})
        })

    }
    return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td className="text-left align-middle"><button className=" border-slate-400 hover:border-2"><Chessboard position={fen} id={fen} width={140}></Chessboard></button></td><td>{white}</td><td>{black}</td><td>{date}</td>{dateUploaded?<td>{dateUploaded}</td>:<td>N/A</td>}<td>{(session&&!isSaved)&&<button onClick={()=>{savePuzzle()}} className="button-3 text-xl font-medium green  hover:bg-green-500 h-14 w-24 ">Save</button>}</td><td><button onClick={()=>{removePuzzle(puzzles, setPuzzles)}} className="button-3 text-xl font-medium bg-red-700 hover:bg-red-800 h-14 w-24 ">Delete</button></td></tr>)
  
}

export default function PuzzleTable({puzzles, setPuzzles, session,  popdown, setPopDown, saved}){
    const router = useRouter()
   
    useEffect(()=>{
        if(popdown){
            document.querySelector('#puzzleTableBody').style='display: table-row-group;'
        }else{
            document.querySelector('#puzzleTableBody').style='display: none;'
        }
    }, [popdown])
    return (
        
        <div className="flex flex-col items-center mt-6 ">
        
        <div className="  w-4/5  overflow-y-auto h-[400px]  ">
        <div className=" bg-slate-400 w-fit pt-1 px-1 rounded-t-md shadow-md border-2 border-slate-300">
        <button onClick={()=>{setPopDown(!popdown)}}><label className="text-lg font-bold">Puzzles</label>{popdown?<label className="text-lg m-2 text-center">&#9650;</label>:<label className="text-lg m-2 text-center">&#9660;</label>}</button>
            
        </div>
        
        
        <table className=" w-full table-fixed h-1/2">
            
            <thead className=" bg-slate-300 mb-2  shadow-lg h-10 sticky top-0 z-10"><tr className="h-14 sticky top-0 z-10" ><th className="rounded-l-md sticky top-0 z-10"></th><th  className=" sticky top-0 z-10">White</th><th className="sticky top-0 z-10">Black</th><th className="sticky top-0 z-10">Date</th><th className=" sticky top-0 z-10">Date Uploaded</th>{session&&<th className="w-13 sticky top-0 z-10"><button onClick={()=>setPuzzles([])} className="button-3 font-medium text-sm green hover:bg-green-500">Save</button></th>}<th className="w-13 sticky top-0 z-10"><button onClick={()=>setPuzzles([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
        
        <tbody id="puzzleTableBody" className="border-2" >
            {   puzzles &&(
                 puzzles.map((puzzle) =>{
                        if(puzzle){
                             return <Puzzle white={puzzle.white} black = {puzzle.black} date = {formatDate(puzzle.date)} fen = {puzzle.fen} continuation={puzzle.continuation} puzzles={puzzles} setPuzzles={setPuzzles} dateUploaded={formatDate(puzzle.date_uploaded) } saved={saved}session={session}></Puzzle>
                        }
                       
                    })
            )
        }   
        </tbody>
        
        </table>
        </div>
        </div>
        
    )
}