/* eslint-disable jsx-a11y/control-has-associated-label */

import Link from "next/link"
import { parseGame } from "@mliebelt/pgn-parser"
import { LayoutContext } from "./layout/layout"

function View({pgn}){
    return <Link href={{pathname: '/game', query:{pgn: encodeURIComponent(JSON.stringify(pgn))}}}><button type="button" className="button-3 green font-medium text-sm hover:bg-green-500">View</button></Link>
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
        <td>{pgnObject.tags.White}</td><td>{pgnObject.tags.Black}</td>
        <td>{pgnObject.tags.Result}</td><td>{pgnObject.tags.TimeControl.value}</td>
        <td>{pgnObject.tags.Date.value}</td>
        <td><button type="button" onClick={()=>{removeGame(gamesPgns, setGamesPgns, pgn)}} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></td>
        <td><View pgn={pgn}/></td></tr>)
    }catch(error){
        console.log(error)
    }
    
}


export default function GamesTable(){
    return(
    <LayoutContext.Consumer>
    {(context)=>(
            <table className="mx-auto w-4/5 m-10 table-fixed ">
            
            <thead className=" bg-slate-300 mb-2   shadow-lg h-10  "><tr className="h-14" ><th  className="rounded-l-md">White</th><th>Black</th><th>Result</th><th>Time Control</th><th className="">Date</th><th className="w-13"><button type="button" onClick={()=>context.setGamesPgns([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th><th /></tr></thead>
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
