/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

export default function Popup({ session}){
    const [isOpen, setOpen] = useState(false)
    const popupRef = useRef(null)
    const openPopup = ()=>{
        setOpen(true)
    }
    const closePopup = ()=>{
        setOpen(false)
    }
    useEffect(()=>console.log(session), [session])
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
        <div>
            <button type='button' className="rounded-lg focus:border-2 border-gray-400" onClick={popupButtonClicked}><header className="">
                <Image src={session.user.image} alt="profilePick" width={50} height={50} className="rounded-lg focus:border-2 border-gray-400 "/>
                </header></button>
            {isOpen&& (
                <div ref={popupRef} className = "absolute border-2 right-0 rounded-lg shadow-lg flex flex-col gap-2 p-2 bg-white">
                   <button type="button" className='button-3 green'>Profile</button>
                   <button type="button" className='button-3 green' onClick={()=>{signOut()}}>Log Out</button>
                    
                </div>
            )}
            
        </div>
    )
    
}
   



