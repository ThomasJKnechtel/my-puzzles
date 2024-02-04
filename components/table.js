/* eslint-disable jsx-a11y/control-has-associated-label */

import Link from "next/link"
import Image from "next/image"
import { parseGame } from "@mliebelt/pgn-parser"
import { LayoutContext } from "./layout/layout"

function View({pgn}){
    return <Link href={{pathname: '/game', query:{pgn: encodeURIComponent(JSON.stringify(pgn))}}}><button type="button" className=" p-1 rounded-md green font-medium text-sm hover:bg-green-500"><Image src="https://img.icons8.com/fluency-systems-regular/48/binoculars.png" alt="look" width={20} height={20} className=""/></button></Link>
}
function removeGame(gamesPgns, setGamesPgns, gamePgn){
    const lst = []
    gamesPgns.forEach((pgn)=>{
        if(pgn !== gamePgn){
            lst.push(pgn)
        }
    })
    setGamesPgns(lst)
    
}
function Game({gamesPgns, setGamesPgns, pgn}){
    try{
        const pgnObject = parseGame(pgn)
        return(
        <tr className="bg-slate-50 p-4 odd:bg-slate-300 ">
        <td className=" max-w-[20%] overflow-hidden overflow-x-scroll ">{pgnObject.tags.White}</td><td className=" max-w-[20%]  overflow-x-scroll">{pgnObject.tags.Black}</td>
        <td className=" max-w-[10%] overflow-x-scroll">{pgnObject.tags.Result}</td><td className=" max-w-[15%] overflow-x-scroll">{pgnObject.tags.TimeControl.value}</td>
        <td className=" max-w-[10px] overflow-x-scroll">{pgnObject.tags.Date.value}</td>
        <td><button type="button" onClick={()=>{removeGame(gamesPgns, setGamesPgns, pgn)}} className="p-1 rounded-md font-medium text-sm bg-red-700 hover:bg-red-800 "><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={20} height={20} className=""/></button></td>
        <td><View pgn={pgn}/></td></tr>)
    }catch(error){
        console.log(error)
    }
    
}


export default function GamesTable(){
    return(
    <LayoutContext.Consumer>
    {(context)=>(
            <table className="mx-auto w-full sm:w-4/5 sm:m-10 table-fixed border-collapse ">
            
            <thead className=" bg-slate-300 mb-2   shadow-lg h-10 "><tr className="h-14" ><th  className="rounded-l-md w-1/5">White</th><th className=" w-1/5">Black</th><th>Result</th><th>Time Control</th><th className="">Date</th><th className=" w-1/12"><button type="button" onClick={()=>context.setGamesPgns([])} className=" p-1 rounded-md font-medium text-sm bg-red-700 hover:bg-red-800"><Image src="https://img.icons8.com/ios/50/delete-trash.png" alt="trash" width={20} height={20} className=""/></button></th><th className=" w-1/12" /></tr></thead>
         <tbody>
             <tr className="h-10" />
         </tbody>   
        
        <tbody class="border-2" >
            {
                context.gamesPgns.map((pgn) =><Game key={pgn} gamesPgns={context.gamesPgns}  setGamesPgns={context.setGamesPgns} pgn = {pgn} className="bg-slate-400"   />)
            }   
        </tbody>
        </table> 
        )
    }
    </LayoutContext.Consumer>
    )
}
