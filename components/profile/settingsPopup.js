/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect } from "react"
import useCookies from "../hooks/useCookies"
import ChessSquare from "./chessSquare"

export default function SettingsPopup(){
    const cookies = useCookies()
    useEffect(()=>{
        const showNotation = cookies?.showNotation
        const showNotifications = cookies?.showNotifications
        const boardStyle = cookies?.boardStyle
        if(showNotation !== undefined && showNotifications !== undefined && boardStyle !== undefined){
            document.querySelector('#showNotifications').defaultChecked = JSON.parse(showNotifications)
            document.querySelector('#showNotation').defaultChecked = JSON.parse(showNotation)
            const radioId = boardStyle.replace(/#|,/g, '')
            const input =  document.querySelector(`#input${radioId}`)
            if(input){
                input.checked = true
                document.querySelector(`#container${radioId}`)?.classList?.add('border-2')
            }
        }
        
    }, [cookies])
    function updateCookie(){
        const formData = new FormData(document.querySelector('#settingsForm'))
        const notifications = formData.get('showNotifications')==='on'
        const notation = formData.get('showNotation')==='on'
        const boardStyle = formData.get('boardStyle')
        
        document.cookie = `showNotifications=${notifications};path=/;expires=Tue, 31 Dec 2030 12:00:00 UTC;`
        document.cookie = `showNotation=${notation};path=/;expires=Tue, 31 Dec 2030 12:00:00 UTC;`
        document.cookie = `boardStyle=${boardStyle};path=/;expires=Tue, 31 Dec 2030 12:00:00 UTC;`
    }   
    return (
        <form id="settingsForm" onSubmit={updateCookie} className=" bg-slate-200 h-fit p-2 flex-col gap-2 rounded-md border-4 shadow-md relative hidden max-w-[600px] w-full">
            <button type="button" onClick={()=>document.querySelector('#settingsForm').classList.add('hidden')} className=" absolute right-0 top-0">✖</button>
            <h1 className=" font-bold text-2xl border-b-2 border-slate-300">Settings</h1>
            <label className=" font-medium text-slate-600">Enable Notifications</label>
            <label className=" w-[60px] h-[30px] bg-white inline-flex flex-row items-center"><input id="showNotifications" name="showNotifications"  className=" w-full h-0 opacity-0 order-3 checked:order-1 appearance-none  " type="checkbox"/><span className=" h-full w-[40px] bg-slate-400 block order-2"/></label>
            <h2 className=" font-bold text-xl text-slate-600 border-t-2 border-slate-300">Board Settings</h2>
            <label className=" font-medium text-slate-600">Show Notation</label>
            <label className=" w-[60px] h-[30px] bg-white inline-flex flex-row items-center"><input id="showNotation" name="showNotation" className=" w-full h-0 opacity-0 order-3 checked:order-1 appearance-none  " type="checkbox"/><span className=" h-full w-[40px] bg-slate-400 block order-2"/></label>
            <label className=" font-medium text-slate-600">Board Style</label>
            <div className=" flex w-full flex-wrap gap-2 flex-row"><ChessSquare dark='#964d22' light='#eedc97' defaultChecked/><ChessSquare dark='#241a0f' light='#eedc97'/><ChessSquare dark='#241a0f' light='#7c7c7c'/><ChessSquare dark='#7c7c7c' light='#cccccc'/></div>
            <input type="submit" className="bg-green-600 w-fit px-2 py-1 font-medium rounded-md shadow-md" />
        </form>
    )
    
}