import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { useInterval } from '../../../Hooks/useInterval'
import { OnRemoveDominoAnimationComplete } from '../Actions/PlayerAction'
import Domino, { DominoSize } from '../../Domino/Domino'



function Hand(props){
    const [removeDominoAnim, setRemoveDominoAnim]=useState({
        currentSize:undefined,
        handIndex:undefined,
        domino:undefined
    })
    
    const dispatch=useDispatch()

    const width=10;
    const height=10;

    const GetDominoPositionByIndex=(index)=>{
        if(props.seatid===0){
            let x=centerXOfThis(DominoSize.width)+((index*DominoSize.width)+(index*10))
            let y=centerYOfThis(DominoSize.height)

            return {
                x:x, 
                y:y
            }
        }
        else if(props.seatid===1){
            let x=centerXOfThis(DominoSize.width)
            let y=centerYOfThis(DominoSize.height+((index*DominoSize.height)+(index*10)))

            return {
                x:x, 
                y:y
            }
        }
        else if(props.seatid===2){
            let x=centerXOfThis(DominoSize.width)-((index*DominoSize.width)+(index*10))
            let y=centerYOfThis(DominoSize.height)

            return {
                x:x, 
                y:y
            }
        }
        else if(props.seatid===3){
            let x=centerXOfThis(DominoSize.width)
            let y=centerYOfThis(DominoSize.height-((index*DominoSize.height)+(index*10)))

            return {
                x:x, 
                y:y
            }
        }
    }
    const GetDominoTransform=()=>{
        if(props.seatid===0){
            return 0
        }
        else if(props.seatid===1){
            return 270
        }
        else if(props.seatid===2){
            return 180
        }
        else if(props.seatid===3){
            return 90
        }
    }

    const centerXOfThis=(contentWidth)=>{ return (width/2-contentWidth/2); }
    const centerYOfThis=(contentHeight)=>{ return (height/2-contentHeight/2); }

    function Scaling(currentSize, newSize, scaleSpeed){
        let size=currentSize

        let distWidht=Math.abs(newSize.width-currentSize.width)
        let distHeight=Math.abs(newSize.height-currentSize.height)
        let stepx=scaleSpeed
        let stepy=scaleSpeed
        if(distWidht>distHeight)
            stepy=stepx/distWidht*distHeight
        else
            stepx=stepy/distHeight*distWidht

        if(currentSize.width<newSize.width){
            size.width=currentSize.width+=stepx
            if(size.width>newSize.width)
                size.width=newSize.width
        }
        else{
            size.width=currentSize.width-=stepx
            if(size.width<newSize.width)
                size.width=newSize.width
        }

        if(currentSize.height<newSize.height){
            size.height=currentSize.height+=stepy
            if(size.height>newSize.height)
                size.height=newSize.height
        }
        else{
            size.height=currentSize.height-=stepy
            if(size.height<newSize.height)
                size.height=newSize.height
        }

        return size
    }

    function RemoveDominoAnimation(param){
        if(param.handIndex===undefined || param.domino===undefined){
            dispatch(OnRemoveDominoAnimationComplete(undefined, undefined, undefined))
            return
        }

        if(removeDominoAnim.currentSize===undefined){
            setRemoveDominoAnim(prevState=>({
                ...prevState,
                currentSize:{
                    width:DominoSize.width,
                    height:DominoSize.height
                },
                handIndex:param.handIndex,
                domino:param.domino,
            }))

            return
        }

        if(removeDominoAnim.currentSize.width<5){
            setRemoveDominoAnim(prevState=>({
                ...prevState,
                currentSize:undefined,
                handIndex:undefined,
                domino:undefined
            }))
            dispatch(OnRemoveDominoAnimationComplete(props.seatid, param.handIndex, param.domino))

            return
        }

        let currentSize=removeDominoAnim.currentSize
        currentSize=Scaling(currentSize, { width:0, height:0 }, 5)
        setRemoveDominoAnim(prevState=>({
            ...prevState,
            currentSize:currentSize,
        }))
    }

    //#region loop
    useInterval(() => {
        if(props.removeDominoAnimation!==undefined){
            RemoveDominoAnimation(props.removeDominoAnimation)
        }
    }, (props.removeDominoAnimation!==undefined) ? 10 : null);
    //#endregion
    
    //#region STYLE
    const divStyle={
        position:'absolute',
        left:props.position.x,
        top:props.position.y,
        //backgroundColor:'black',
        //backgroundSize:'cover',
        //border:'2px solid white',
        width:'10px',
        height:'10px', 
    }
    //#endregion

    return (
        <div style={divStyle}>
            { props.dominos.map((domino, index)=>{
                return (
                    <Domino key={index} 
                            {...domino} 
                            position={GetDominoPositionByIndex(index)}
                            transform={GetDominoTransform()}
                            size={
                                (props.removeDominoAnimation===undefined) ?
                                    undefined :
                        
                                (index!==props.removeDominoAnimation.handIndex) ?
                                    undefined :
                                
                                (removeDominoAnim.currentSize===undefined) ?
                                    undefined :
                                
                                removeDominoAnim.currentSize
                            }
                            onDominoClick={()=>{
                                    props.onDominoClick(index)
                    }}/>
                )
            })}
        </div>
    )
}

Hand.propTypes={
    seatid: PropTypes.number.isRequired,
    position: PropTypes.object.isRequired,
    dominos: PropTypes.array,
    removeDominoAnimation: PropTypes.any,
    onDominoClick: PropTypes.func,
}

export default Hand;

