/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useRef } from 'react'
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
            <button type='button' className="rounded-lg focus:border-2 border-gray-400" onClick={popupButtonClicked}><header className="">
                <Image src={session.user.image} alt="profilePick" width={50} height={50} className="rounded-lg focus:border-2 border-gray-400 "/>
                </header></button>
            {isOpen&& (
                <div ref={popupRef} className = "absolute border-2 border-gray-400 left-[-135px] bg-gray-400 rounded-lg shadow-lg">
                    <h3 className="text-center my-2  font-bold">{session.user.name}</h3><label className="text-center text-xs mx-2 font-semibold">{session.user.email}</label>
                    <main className="bg-white p-2 inline-flex flex-col w-full">
                    <button type="button" className='button-3 green'>Profile</button><br/><button type="button" className='button-3 green' onClick={()=>{signOut()}}>Log Out</button>
                    </main>
                </div>
            )}
            
        </div>
    )
    
}
   



