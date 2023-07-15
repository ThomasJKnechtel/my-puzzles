import Image from "next/image"
function Game({games, setGames, white, black, result, timeControl, date, time, loggedIn}){
    return(<tr className="bg-slate-50 p-4 odd:bg-slate-300 "><td>{white}</td><td>{black}</td><td>{result}</td><td>{timeControl}</td><td>{date}</td>{loggedIn&&<td><button className="button-3 font-medium text-sm green hover:bg-green-800">Save</button></td>}<td><button onClick={()=>{removeGame(games,white,date,time,setGames)}} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></td></tr>)
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

export function GamesTable({ games, setGames, loggedIn}){
    return(<table className="mx-auto w-4/5 m-10 table-fixed ">
            
            <thead className=" bg-slate-300 mb-2  w-full shadow-lg h-10  "><tr className="h-14" ><th  className="rounded-l-md">White</th><th>Black</th><th>Result</th><th>Time Control</th><th className="">Date</th>{loggedIn&&<th className="w-10"><button className="button-3 font-medium text-sm green hover:bg-green-800">Save All</button></th>}<th className="w-13"><button onClick={()=>setGames([])} className="button-3 font-medium text-sm bg-red-700 hover:bg-red-800">Delete</button></th></tr></thead>
         <tbody>
             <tr className="h-10"></tr>
         </tbody>   
       
        <tbody class="border-2" >
            
            {games.map((game) =>{
                
                    return <Game games={games} key={game.tags.White+game.tags.Date.value+game.tags.UTCTime.value} white={game.tags.White} black={game.tags.Black} result={game.tags.Result} timeControl={game.tags.TimeControl.value} date={game.tags.Date.value} time={game.tags.UTCTime.value} className="bg-slate-400" loggedIn={loggedIn} setGames={setGames}></Game>
                })}
        </tbody>
    </table>)
}
