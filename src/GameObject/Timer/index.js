import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './index.css';



function Timer(props){
    const [state, setState]=useState({
        delay:25,
        timePassed:0.0,
        timeRemain:props.duration,
    })

    const TIME_DURATION=props.duration
    const TIMER_RADIUS=(props.size!=undefined)?props.size.width*0.425:34
    const TIMER_AREA=2*Math.PI*TIMER_RADIUS
    
    const OnTimerUpdate=()=>{
        if(state.timePassed>=TIME_DURATION)
            return

        const timePassed=state.timePassed+(state.delay/1000.0)
        const timeRemain=TIME_DURATION-timePassed
        const isRunning=(timeRemain>0)

        setState(prevState=>({
            ...prevState,
            timePassed:timePassed,
            timeRemain:timeRemain,
        }))

        if(timeRemain<=0)
            props.onComplete()
    }

    useInterval(() => {
        OnTimerUpdate()
    }, props.isRunning ? state.delay : null);


    //#region STYLES
    const divStyle={
            position: 'absolute',
            left:(props.position!=undefined)?props.position.x:0,
            top:(props.position!=undefined)?props.position.y:0,
            width: (props.size!=undefined)?props.size.width:'100%',
            height: (props.size!=undefined)?props.size.height:'100%',
            backgroundColor:(props.background)?props.background:null,
            alignItems: 'center',
            justifyContent: 'center',
            transform:'rotate(90deg)',
    }
    const svgStyle={
        viewBox:"0 0 100 100",
    }
    const circleStyle={
        fill: 'none',
        stroke: 'none',   
    }
    const circleTimeElapsed={
        position: 'absolute',
        top:0,
        left:0,
        height: '100%',
        width: '100%',
        stroke: 'darkslateblue',
        strokeWidth: '8px',
        cx:(props.size!==undefined)?props.size.width/2:40,
        cy:(props.size!==undefined)?props.size.height/2:40,
        r:TIMER_RADIUS,
        strokeDasharray: `${(state.timePassed/TIME_DURATION)*TIMER_AREA} ${TIMER_AREA}`,
    }
    const timerLabel={   
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'darkslateblue',
        transform:'rotate(-90deg)',
    }
    //#endregion

    return(
        <div style={divStyle}>
            <svg style={svgStyle}>
                <g style={circleStyle}>
                    <circle style={circleTimeElapsed}/>
                </g>
            </svg>
            <span style={timerLabel}>
                {(state.timeRemain<=0)? '0' : state.timeRemain.toFixed(1)}
            </span>
        </div>
    )
}

Timer.propTypes={
    duration: PropTypes.number,
    position: PropTypes.object,
    size: PropTypes.object,
    onComplete: PropTypes.func,
}

const  useInterval=(callback, delay)=>{
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        const tick=()=>{
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default Timer