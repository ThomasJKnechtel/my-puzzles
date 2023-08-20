import Image from "next/image";

export default function LoadingIcon({progress}){
    const height = progress*10
    return (<><div className=" border-2 relative m-2"><div className={" green  absolute  w-full bottom-0 left-0 z-0 h-["+height+"px]"}></div><label className=" z-10 relative"><Image src="https://img.icons8.com/material-outlined/48/puzzle.png" alt="loadingIcon" width={50} height={50} ></Image></label></div><label>loading puzzles...</label></>)
}