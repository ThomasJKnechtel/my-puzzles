
function Puzzle({white, black, date, fen, puzzles, setPuzzles}){
    function removePuzzle(){
        const lst = []
        puzzles.map((puzzle)=>{
            if(puzzle.fen !== fen){
                lst.push(puzzle)
            }
        })
        setPuzzles(lst)
    }
    return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td>{white}</td><td>{black}</td><td>{date}</td><td><button onClick={()=>{removePuzzle(puzzles, setPuzzles)}} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></td></tr>)
  
}

export default function PuzzleTable({puzzles, setPuzzles}){
    return (
        <table className="mx-auto w-4/5 m-10 table-fixed ">
            
            <thead className=" bg-slate-300 mb-2   shadow-lg h-10  "><tr className="h-14" ><th  className="rounded-l-md">White</th><th>Black</th><th className="">Date</th><th className="w-13"><button onClick={()=>setPuzzles([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
        
        <tbody class="border-2" >
            {   puzzles&&(
                 puzzles.map((puzzle) =>{
                        return <Puzzle white={puzzle.white} black = {puzzle.black} date = {puzzle.date} fen = {puzzle.fen} puzzles={puzzles} setPuzzles={setPuzzles}></Puzzle>
                    })
            )
 }   
        </tbody>
        </table> 
    )
}