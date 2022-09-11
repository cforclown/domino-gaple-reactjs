import React from 'react'

const Button=(props)=>{
    const posX=()=>{ return props.position[0]; }
    const posY=()=>{return props.position[1]; }
    const width=()=>{ return props.width; }
    const height=()=>{ return props.height; }
    const color=()=>{ return (props.color===undefined)? 'gray' : props.color; }

    const divStyle=(posx, posy, width, height, color)=>{ 
        return {
            position:'absolute',
            left:posx,
            top:posy,
            width:`${width}px`,
            height:`${height}px`,
            borderRadius:'12px',
            backgroundColor:`${color}`,
            boxShadow: `0px 0px 8px #222`,
            fontFamily:'Quicksand-Bold',
            fontWeight:'bold',
            fontSize:24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    }

    return (
        <button onClick={props.callback} style={divStyle(posX(), posY(), width(), height(), color())}>
            {(props.text!==undefined)?props.text:null}
            {(props.image!==undefined)?
                <image style={{
                    backgroundImage:`url('${props.image}')`,
                    backgroundSize:'cover',
                }}/> : null}
        </button>
    )
};

export default Button;