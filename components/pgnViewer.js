/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line import/no-unresolved, import/extensions
import {  getLastMove, getMove, getNextMove } from "@/utils/PGNViewerObject";
import { useEffect } from "react";



export default function PGNViewer({pgnViewerObject, currentMove, setCurrentMove, display, width, height}){

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
        let movePair = []
        if(variation){
            variation.map((move, index)=>{
            if(isMainVariation){
                move.isMainVariation = true
                if(move.turn==="w"){
                    movePair = [move]
                }else{
                    movePair.push(move)
                    displayVariation.push(structuredClone(movePair))
                    movePair = []
                }
                if(move.turn==="w"&&index+1===variation.length){
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
        let key = 0
        if(isRow){
        return tableObject.map((row)=>{
                key+=1
                if(row[0].isMainVariation){
                    if(row.length === 2){
                        const white = row[0]
                        const black = row[1]
                        return <tr key={key} className=" border-t-2 border-gray-50 h-fit"><td>{white.moveNumber}</td><td  className=" w-36"><button type="button" id={JSON.stringify(white.coordinates)} onClick={onMoveClick} className={JSON.stringify(currentMove) == JSON.stringify(white)?"w-full bg-blue-100":"w-full"} coordinates={JSON.stringify(white.coordinates)}>{white.notation.notation}</button></td><td  className=" w-36"><button type="button" id={JSON.stringify(black.coordinates)} onClick={onMoveClick} className={JSON.stringify(currentMove)===JSON.stringify(black)?"w-full bg-blue-100":"w-full"} coordinates={JSON.stringify(black.coordinates)}>{black.notation.notation}</button></td></tr>
                    }if(row.length === 1){
                        if(row[0].turn === "w"){
                            return <tr key={key} className=" border-t-2 border-gray-50 h-fit"><td>{row[0].moveNumber}</td><td><button type="button" id={row[0].coordinates} onClick={onMoveClick} coordinates={JSON.stringify(row[0].coordinates)} className={JSON.stringify(currentMove)==JSON.stringify(row[0])?"w-full bg-blue-100":"w-full"}>{row[0].notation.notation}</button></td><td></td></tr>
                        }
                            return <tr key={key} className=" border-t-2 border-gray-50 h-fit"><td>{row[0].moveNumber}</td><td></td><td><button type="button" id={row[0].coordinates} onClick={onMoveClick} coordinates={JSON.stringify(row[0].coordinates)} className={JSON.stringify(currentMove)==JSON.stringify(row[0])?"w-full bg-blue-100":"w-full"}>{row[0].notation.notation}</button></td></tr>
                        
                        
                    }
                }else{
                    return <tr key={key} className=" border-t-2 border-gray-50 bg-slate-50 h-fit"><td colSpan="3">{createPgnTable(row, false)}</td></tr>
                }
        })}
        return  tableObject.map((moveSet, index)=>{
            key += 1
                if(Array.isArray(moveSet)){
                    return <span key={key}><label>(</label>{createPgnTable(moveSet, false)}<label>)</label></span>
                }
                    let moveStr = ''
                    if(moveSet.turn === "w"){
                        moveStr = `${moveSet.moveNumber  }.`
                    }else if(moveSet.turn === "b" && index === 0){
                        moveStr = `${moveSet.moveNumber }...`
                    }
                    return <button key={key} type="button" id={JSON.stringify(moveSet.coordinates)} onClick={onMoveClick} className={JSON.stringify(currentMove)==JSON.stringify(moveSet)?"p-1 text-sm bg-blue-100":" p-1 text-sm "}coordinates={JSON.stringify(moveSet.coordinates)}><label className=" text-sm">{moveStr}</label><label>{moveSet.notation.notation}</label></button>
                
            })
        
        
    }
    useEffect(()=>{
        if(display){
            document.querySelector('#pgnViewerContainer').classList.remove('hidden')
        }else{
            document.querySelector('#pgnViewerContainer').classList.add('hidden')
        }
        
    }, [display])
  
    
    return (
    <div id='pgnViewerContainer' className={` w-80 h-full`}>
        <div className=" overflow-y-scroll bg-white w-full h-4/5">
        
            <table className=" bg-white p-2 border-2 w-full ">
            <thead className=" border-b-2"><tr><th></th><th>White</th><th>Black</th></tr></thead>
            <colgroup><col className=" bg-slate-200 w-10" /><col className=" border-r-2" /><col /></colgroup>
            <tbody>
                
                {
                    createPgnTable(convertToTable( pgnViewerObject, true), true)
                }
                
                
            </tbody>
                
            </table>
           
        
    </div>
    <button type="button" onClick={onBackMoveClick} className=" w-1/2 bg-white p-1 border-2 mt-1">Back</button><button onClick ={onNextMoveClick} className=" w-1/2 bg-white p-1 border-2">Next</button>
    </div>
    
    )
}
