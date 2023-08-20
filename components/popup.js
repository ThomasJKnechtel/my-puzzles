import { useState, useRef } from 'react'
import style from "./popup.module.css"


export function Popup({buttonChildren, buttonStyle, children, headerChildren}){
    const [isOpen, setOpen] = useState(false)
    const popupRef = useRef(null)
    const openPopup = ()=>{
        setOpen(true)
    }
    const closePopup = ()=>{
        setOpen(false)
    }
    const popupButtonClicked = ()=>{
        if(isOpen){
            closePopup()
        }else{
            openPopup()
        }
    }
    const closeOpenPopup = (e) =>{
        if(popupRef.current&&isOpen&&!popupRef.current.contains(e.target)){
            closePopup()
        }
    }
    document.addEventListener('mousedown', closeOpenPopup)
    return (
        <div className = "mr-0 ml-auto relative z-50">
            <button className="rounded-lg focus:border-2 border-gray-400" onClick={popupButtonClicked}>{buttonChildren}</button>
            {isOpen&& (
                <div ref={popupRef} className = "absolute border-2 border-gray-400 left-[-135px] bg-gray-400 rounded-lg shadow-lg">
                <header className="">
                    {headerChildren}
                </header>
                <main className="bg-white p-2 inline-flex flex-col w-full">
                    {children}
                </main>
                </div>
            )}
            
        </div>
    )
    
}
   



