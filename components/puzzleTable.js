
import dynamic from "next/dynamic";


const Chessboard = dynamic(() => import('chessboardjsx'), {
    ssr: false  // <- this do the magic ;)
    });

function Puzzle({white, black, date, fen, continuation, puzzles, setPuzzles, dateUploaded, session }){
   
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
        await fetch('/api/db/addPuzzle', {
            method: "POST",
            headers:{
                "content-type": "application/json"
            },
            body: JSON.stringify({white, black, date, fen, continuation, dateUploaded, username})
        })

    }
    return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td className="text-left align-middle"><button className=" border-slate-400 hover:border-2"><Chessboard position={fen} id={fen} width={140}></Chessboard></button></td><td>{white}</td><td>{black}</td><td>{date}</td>{dateUploaded?<td>{dateUploaded}</td>:<td>N/A</td>}{session&&<td><button onClick={()=>{savePuzzle()}} className="button-3 text-xl font-medium green  hover:bg-green-500 h-14 w-24 ">Save</button></td>}<td><button onClick={()=>{removePuzzle(puzzles, setPuzzles)}} className="button-3 text-xl font-medium bg-red-700 hover:bg-red-800 h-14 w-24 ">Delete</button></td></tr>)
  
}

export default function PuzzleTable({puzzles, setPuzzles, session}){
    return (
        <div className=" overflow-y-auto h-1/2">

        
        <table className="mx-auto w-4/5 m-10 table-fixed ">
            
            <thead className=" bg-slate-300 mb-2  shadow-lg h-10 sticky top-0 z-10"><tr className="h-14 sticky top-0 z-10" ><th className="rounded-l-md sticky top-0 z-10"></th><th  className=" sticky top-0 z-10">White</th><th className="sticky top-0 z-10">Black</th><th className="sticky top-0 z-10">Date</th><th className=" sticky top-0 z-10">Date Uploaded</th>{session&&<th className="w-13 sticky top-0 z-10"><button onClick={()=>setPuzzles([])} className="button-3 font-medium text-sm green hover:bg-green-500">Save</button></th>}<th className="w-13 sticky top-0 z-10"><button onClick={()=>setPuzzles([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
        
        <tbody class="border-2" >
            {   puzzles&&(
                 puzzles.map((puzzle) =>{
                        return <Puzzle white={puzzle.white} black = {puzzle.black} date = {puzzle.date} fen = {puzzle.fen} continuation={puzzle.continuation} puzzles={puzzles} setPuzzles={setPuzzles} session={session}></Puzzle>
                    })
            )
 }   
        </tbody>
        </table> </div>
    )
}