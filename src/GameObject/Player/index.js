import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useInterval } from '../../Hooks/useInterval'
import { AvatarImages } from '../../Assets/Images/avatar'
import Hand from './Hand';
import Timer from '../Timer'
import Button from '../Button/Button'
import * as PlayerActions from './Actions/PlayerAction'
import PlayerActionTypes from './Actions/PlayerActionTypes';
import { Actions } from './PlayerTemplate'
import { AddDominoAction } from '../Pile/Actions/PileAction'
import { PileSide } from '../Pile'
import { DominoSize } from '../Domino/Domino';

import './index.css';



const Container=styled.div`
    position: absolute;
    left: ${props=>props.left}px;
    top: ${props=>props.top}px;

    width: ${props=>props.width}px;
    height: ${props=>props.height}px;

    border-radius: 4px;
    box-shadow: 2px 2px 6px #4b4b4b;

    .player-avatar {
        width: 100%;
        height: 100%;
        background-color: #3d3d3d;
        object-fit: cover;
        border-radius: 4px; 
    }
    .pass-btn {
        display: inline-block;
        padding: 4px 12px;
        margin: 0;

        background-color: #ff3838;
        border: none;
        border-radius: 4px;
        box-shadow: 0 0 20px 0 #ff4d4d;

        text-transform: uppercase;
        text-align: center;
        text-decoration: none;
        font-size: 1.4rem;
        color: white;
    
        transition: all 0.25s ease-in-out;
        -webkit-transition: all 0.25s ease-in-out;
        -moz-transition: all 0.25s ease-in-out;
        -ms-transition: all 0.25s ease-in-out;
        -o-transition: all 0.25s ease-in-out;
    } 
        .pass-btn:hover {
            background-color: #ff4d4d;
        }
        .pass-btn:active {
            transform: scale(0.95);
            -moz-transform: scale(0.95);
            -webkit-transform: scale(0.95);
            -o-transform: scale(0.95);
            -ms-transform: scale(0.95);
        }
`
const UsernameContainer=styled.div`
    position: absolute;
    bottom: -26px;
    left: ${props=>props.left};

    width: ${props=>props.width}px;
    height: 20px;
    
    background-color: #3d3d3d;
    border-radius: 4px;
    box-shadow: 2px 2px 6px #4b4b4b;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    font-family: 'Quicksand-Bold';

    h6 {
        text-transform: uppercase;
        font-size: 0.8rem;
        margin-bottom: 0 !important;
    }
`
const LastActionContainer=styled.div`
    position: absolute;
    left: ${props=>props.left}px;
    top: ${props=>props.top}px;

    width: ${props=>props.width}px;

    font-family: 'Quicksand-Bold';
    color: #ff3838;

    h6 {
        margin-bottom: 0;
        font-size: 1.2rem;
        text-align: center; 
        text-shadow: 0 0 6px #ff4d4d;
    }
`

