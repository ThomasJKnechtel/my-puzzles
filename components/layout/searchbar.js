/* eslint-disable jsx-a11y/label-has-associated-control */
import Image from "next/image"
import { useEffect, useState } from "react"

export default function SearchBar({setGamesPgns}){
    const [showForm, setShowForm] = useState(false)
    async function getGames(){
        let url = "https://lichess.org/api/games/user/"
        const player = document.getElementById('player').value 
        
        const form = document.getElementById('searchPerametersForm')
        const formData = new FormData(form)
        const searchPerams = new URLSearchParams(formData)

        url += `${player }?`
        let dateFromObject = null
        let dateToObject = null
        const perfTypes = searchPerams.getAll('perfType')
        const [opponent, dateFrom, timeFrom, dateTo, timeTo] = [searchPerams.get('opponent'), searchPerams.get('dateFrom'), searchPerams.get('timeFrom'), searchPerams.get('dateTo'), searchPerams.get('timeTo')]

        if(dateFrom) dateFromObject = new Date(`${dateFrom} ${timeFrom}`)
        if(dateTo) dateToObject =  new Date(`${dateTo  } ${  timeTo}`)
        const lichessSearchPerams = new URLSearchParams()
        if(opponent)    lichessSearchPerams.append('vs', lichessSearchPerams.get('opponent'))
        lichessSearchPerams.append('perfTypes', perfTypes)
        lichessSearchPerams.append('max', searchPerams.get('max'))
  
        if(dateFromObject) lichessSearchPerams.append('since', dateFromObject.getTime())
        if(dateToObject) lichessSearchPerams.append('until', dateToObject.getTime())
        url+=lichessSearchPerams.toString()
        fetch(url).then( response => {
            if(!response.ok){
                console.log(response.status)
                const errorMessage = document.getElementById("searchErrorMessage")
                errorMessage.style.display = "block"
                
            }
            return response.text()
        }).then(gamesStr=> {
            const gameList = gamesStr.split(/\n\s*\n\s*\n/)
            setGamesPgns(gameList)
        })
    }
    useEffect(()=>{
        const form = document.getElementById('searchPerametersForm')
        if(showForm) form.style.display = "block"
        else form.style.display = "none"
    }, [showForm])
    return (
      
        
        <div onKeyDown={(e)=>{if(e.key==='Enter')getGames()}} className="inline-flex flex-row items-center max-h-6 bg-white p-1 rounded-r-full relative w-96 justify-between border-black border-2 justify-between  ">
                <input id="player" type="text" placeholder="Enter a Lichess username" className=" w-64 max-h-4"  />
                <span className=" inline-flex flex-row items-center">
                 <div className=" inline-flex flex-row">
                    <label id="searchErrorMessage" className="text-xs text-red-800 hidden font-medium opacity-50">No Games Found</label>
                    <div className="relative focus-within:bg-slate-200 peer-focus:bg-opacity-0">
                        <button type="button" className=' m-1 ' onClick={()=>setShowForm(!showForm)}><Image src="https://img.icons8.com/external-smashingstocks-detailed-outline-smashing-stocks/66/external-parameters-festivals-and-events-smashingstocks-detailed-outline-smashing-stocks.png" alt="perameters" width={15} height={15}/></button>
                        <div className=" absolute top-[25px] right-0 shadow-md"><SearchPerameterForm setShowForm={setShowForm} /></div>
                    </div>
                <button type="button" className="" onClick = {getGames} ><Image src="https://img.icons8.com/ios/50/search--v1.png" alt="search" width={15} height={15} className=""/></button></div>
                </span>
               
         </div>
        
        
    )
}

function SearchPerameterForm({setShowForm}){
    
    return (
        <form id="searchPerametersForm" method="dialog" className=" bg-white relative z-10 px-4 rounded-md border-2 max-w-sm">
        <button type="button" className=" absolute right-1 text-sm text-slate-400 font-mono" onClick={()=>{setShowForm(false)}}>✖</button>
        <fieldset className=" m-2 w-full">
        <div className=" inline-flex flex-col "><label className=" font-medium" htmlFor="opponent">Opponent</label><input type="text" name="opponent" className=" border-2 shadow-sm bg-slate-100 " /></div>
        </fieldset>
        <fieldset className=" flex justify-between m-2 border-t-2 p-2">
            <label className=" font-medium" htmlFor="perfType">Format</label>
            <div className=" inline-flex flex-col">
            <div><input  type="checkbox" name="perfType" defaultChecked defaultValue="UltraBullet" /><label  >UltraBullet</label></div>
            <div><input type="checkbox" name="perfType" defaultChecked defaultValue="Bullet" /><label >Bullet</label></div>
            <div><input type="checkbox" name="perfType" defaultChecked defaultValue="Blitz" /><label >Blitz</label></div>
            <div><input type="checkbox" name="perfType" defaultChecked defaultValue="Rapid" /><label >Rapid</label></div>
            <div><input type="checkbox" name="perfType" defaultChecked defaultValue="Classical" /><label >Classical</label></div>
            <div><input type="checkbox" name="perfType" defaultChecked defaultValue="Correspondence" /><label >Correspondence</label></div>

            </div>
        </fieldset>
        <fieldset className=" flex justify-between w-full m-2 border-t-2 p-2">
            
            <div className=" inline-flex flex-col sm:flex-row justify-between">
                <label className=" font-medium">Dates</label>
                <div className="">
                    <div className=" inline-flex flex-row justify-end w-full py-2" >
                        <label className="mr-4 ">From</label>
                        <span className=" inline-flex">
                            <input type="date" name="dateFrom" className="border-2 shadow-sm bg-slate-100 mr-2 text-sm" />
                            <input type="time" name="timeFrom" className="border-2 shadow-sm bg-slate-100 text-sm" />
                        </span>
                    </div>
                    <div className=" inline-flex flex-row justify-end w-full py-2" >
                        <label className="mr-4">To</label>
                        <span className=" inline-flex">
                            <input type="date" name="dateTo" className="border-2 shadow-sm bg-slate-100 mr-2 text-sm" />
                            <input type="time" name="timeTo" className="border-2 shadow-sm bg-slate-100 text-sm" />
                        </span>
                    </div>
                </div>
            </div>
        </fieldset>
        <fieldset className=" m-2 w-full flex justify-between p-2 border-t-2">
            <label className=" font-medium">Games</label>
            <input type="number" max={100} min={0} defaultValue={10} className="border-2 shadow-sm bg-slate-100" name="max" />
        </fieldset>
        </form>
    )
}