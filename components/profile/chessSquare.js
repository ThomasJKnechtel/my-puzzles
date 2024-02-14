import { useEffect } from "react"

/* eslint-disable jsx-a11y/label-has-associated-control */
export default function ChessSquare({light, dark}){
    const id = `${light},${dark}`.replace(/#|,/g, '')
   
    function radioChange(e){
        const radio = e.target
        if(radio.checked){
            
            document.querySelectorAll(`input[name=boardStyle]`).forEach(elem=>{
                elem.parentElement.classList.remove('border-2')
            })
            radio.parentElement.classList.add('border-2')
        }
    }
    return (
        <label id={`container${id}`}  className={`w-[100px] h-[100px] flex flex-wrap relative border-black  `}>
            <span style={{backgroundColor: light}} className='h-1/2 w-1/2 block'/>
            <span style={{backgroundColor: dark}} className='h-1/2 w-1/2 block'/>
            <span style={{backgroundColor: dark}} className='h-1/2 w-1/2 block'/>
            <span style={{backgroundColor: light}} className='h-1/2 w-1/2 block'/>
            <input id={`input${id}`} type="radio" name="boardStyle" value={`${light},${dark}`} className=" absolute opacity-0  " onChange={radioChange}/>
        </label>
    )
}