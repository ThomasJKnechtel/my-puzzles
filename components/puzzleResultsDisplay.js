/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import Image from "next/image"
import formatMilliseconds from "@/utils/formatTime"

export default function PuzzleResultsDisplay({puzzlesStats}){

    return (
        <div className=" m-5 text-center">
            {
                puzzlesStats.map((puzzleStats, index)=>{
                    const {seconds, minutes, microseconds} = formatMilliseconds(puzzleStats.finish_time-puzzleStats.start_time)
                    return (
                   // eslint-disable-next-line react/no-array-index-key
                   <div key={index} className=" inline-flex flex-col m-2">
                        <div className=" relative">
                            <label className=" relative "><Image src="https://img.icons8.com/color/48/puzzle.png" alt="puzzlePiece" width={50} height={50} /></label>
                            {puzzleStats.state==="FAILED"&&
                                <label className=" absolute top-[-3px] left-[-5px] z-0"><Image src="https://img.icons8.com/emoji/48/cross-mark-emoji.png" alt="puzzlePiece" width={60} height={60} /></label>
                                
                            }
                            
                        </div>
                        
                        
                        <label>{minutes>0?`⏰${minutes}.${seconds}min`:`⏰${seconds}.${microseconds}s`}</label>
                   </div>)
                })
            }
        </div>
    )
}