import React from 'react';
import styled from 'styled-components';

import {GetDominoImage} from './domino_images';

const Domino=(props)=>{
    const width=DominoSize.width;
    const height=DominoSize.height;
    const centerXOfThis=(contentWidth)=>{ return (width/2-contentWidth/2); }
    const centerYOfThis=(contentHeight)=>{ return (height/2-contentHeight/2); }

    const DominoImage=()=>{
        if(props.value===undefined)
            return GetDominoImage(undefined)
        
        if(props.isFaceup)
            return GetDominoImage(props.value)
        else
            return GetDominoImage(undefined)
    }

    const DivStyle={
        position:'absolute',
        left:props.position.x,
        top:(props.isSelected)?props.position.y-10:props.position.y,
        backgroundImage:`url('${DominoImage()}')`,
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
        backgroundPosition:'0 0',
        width:`${(props.size!==undefined)?props.size.width:DominoSize.width}px`,
        height:`${(props.size!==undefined)?props.size.height:DominoSize.height}px`,
        transform:`rotate(${props.transform}deg)`,
        opacity:(props.isPileClue) ? 0.5 : 
                    ((props.selectable) ? 1.0 : 0.5),
    }

    return (
        <div    style={DivStyle}
                onClick={(props.onDominoClick!==undefined) ? props.onDominoClick : 
                            ((props.onClueClick!==undefined) ? (()=>props.onClueClick(props)): null)} >
        </div>
    )
}
export default Domino;

export const DominoSize={
    width:40,
    height:80
}