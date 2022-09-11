import React from 'react';

const InputForm=(props)=>{
    const posX=()=>{ return props.position[0]; }
    const posY=()=>{return props.position[1]; }
    const width=()=>{ return props.width; }
    const height=()=>{ return props.height; }

    const OnSubmit=(event)=>{
        event.preventDefault();
    }

    return(
        <form onSubmit={OnSubmit}>
            <input  type="text" 
                    onChange={props.onChange}
                    style={divStyle(posX(), posY(), width(), height())} />
        </form>
    )
}


//#region STYLE
const divStyle=(posx, posy, width, height)=>{ 
    return {
        position:'absolute',
        left:posx,
        top:posy,
        width:`${width}px`,
        height:`${height}px`,
        borderRadius:'4px',
        boxShadow: `0px 0px 8px #222`,
        fontWeight:'bold',
        paddingLeft:4,
        paddingRight:4,
        fontSize:12,
    }
}
//#endregion

export default InputForm;