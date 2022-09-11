import React, {useEffect} from 'react'
import PropTypes from 'prop-types';
import { useSelector, useDispatch} from 'react-redux'
import styled from 'styled-components'

import {useInterval} from '../../Hooks/useInterval'
import * as UIActions from './Reducer/UIAction';
import GameMenuPanel from '../GameMenuPanel';
import GameResultPanel from '../GameResultPanel';
import Player from '../Player';
import {PlayerTemplate} from '../Player/PlayerTemplate'
import DominoTemplate from '../Domino/DominoTemplate'
import Pile from '../Pile'
import * as PileActions from '../Pile/Actions/PileAction'
import Timer from '../Timer'
import {GameState, GetPositionBySeatid} from '../../Global/Global';



const Container=styled.div`
    position: relative;
    width: ${props=>props.width}px;
    height: ${props=>props.height}px;
`

function UIManager(props){
    const state=useSelector(state=>{ return state });
    const dispatch=useDispatch();

    const DominoDeck=new Deck();
    const size={
        width:props.width,
        height:props.height
    };



    //#region COMPONENT_DID_MOUNT
    useEffect(() => {
        dispatch(UIActions.InitAction(size, { 
            x:centerXOfThis(800), 
            y:centerYOfThis(375)
        }, {
            width:800, 
            height:375
        }))
        // PlayerJoin("zul", 5, 0, true);
        // PlayerJoin("panzul", 5, 1, true);
        // PlayerJoin("zulaika", 5, 2, true);
        // PlayerJoin("zulastri", 5, 3, true);
    }, []);
    //#endregion
    useEffect(()=>{
        if(state.gameState===GameState.DrawCard){
            setTimeout(() => {
                DrawCard();
                UpdateGameState(GameState.Ready);
            }, 250);
        }
        else if(state.gameState===GameState.Ready){
            setTimeout(() => {
                ShowPlayerHand(true);
                UpdateGameState(GameState.PlayerTurn, 0);
            }, 1000);
        }
        else if(state.gameState===GameState.PlayerTurn){
            setTimeout(() => {
                PlayerTurn(state.currentTurnSeatid, 3);
            }, 1000);
        }
        else if(state.gameState===GameState.ActionDone){
            setTimeout(() => {
                UpdateGameState(GameState.ShowHand)
            }, 1000);
        }
        else if(state.gameState===GameState.ShowHand){
            setTimeout(() => {
                ShowPlayerHand()
                UpdateGameState(GameState.Discard)
            }, 1000);
        }
    }, [state.gameState])
    useEffect(()=>{
        if(state.gameState!==GameState.PlayerTurn)
            return;
        setTimeout(() => {
            PlayerTurn(state.currentTurnSeatid, 3);
        }, 1000);
    }, [state.currentTurnSeatid]);



    function StartGame(username, avatar){
        PlayerJoin(username, avatar, 0, true)
        PlayerJoin("zul", 5, 1, false)
        PlayerJoin("tarmizi", 6, 2, false)
        PlayerJoin("boy", 7, 3, false)
        UpdateGameState(GameState.Idle)
    }
    function UpdateGameState(newGameState, currentTurnSeatid=undefined){
        dispatch(UIActions.UpdateGameState(newGameState, currentTurnSeatid))
    }
    function OnGameStateDelay(){
        if(state.gameState===GameState.DrawCard){
            DrawCard()
            UpdateGameState(GameState.Ready)
        }
        else if(state.gameState===GameState.Ready){
            ShowPlayerHand(true)
            UpdateGameState(GameState.PlayerTurn, 0)
        }
        else if(state.gameState===GameState.PlayerTurn){
            PlayerTurn(state.currentTurnSeatid, 3)
        }
        else if(state.gameState===GameState.ActionDone){
            UpdateGameState(GameState.ShowHand)
        }
        else if(state.gameState===GameState.ShowHand){
            ShowPlayerHand()
            UpdateGameState(GameState.Discard)
        }
    }
    function GameStateDelay(){
        if(state.gameState===GameState.DrawCard)
            return 100
        if(state.gameState===GameState.Ready)
            return 1000
        if(state.gameState===GameState.PlayerTurn){
            let player = state.players.find(p=>p.seatid===state.currentTurnSeatid)
            if(player===undefined)
                return null
            if(!player.isOnTurn)
                return 1000
            
            return null
        }
        if(state.gameState===GameState.ActionDone)
            return 1000
        if(state.gameState===GameState.ShowHand)
            return 1000
        
        return null
    }



    function PlayerJoin(username, avatar, seatid, isLocal){
        let player = PlayerTemplate(username, avatar, seatid, GetPositionBySeatid(seatid), isLocal);
        dispatch(UIActions.PlayerJoinAction(player))
    }
    function PlayerHand(seatid, dominos){
        dispatch(UIActions.PlayerHandAction(seatid, dominos))
    }
    function ShowPlayerHand(localPlayer=false){
        if(localPlayer){
            let localPlayer=state.players.find(p=>p.isLocal)
            if(localPlayer===undefined)
                return
            dispatch(UIActions.ShowPlayerHandAction(localPlayer.seatid))
        }
        else{
            for(let player of state.players){
                dispatch(UIActions.ShowPlayerHandAction(player.seatid))
            }
        }
    }
    function PlayerTurn(seatid, duration){
        dispatch(UIActions.PlayerTurnAction(seatid, duration))
    }
    function Discard(){
        dispatch(UIActions.DiscardAction())
    }
    function AddDominoToPile(seatid, domino, pileSide){
        dispatch(PileActions.AddDominoAction(seatid, domino, pileSide))
    }
    function DrawCard(){
        try{
            DominoDeck.Shuffle()
            for(let player of state.players){
                let dominos=[]
                for(let x=0; x<7; x++){
                    let dominoValue=DominoDeck.Dequeue()
                    let domino=DominoTemplate(dominoValue[0], dominoValue[1]);
                    dominos.push(domino);
                }
                PlayerHand(player.seatid, dominos)
            }
        }
        catch(error){
            console.log(`[ERROR] ui_manager_draw_card: error_msg:${error.message}`)
        }
    }



    function onPlayClick(username, avatar){
        dispatch(UIActions.HideGameMenu())
        StartGame(username, avatar)
    }
    function onPlayAgainClick(){
        UpdateGameState(GameState.Idle)
    }
    function onCountdownDone(){
        UpdateGameState(GameState.DrawCard)
    }



    function IsLocalPlayerWin(){
        if(state.players.find(p=>p.dominos.length===0)!==undefined){
            if(state.players.find(p=>p.dominos.length===0).isLocal)
                return true
            else
                return false
        }

        let smallestHand=100
        let winner=undefined
        for(let player of state.players){
            if(winner===undefined){
                winner=player
                smallestHand=player.dominos.reduce((d1, d2)=>(d1.totalValue+d2.totalValue), 0)
                continue
            }

            const playerTotalHand=player.dominos.reduce((d1, d2)=>(d1.totalValue+d2.totalValue), 0)
            if(playerTotalHand<smallestHand){
                winner=player
                smallestHand=playerTotalHand
            }
            else if(playerTotalHand===smallestHand){
                if(player.dominos.length<winner.dominos.length)
                    winner=player
                else if(player.dominos.length===winner.dominos.length){
                    const winnerSmallestDomino=winner.dominos.reduce((d1, d2)=> d2.totalValue<d1.totalValue?d2.totalValue:d1.totalValue, winner.dominos[0].totalValue)
                    const playerSmallestDomino=player.dominos.reduce((d1, d2)=> d2.totalValue<d1.totalValue?d2.totalValue:d1.totalValue, player.dominos[0].totalValue)
                    if(playerSmallestDomino<winnerSmallestDomino)
                        winner=player
                }
            }
        }

        if(winner && winner.isLocal)
            return true
        
        return false
    }
    


    function centerXOfThis(contentWidth){ return (size.width/2-contentWidth/2); }
    function centerYOfThis(contentHeight){ return (size.height/2-contentHeight/2); }



    return (
        <Container width={props.width} height={props.height}>
            {/* ==================== PILE ==================== */}
            <Pile {...state.pile} />
            


            {/* ==================== TIMER ==================== */}
            {
                (state.timer.isVisible) ? 
                <Timer
                    isRunning={state.timer.isRunning}
                    duration={3}
                    timePassed={0}
                    position={{x:centerXOfThis(100), y:centerYOfThis(100)}}
                    size={{width:100, height:100}}
                    onComplete={onCountdownDone}
                /> : null
            }


                    
            {/* ==================== MENU ==================== */}
            <GameMenuPanel 
                size={{width:500, height:300}} 
                isVisible={state.gameMenu.isVisible} 
                onPlayClick={onPlayClick} 
            />



            {/* ================= GAME RESULT ================ */}
            {
                (state.gameState===GameState.Discard) ? 
                <GameResultPanel 
                    win={IsLocalPlayerWin()} 
                    onPlayAgainClick={onPlayAgainClick} 
                /> :
                null
            }

            

            {/* -------------------- PLAYERS -------------------- */}
            {
                state.players.map((player, index)=>{
                    return (
                        <Player key={index} {...player}/>
                    )
                })
            }
        </Container>
    )
}

UIManager.propTypes={
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
}

function Deck(){
    this.dominos = [  [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], 
                        [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], 
                        [2,2], [2,3], [2,4], [2,5], [2,6], 
                        [3,3], [3,4], [3,5], [3,6], 
                        [4,4], [4,5], [4,6], 
                        [5,5], [5,6], 
                        [6,6]   ]
    this.shuffledDomino=[]

    this.Shuffle=function(){
        this.shuffledDomino=[...this.dominos]

        for(let x=this.shuffledDomino.length-1; x>0; x--){
            let currentDomino = this.shuffledDomino[x];
            let otherDomino = RandomInteger(0, x);

            this.shuffledDomino[x] = this.shuffledDomino[otherDomino];
            this.shuffledDomino[otherDomino] = currentDomino;
        }
    }

    this.Dequeue=function(){
        if(this.shuffledDomino.length===0)
            this.Shuffle()

        return this.shuffledDomino.pop()
    }
}

function RandomInteger(min, max){
    let minNum = Math.ceil(min);
    let maxNum = Math.floor(max);
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
}

export default UIManager;  