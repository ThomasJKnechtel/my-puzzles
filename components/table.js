import Image from "next/image"
import Link from "next/link"
import { LayoutContext } from "./layout"
import { parseGame } from "@mliebelt/pgn-parser"

function View({pgn}){
    return <Link href={{pathname: '/game', query:{pgn: encodeURIComponent(JSON.stringify(pgn))}}}><button className="button-3 green font-medium text-sm hover:bg-green-500">View</button></Link>
}
function Game({gamesPgns, setGamesPgns, pgn}){
    try{
        const pgnObject = parseGame(pgn)
        return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td>{pgnObject.tags.White}</td><td>{pgnObject.tags.Black}</td><td>{pgnObject.tags.Result}</td><td>{pgnObject.tags.TimeControl.value}</td><td>{pgnObject.tags.Date.value}</td><td><button onClick={()=>{removeGame(gamesPgns, setGamesPgns, pgn)}} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></td><td><View pgn={pgn}/></td></tr>)
    }catch(error){
        console.log(error)
    }
    
}
function removeGame(gamesPgns, setGamesPgns, gamePgn){
    const lst = []
    gamesPgns.map((pgn)=>{
        if(pgn !== gamePgn){
            lst.push(pgn)
        }
    })
    setGamesPgns(lst)
    
}

export function GamesTable(){
    return(
    <LayoutContext.Consumer>
    {(context)=>{
        
        return(
            <table className="mx-auto w-4/5 m-10 table-fixed ">
            
            <thead className=" bg-slate-300 mb-2   shadow-lg h-10  "><tr className="h-14" ><th  className="rounded-l-md">White</th><th>Black</th><th>Result</th><th>Time Control</th><th className="">Date</th><th className="w-13"><button onClick={()=>context.setGamesPgns([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th><th></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
        
        <tbody class="border-2" >
            {
                context.gamesPgns.map((pgn, index) =>{
                        return <Game key={index} gamesPgns={context.gamesPgns}  setGamesPgns={context.setGamesPgns} pgn = {pgn} className="bg-slate-400"  ></Game>
                    })
            }   
        </tbody>
        </table> 
        )
        
    }
    }
    </LayoutContext.Consumer>
    )
}
