import Image from "next/image"
import Link from "next/link"
export default function GameResultDisplay({puzzleStats}){

    function getSuccessRate(puzzlesStats){
        const puzzlesAttempted = puzzlesStats.length
        let successfulPuzzles = 0 
        if(puzzlesAttempted>0){
            puzzleStats.map(stat => {
                if(stat.state == "COMPLETED") successfulPuzzles ++
            })
        }
        return (successfulPuzzles/puzzlesAttempted*100).toFixed(0)
    }
    return (
        <div className=" bg-white border-2 rounded-md border-green-600">
        <div className=" bg-green-600 text-center p-2 w-60">
            <label className=" text-xl font-bold">Result</label>
        </div>
        <div className="  inline-flex flex-col justify-center items-center w-full">    
            <div className=" mb-1 mt-5">
                <label className=" m-2 font-medium">Attempts:</label>
                <label className=" font-medium">{puzzleStats.length}</label>
            </div>
            <div className=" my-1 mb-4">
                <label className=" m-2 font-medium ">Success Rate:</label><label className=" font-medium">{getSuccessRate(puzzleStats)+"%"}</label>
            </div>
            <button className=" button-3 green m-1 font-medium" onClick={()=>{window.location.reload()}}>Try Again</button>
            <button className=" button-3 green m-1 font-medium"><Link href={{'pathname':'/select_puzzles'}}>To Search</Link></button>
        </div>
        <div className=" bg-green-600 h-[33px] flex justify-center mt-5">
            <Image src="https://img.icons8.com/ios-filled/50/FFFFFF/puzzle.png" alt="puzzlePiece" width={50} height={50} className="absolute bottom-0 rotate-180"/>
        </div>
        </div>
    )
}