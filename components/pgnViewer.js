import getPGNViewerObject, { addMove, getLastMove, getMove, getNextMove } from "@/utils/PGNViewerObject";
import { useEffect, useState } from "react";


export default function PGNViewer({pgnViewerObject, currentMove, setCurrentMove}){
//Notes: Must display all moves and variations, must add move to any variation, must display current move, on move click must return the variation of the move 
   
    function onMoveClick(e){
        const button = e.currentTarget
        const coordinates = JSON.parse(button.getAttribute('coordinates'))

        setCurrentMove(getMove(pgnViewerObject, coordinates ))
       
    }
    function onNextMoveClick(){
        if(currentMove){
            const newMove = getNextMove(pgnViewerObject, currentMove)
            if(newMove){
                setCurrentMove(newMove)
            }
        }
    }
    function onBackMoveClick(){
        if(currentMove){
            const newMove = getLastMove(pgnViewerObject, currentMove)
            if(newMove){
                setCurrentMove(newMove)
            }
        }
    }
    function convertToTable(variation, isMainVariation){
        const displayVariation  = []
        let movePair = null
        if(variation){
            variation.map((move, index)=>{
            if(isMainVariation){
                move.isMainVariation = true
                movePair=[]
                if(move.turn=="w"){
                    movePair = [move]
                }else{
                    movePair.push(move)
                    displayVariation.push(structuredClone(movePair))
                    movePair = []
                }
                if(move.turn=="w"&&index+1==variation.length){
                    displayVariation.push(structuredClone(movePair))
                    movePair = []
                }
                move.variations.map(variation=>{
                    displayVariation.push(convertToTable(variation, false))
                })
            }else{
                move.isMainVariation = false
                displayVariation.push(move)
                move.variations.map(variation=>{
                    displayVariation.push(convertToTable(variation, false))
                })
            }
        })
        }
        
        return displayVariation
    }
    function createPgnTable(tableObject, isRow){
        if(isRow){
        return tableObject.map((row)=>{
            
                if(row[0].isMainVariation){
                    if(row.length == 2){
                        const white = row[0]
                        const black = row[1]
                        return <tr className=" border-t-2 border-gray-50 h-fit"><td>{white.moveNumber}</td><td  className=" w-36"><button id={JSON.stringify(white.coordinates)} onClick={onMoveClick} className={JSON.stringify(currentMove) == JSON.stringify(white)?"w-full bg-blue-100":"w-full"} coordinates={JSON.stringify(white.coordinates)}>{white.notation.notation}</button></td><td  className=" w-36"><button id={JSON.stringify(black.coordinates)} onClick={onMoveClick} className={JSON.stringify(currentMove)==JSON.stringify(black)?"w-full bg-blue-100":"w-full"} coordinates={JSON.stringify(black.coordinates)}>{black.notation.notation}</button></td></tr>
                    }else if(row.length == 1){
                        if(row.turn == "w"){
                            return <tr className=" border-t-2 border-gray-50 h-fit"><td>{row[0].moveNumber}</td><td><button id={row[0].coordinates} onClick={onMoveClick} coordinates={JSON.stringify(row[0].coordinates)} className={JSON.stringify(currentMove)==JSON.stringify(row[0])?"w-full bg-blue-100":"w-full"}>{row[0].notation.notation}</button></td><td></td></tr>
                        }else{
                            return <tr className=" border-t-2 border-gray-50 h-fit"><td>{row[0].moveNumber}</td><td></td><td><button id={row[0].coordinates} onClick={onMoveClick} coordinates={JSON.stringify(row[0].coordinates)} className={JSON.stringify(currentMove)==JSON.stringify(row[0])?"w-full bg-blue-100":"w-full"}>{row[0].notation.notation}</button></td></tr>
                        }
                        
                    }
                }else{
                    return <tr className=" border-t-2 border-gray-50 bg-slate-50 h-fit"><td colSpan="3">{createPgnTable(row, false)}</td></tr>
                }
        })}else{
        return  tableObject.map((moveSet, index)=>{
                if(Array.isArray(moveSet)){
                    return <span><label>(</label>{createPgnTable(moveSet, false)}<label>)</label></span>
                }else{
                    let moveStr = ''
                    if(moveSet.turn=="w"){
                        moveStr = moveSet.moveNumber + "."
                    }else if(moveSet.turn == "b" && index == 0){
                        moveStr = moveSet.moveNumber +"..."
                    }
                    return <><button id={JSON.stringify(moveSet.coordinates)} onClick={onMoveClick} className={JSON.stringify(currentMove)==JSON.stringify(moveSet)?"p-1 text-sm bg-blue-100":" p-1 text-sm "}coordinates={JSON.stringify(moveSet.coordinates)}><label className=" text-sm">{moveStr}</label><label>{moveSet.notation.notation}</label></button></>
                }
            })
        }
        
    }
  
    
    return (
    <div>
        <div className=" h-[500px] overflow-y-scroll bg-white">
        
            <table className=" bg-white p-2 border-2 w-[20.5rem]">
            <thead className=" border-b-2"><tr><th></th><th>White</th><th>Black</th></tr></thead>
            <colgroup><col className=" bg-slate-200 w-10"></col><col className=" border-r-2"></col><col></col></colgroup>
            <tbody>
                
                {
                    createPgnTable(convertToTable( pgnViewerObject, true), true)
                }
                
                
            </tbody>
                
            </table>
           
        
    </div>
    <button onClick={onBackMoveClick} className=" w-[10.25rem] bg-white p-1 border-2 mt-1">Back</button><button onClick ={onNextMoveClick} className=" w-[10.25rem] bg-white p-1 border-2">Next</button>
    </div>
    
    )
}
