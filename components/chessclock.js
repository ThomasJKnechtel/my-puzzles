import { useState } from "react";
import Timer from "./timer";

export default function ChessClock({isLeftTurn, pause}){
    const [leftTurn, setLeftTurn] = useState(isLeftTurn)
    function onButtonClick(){
        setLeftTurn(!leftTurn)
    }
    return (
        <div className="inline-flex flex-col">
        <div className=" inline-flex items-end w-full justify-between">
            {leftTurn?(
                <button onClick={onButtonClick} className="w-0 h-0 
                border-t-[12px] border-t-transparent
                border-l-[90px] border-l-gray-400
                border-b-[2px] border-b-gray-400">
            </button>
            ):(
                <div className="h-[2px] w-[47%] bg-gray-400">
            </div>
            )
            }
            
            <div className="w-[6%] h-1 rounded-t-full bg-gray-400 justify-self-center"></div>
            {!leftTurn?(
                <button onClick={onButtonClick} className="w-0 h-0 
               
                border-t-[12px] border-t-transparent
                border-r-[90px] border-r-gray-400
                border-b-[2px] border-b-gray-400">
            </button>
            ):(
                <div className="h-[2px] w-[47%] bg-gray-400"> </div>
            )}
            
        </div>
        
        <div className="inline-flex bg-red-700">
            <Timer time={15*60*1000} pause={!leftTurn} start restart={leftTurn}></Timer>
            <Timer time={15*60*1000} pause = {leftTurn} start restart={!leftTurn}></Timer>
        </div>
        
        </div>
    )
}