function Player(props){
    const pileState=useSelector(state=>state.pile)
    const dispatch=useDispatch()

    const width=80;
    const height=80;
    const position=props.position;
    
    function dominos(){
        if(props.animation.removeDomino!==undefined){
            let hand=[]
            for(const [index, domino] of props.dominos.entries()){
                if(index===props.animation.removeDomino.handIndex)
                    hand.push(props.animation.removeDomino.domino)
                hand.push(domino)
            }
            return hand
        }
        
        return props.dominos
    }

    useInterval(() => {
        randomActionTurn()
    }, (props.isOnTurn && !props.isLocal)?500:null);



    const centerXOfThis=(contentWidth)=>{ return (width/2-contentWidth/2); }
    const centerYOfThis=(contentHeight)=>{ return (height/2-contentHeight/2); }

    function onDominoClick(handIndex){
        if(!props.isOnTurn)
            return
        dispatch(PlayerActions.DominoClickAction(props.seatid, handIndex))
    }
    function randomActionTurn(){
        if(pileState.dominos.length===0){
            let randomHandIndex=Math.floor(Math.random() * props.dominos.length)
            dispatch(AddDominoAction(props.seatid, props.dominos[randomHandIndex], PileSide.HEAD))
        }
        else{
            let randomPileSide=Math.floor(Math.random() * 10)
            if(randomPileSide%2===0){
                let matchedDominos=props.dominos.filter(d=>(d.value[0]===pileState.headValue || d.value[1]===pileState.headValue))
                if(matchedDominos.length>0){
                    dispatch(AddDominoAction(props.seatid, matchedDominos[0], PileSide.HEAD))
                }
                else{
                    matchedDominos=props.dominos.filter(d=>(d.value[0]===pileState.tailValue || d.value[1]===pileState.tailValue))
                    if(matchedDominos.length>0){
                        dispatch(AddDominoAction(props.seatid, matchedDominos[0], PileSide.TAIL))
                    }
                    else{
                        dispatch(PlayerActions.PassAction(props.seatid))
                    }
                }
            }
            else{
                let matchedDominos=props.dominos.filter(d=>(d.value[0]===pileState.tailValue || d.value[1]===pileState.tailValue))
                if(matchedDominos.length>0){
                    dispatch(AddDominoAction(props.seatid, matchedDominos[0], PileSide.TAIL))
                }
                else{
                    matchedDominos=props.dominos.filter(d=>(d.value[0]===pileState.headValue || d.value[1]===pileState.headValue))
                    if(matchedDominos.length>0){
                        dispatch(AddDominoAction(props.seatid, matchedDominos[0], PileSide.HEAD))
                    }
                    else{
                        dispatch(PlayerActions.PassAction(props.seatid))
                    }
                }
            }
        }
    }
    function onPassClick(){
        dispatch(PlayerActions.PassAction(props.seatid))
    }
    function onTurnTimeout(){
        dispatch(PlayerActions.OnTimerComplete(props.seatid))
        randomActionTurn()
    }



    return (
        <Container left={props.position[0]} top={props.position[1]} width={width} height={height} >
            <img className='player-avatar' src={AvatarImages[`a${props.avatar}`]} />

            <UsernameContainer left={centerXOfThis(width)-2} width={width}>
                <h6>{props.username}</h6>
            </UsernameContainer>

            {
                (props.lastAction===Actions.PASS && !props.isOnTurn) ? 
                <LastActionContainer 
                    left={(props.seatid===0) ? centerXOfThis(width) : (props.seatid===1) ? -72 : (props.seatid===2) ? centerXOfThis(width) : 72} 
                    top={(props.seatid===0) ? -28 : (props.seatid===1) ? centerYOfThis(15) : (props.seatid===2) ? height+28 : centerYOfThis(15)}
                    width={width}
                >
                    <h6>PASS</h6>
                </LastActionContainer> : 
                null
            
            }

            <Hand   position={{x:(props.seatid===0) ? 125 :
                                    ((props.seatid===1) ? centerXOfThis(10) : 
                                        ((props.seatid===2) ? -65 : 
                                            centerXOfThis(10))), 
                                y:(props.seatid===0) ? centerYOfThis(10) : 
                                    ((props.seatid===1) ? -55 : 
                                        ((props.seatid===2) ? centerYOfThis(10) : 135))}} 
                    removeDominoAnimation={props.animation.removeDomino}
                    isLocal={props.isLocal}
                    seatid={props.seatid}
                    dominos={dominos()}
                    onDominoClick={onDominoClick}/>
            
            {
                (props.isOnTurn && props.isLocal && props.dominos.length>0 && props.dominos.filter(d=>d.selectable).length===0) ? 
                <button 
                    className='pass-btn'
                    style={{
                        position: 'absolute',
                        left: props.seatid===0 ? (props.dominos.length*DominoSize.width)/2+104 :
                                props.seatid===1 ? 4 :
                                props.seatid===2 ? -(props.dominos.length*DominoSize.width)/2-108 :
                                4,
                        top: props.seatid===0 ? centerYOfThis(40) :
                                props.seatid===1 ? -(props.dominos.length*DominoSize.width)/2-68 :
                                props.seatid===2 ? centerYOfThis(40) :
                                (props.dominos.length*DominoSize.width)/2+112 ,
                    }}
                    onClick={onPassClick}
                >
                    PASS
                </button> : 
                null
            }
            
            {
                (props.timer.visibility) ? 
                <div>
                    <Timer  isRunning={props.timer.isRunning}
                            duration={props.timer.duration}
                            timePassed={props.timer.timePassed}
                            background='rgba(255, 255, 255, 0.75)'
                            onComplete={onTurnTimeout}/>
                </div> : 
                null
            }
        </Container>
    )
}

export default Player;