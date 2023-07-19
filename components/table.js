import Image from "next/image"
import Link from "next/link"
import { LayoutContext } from "./layout"

function Save({game}){
    return <Link href={{pathname: '/game', query:{game: encodeURIComponent(JSON.stringify(game))}}}><button className="button-3 green font-medium text-sm hover:bg-green-500">View</button></Link>
}
function Game({gamesData, setGamesData, white, black, result, timeControl, date, time, game, loggedIn}){
    return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td>{white}</td><td>{black}</td><td>{result}</td><td>{timeControl}</td><td>{date}</td><td><button onClick={()=>{removeGame(gamesData,white,date,time,setGamesData)}} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></td><td><Save game={game}/></td></tr>)
}
function removeGame(gamesData, white, date, time, setGamesData){
    const lst = []
    gamesData.map((game, index)=>{
        if(!(game.tags.White === white && game.tags.Date.value === date && game.tags.UTCTime.value == time)){
           
            lst.push(game)
        }
    })
    setGamesData(lst)
    console.log(gamesData)
    
}

export function GamesTable(){
    return(
    <LayoutContext.Consumer>
    {(context)=>{
        
        return(
            <table className="mx-auto w-4/5 m-10 table-fixed ">
            
            <thead className=" bg-slate-300 mb-2   shadow-lg h-10  "><tr className="h-14" ><th  className="rounded-l-md">White</th><th>Black</th><th>Result</th><th>Time Control</th><th className="">Date</th><th className="w-13"><button onClick={()=>setGames([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th><th></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
        
        <tbody class="border-2" >
            {
                context.gamesData.map((game) =>{
                    return <Game gamesData={context.gamesData} key={game.tags.White+game.tags.Date.value+game.tags.UTCTime.value} white={game.tags.White} black={game.tags.Black} result={game.tags.Result} timeControl={game.tags.TimeControl.value} date={game.tags.Date.value} time={game.tags.UTCTime.value} className="bg-slate-400"  setGamesData={context.setGamesData} game={game}></Game>
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
