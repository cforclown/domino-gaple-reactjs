import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useInterval } from '../../Hooks/useInterval'

import * as PileActions from './Actions/PileAction'
import Domino from '../Domino/Domino'
import DominoTemplate from '../Domino/DominoTemplate'



const Pile=(props)=>{
    const [insertAnim, setInsertAni]=useState({
        endPosition:undefined,
        transform:undefined,
        domino:undefined
    })

    const dispatch=useDispatch()

    const OnClueClickCallback=(clueProps)=>{
        let domino=DominoTemplate(clueProps.value[0], clueProps.value[1])
        domino.pileSide=(clueProps.pileSide===undefined)?PileSide.HEAD:clueProps.pileSide
        dispatch(PileActions.LocalPlayerAction(domino, domino.pileSide))
    }

    function Distance(pos1, pos2){
        return Math.sqrt(((pos2.x-pos1.x)*(pos2.x-pos1.x))+((pos2.y-pos1.y)*(pos2.y-pos1.y)))
    }
    function Translation(pos1, pos2, speed){
        const distx=pos2.x-pos1.x
        const disty=pos2.y-pos1.y
        const r=Math.sqrt((distx*distx)+(disty*disty))
        const cosAlpha=Math.abs(distx)/r
        const sinAlpha=Math.abs(disty)/r

        const stepX=cosAlpha*speed
        const stepY=sinAlpha*speed

        let newPos={
            x:pos1.x+((pos1.x<pos2.x)?stepX:-stepX),
            y:pos1.y+((pos1.y<pos2.y)?stepY:-stepY)
        }

        if(pos1.x<pos2.x){
            newPos.x+=stepX
            if(newPos.x>pos2.x)
                newPos.x=pos2.x
        }
        else{
            newPos.x-=stepX
            if(newPos.x<pos2.x)
                newPos.x=pos2.x
        }

        if(pos1.y<pos2.y){
            newPos.y+=stepY
            if(newPos.y>pos2.y)
                newPos.y=pos2.y
        }
        else{
            newPos.y-=stepY
            if(newPos.y<pos2.y)
                newPos.y=pos2.y
        }
        return newPos
    }

    function insertDominoAnimation(param){
        if(param.seatid===undefined || param.domino===undefined || param.endPosition===undefined || param.transform===undefined){
            dispatch(PileActions.OnInsertDominoComplete(undefined, undefined))
            return
        }

        if(insertAnim.endPosition===undefined){
            let domino={ ...param.domino }
            domino.position=(param.seatid===0) ? { x:props.size.width/2-5, y:props.size.height-20 } :
                                ((param.seatid===1) ? { x:props.size.width-20, y:props.size.height/2-5 } : 
                                    ((param.seatid===2) ? { x:props.size.width/2-5, y:10 } :
                                        { x:10, y:props.size.height/2-5 }))
            domino.transform=param.transform
            setInsertAni(prevState=>({
                ...prevState,
                endPosition:param.endPosition,
                transform:param.transform,
                domino:domino,
            }))

            return
        }

        if(Distance(insertAnim.domino.position, insertAnim.endPosition)<5){
            setInsertAni(prevState=>({
                ...prevState,
                endPosition:undefined,
                transform:undefined,
                domino:undefined,
            }))
            dispatch(PileActions.OnInsertDominoComplete(param.seatid, param.domino))

            return
        }
        
        let domino=insertAnim.domino
        domino.position=Translation(domino.position, insertAnim.endPosition, 5)

        setInsertAni(prevState=>({
            ...prevState,
            domino:domino,
        }))
    }

    
    //#region loop
    useInterval(() => {
        if(props.animation.insertDomino!==undefined){
            insertDominoAnimation(props.animation.insertDomino)
        }
    }, props.animation.isRunning ? props.animation.delay : null);
    //#endregion

    //#region STYLE
    const divStyle={
            position:'absolute',
            left:props.position.x,
            top:props.position.y,
            width:props.size.width,
            height:props.size.height,
            //backgroundColor:'#00000011'
    }
    //#endregion

    return (
        <div style={divStyle}>
            {props.dominos.map((domino, index)=>{
                return (
                    <Domino key={index} {...domino} onClueClick={OnClueClickCallback}/>
                )
            })}
            {(insertAnim.domino!==undefined) ? <Domino {...insertAnim.domino}/> : null}
            {/* <div style={{
                            position:'absolute',
                            left:props.size.width/2-5,
                            top:props.size.height-20,
                            backgroundColor:'black',
                            backgroundSize:'cover',
                            border:'2px solid white',
                            width:'10px',
                            height:'10px', 
                        }}/>
            <div style={{
                            position:'absolute',
                            left:props.size.width-20,
                            top:props.size.height/2-5,
                            backgroundColor:'black',
                            backgroundSize:'cover',
                            border:'2px solid white',
                            width:'10px',
                            height:'10px',
                        }}/>
            <div style={{
                            position:'absolute',
                            left:props.size.width/2-5,
                            top:10,
                            backgroundColor:'black',
                            backgroundSize:'cover',
                            border:'2px solid white',
                            width:'10px',
                            height:'10px', 
                        }}/>
            <div style={{
                            position:'absolute',
                            left:10,
                            top:props.size.height/2-5,
                            backgroundColor:'black',
                            backgroundSize:'cover',
                            border:'2px solid white',
                            width:'10px',
                            height:'10px', 
                        }}/> */}
        </div>
    )
}
export default Pile;

export const PileSide={
    HEAD:"HEAD",
    TAIL:"TAIL"
}
export const PileVector={
    LEFT:0,
    RIGHT:1,
    UP:2,
    DOWN:3
}
export const DominoSize={
    width:30, 
    height:60
}
