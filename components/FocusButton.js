import Image from "next/image"

export default function FocusButton({setFocus, focus}){

    return  <button type="button" onClick={()=>{setFocus(!focus)}}>
    {!focus?
         <Image width="20" height="20" src="https://img.icons8.com/ios/50/resize-diagonal--v1.png" alt="resize-diagonal--v1"/>:
         <Image width="20" height="20" src="https://img.icons8.com/ios/50/compress--v1.png" alt="compress--v1"/>
    }
       
    </button>  
}