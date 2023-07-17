import Image from "next/image"
import { LayoutContext } from "./layout"
function Game({games, setGames, white, black, result, timeControl, date, time, loggedIn}){
    return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td>{white}</td><td>{black}</td><td>{result}</td><td>{timeControl}</td><td>{date}</td><td><button onClick={()=>{removeGame(games,white,date,time,setGames)}} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></td></tr>)
}
function removeGame(games, white, date, time, setGames){
    const lst = []
    games.map((game, index)=>{
        if(!(game.tags.White === white && game.tags.Date.value === date && game.tags.UTCTime.value == time)){
           
            lst.push(game)
        }
    })
    setGames(lst)
    console.log(games)
    
}

export function GamesTable(){
    return(
    <LayoutContext.Consumer>
    {(context)=>{
        
        return(
            <table className="mx-auto w-4/5 m-10 table-fixed ">
            
            <thead className=" bg-slate-300 mb-2  w-full shadow-lg h-10  "><tr className="h-14" ><th  className="rounded-l-md">White</th><th>Black</th><th>Result</th><th>Time Control</th><th className="">Date</th><th className="w-13"><button onClick={()=>setGames([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
        
        <tbody class="border-2" >
            {
                context.games.map((game) =>{
                    return <Game games={context.games} key={game.tags.White+game.tags.Date.value+game.tags.UTCTime.value} white={game.tags.White} black={game.tags.Black} result={game.tags.Result} timeControl={game.tags.TimeControl.value} date={game.tags.Date.value} time={game.tags.UTCTime.value} className="bg-slate-400"  setGames={context.setGames}></Game>
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
