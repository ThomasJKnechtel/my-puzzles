import formatMilliseconds from "@/utils/formatTime"
import Link from "next/link"
import Image from "next/image"
export default function PuzzleResultsDisplay({puzzlesStats}){

    return (
        <div className=" m-5 text-center">
            {
                puzzlesStats.map(puzzleStats=>{
                    const {seconds, minutes, microseconds} = formatMilliseconds(puzzleStats.finish_time-puzzleStats.start_time)
                    return (
                   <div className=" inline-flex flex-col m-2">
                        <div className=" relative">
                            <label className=" relative "><Image src="https://img.icons8.com/color/48/puzzle.png" alt="puzzlePiece" width={50} height={50} /></label>
                            {puzzleStats.state=="FAILED"&&
                                <label className=" absolute top-[-3px] left-[-5px] z-0"><Image src="https://img.icons8.com/emoji/48/cross-mark-emoji.png" alt="puzzlePiece" width={60} height={60} /></label>
                                
                            }
                            
                        </div>
                        
                        
                        <label>{minutes>0?"⏰"+minutes+"."+seconds+"min":"⏰"+seconds+"."+microseconds+"s"}</label>
                   </div>)
                })
            }
        </div>
    )
}