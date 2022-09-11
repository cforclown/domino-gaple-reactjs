import { GameState } from "../../../Global/Global";
import UIActionTypes from "./UIActionTypes";
import PlayerActionTypes from "../../Player/Actions/PlayerActionTypes";
import PileActionTypes from "../../Pile/Actions/PileActionTypes";
import {PileSide, PileVector, DominoSize} from '../../Pile'
import DominoTemplate from "../../Domino/DominoTemplate";
import {Actions} from '../../Player/PlayerTemplate'



const initialState={
    size:{ width:0, height:0},
    players:[],
    gameState:GameState.Waiting,
    currentTurnSeatid:undefined,
    timer:{
        isRunning:false,
        isVisible:false,
    },
    gameMenu:{
        isVisible:true,
    },
    pile:{
        size:{ width:0, height:0},
        position:{ x:0, y:0},
        dominos:[],
        headDomino:undefined,
        headValue:undefined,
        tailDomino:undefined,
        tailValue:undefined,

        animation:{
            isRunning:false,
            delay:10,
            insertDomino:undefined, // {seatid, domino, endPosition, transform}
        },
    }
}


const UIReducer=(state=initialState, action)=>{
    switch(action.type){
        //#region UI_ACTIONS
        case UIActionTypes.INIT_UI_ACTION:
            return InitEvent(state, action)
        case UIActionTypes.HIDE_GAME_MENU:
            return HideGameMenu(state, action)
        case UIActionTypes.UPDATE_GAME_STATE_ACTION:
            return UpdateGameStateEvent(state, action)
        case UIActionTypes.PLAYER_JOIN_ACTION:
            return PlayerJoinEvent(state, action);
        case UIActionTypes.PLAYER_HAND_ACTION:
            return PlayerHandEvent(state, action);
        case UIActionTypes.SHOW_HAND_ACTION:
            return ShowHandEvent(state, action);
        case UIActionTypes.PLAYER_TURN_ACTION:
            return PlayerTurnEvent(state, action);
        case UIActionTypes.HIDE_ALL_PLAYER_TIMER_ACTION:
            return HideAllPlayerTimerEvent(state, action);
        case UIActionTypes.DISCARD_ACTION:
            return PlayerDiscardEvent(state, action);
        //#endregion

        //#region PLAYER_ACTIONS
        case PlayerActionTypes.DOMINO_CLICK_ACTION:
            return DominoClickEvent(state, action)
        case PlayerActionTypes.DOMINO_ACTION:
            return AddDominoToPileEvent(state, action)
        case PlayerActionTypes.PASS_ACTION:
            return PlayerPassEvent(state, action)
        case PlayerActionTypes.ON_REMOVE_DOMINO_ANIMATION_COMPLETE:
            return OnRemoveDominoAnimationComplete(state, action)
        case PlayerActionTypes.DISCARD_ACTION:
            return DiscardHandEvent(state, action)
        case PlayerActionTypes.ON_TIMER_COMPLETE:
            return TimerCompleteEvent(state, action)
        //#endregion

        
        //#region PILE_ACTIONS
        case PileActionTypes.ADD_DOMINO_ACTION:
            return AddDominoToPileEvent(state, action)
        case PileActionTypes.LOCAL_PLAYER_ACTION:
            return AddDominoToPileEvent(state, action)
        case PileActionTypes.RESET_ACTION:
            return state    // TODO reset pile
        case PileActionTypes.ON_INSERT_DOMINO_ANIMATION_COMPLETE:
            return OnInsertDominoAnimationComplete(state, action)
        //#endregion

        default: 
            return state;
    }
}


//#region UI_EVENT
const InitEvent=(prevState, action)=>{
    const newState=JSON.parse(JSON.stringify(prevState));

    let pile=newState.pile
    pile.position=action.param.pilePosition
    pile.size=action.param.pileSize
    
    return {
        ...prevState,
        size:action.param.uiSize,
        pile:pile,
    }
    
}
const HideGameMenu=(prevState, action)=>{
    const newState=JSON.parse(JSON.stringify(prevState));
    newState.gameMenu.isVisible=false

    return {
        ...prevState,
        gameMenu:newState.gameMenu,
    }
}
const UpdateGameStateEvent=(prevState, action)=>{
    // console.log(`update_game_state: game_state:${action.param.gameState}`)

    const newState=JSON.parse(JSON.stringify(prevState));

    switch(action.param.gameState){
        case GameState.Waiting:
            break;
        case GameState.Idle:
            for(let player of newState.players){
                player.dominos=[]
                player.isOnTurn=false
                player.lastAction=undefined
            }
            newState.gameState=action.param.gameState
            newState.timer={
                isRunning:true,
                isVisible:true,
            }
            newState.pile.dominos=[]
            newState.pile.headDomino=undefined
            newState.pile.headValue=undefined
            newState.pile.tailDomino=undefined
            newState.pile.tailValue=undefined
            newState.pile.animation={
                isRunning:false,
                delay:10,
                insertDomino:undefined,
            }
            break;
        case GameState.DrawCard:
            newState.gameState=action.param.gameState
            newState.timer={
                isRunning:false,
                isVisible:false,
            }
            break;
        case GameState.Ready:
            newState.gameState=action.param.gameState
            break;
        case GameState.PlayerTurn:
            newState.gameState=action.param.gameState
            newState.currentTurnSeatid=action.param.currentTurnSeatid
            break;
        case GameState.ActionDone:
            newState.gameState=action.param.gameState
            break;
        case GameState.ShowHand:
            newState.gameState=action.param.gameState
            break;
        case GameState.Discard:
            for(let player of newState.players)
                player.lastAction=undefined
            newState.gameState=action.param.gameState
            break;
        default:
            break;
    }

    return {
        ...prevState,
        players:newState.players,
        gameState:newState.gameState,
        currentTurnSeatid:newState.currentTurnSeatid,
        timer:newState.timer,
        pile:newState.pile,
    }
}
const PlayerJoinEvent=(prevState, action)=>{
   // console.log(`PLAYER-JOIN: username:${action.param.player.username} seatid:${action.param.player.seatid}`);

    if(prevState.players.find(p=>p.seatid===action.param.player.seatid)!==undefined){
        console.log("[ERROR] seat_is_taken");
        return prevState;
    }

    const newState=JSON.parse(JSON.stringify(prevState));
    if(newState.players.length>=4){
        console.log("[ERROR] no_seat_available");
        return prevState;
    }
    
    newState.players.push(action.param.player)
    
    return {
        ...prevState,
        players:newState.players,
    }
}
const PlayerHandEvent=(prevState, action)=>{
   // console.log(`on_player_hand`);

    const newState=JSON.parse(JSON.stringify(prevState));

    let currentPlayer=newState.players.find(p=>p.seatid===action.param.seatid)
    if(currentPlayer===undefined){
        console.log('[ERROR] on_player_hand: player_not_found');
        return prevState;
    }

    currentPlayer.dominos=action.param.dominos
    
    return {
        ...prevState,
        players:newState.players,
    }
}
const ShowHandEvent=(prevState, action)=>{
   // console.log(`on_faceup_hand: seatid:${action.param.seatid}`);

    const newState=JSON.parse(JSON.stringify(prevState));

    let currentPlayer=newState.players.find(p=>p.seatid===action.param.seatid)
    if(currentPlayer===undefined){
        console.log('[ERROR] faceup_hand: player_not_found');
        return prevState;
    }

    let currentPlayerDominos=currentPlayer.dominos;
    for(let domino of currentPlayerDominos)
        domino.isFaceup=true
    
    return {
        ...prevState,
        players:newState.players
    }
}
const PlayerTurnEvent=(prevState, action)=>{
   // console.log(`on_player_turn: seatid:${action.param.seatid} duration:${action.param.duration}`);

    const newState=JSON.parse(JSON.stringify(prevState));

    let currentPlayer = newState.players.find(p=>p.seatid===action.param.seatid)
    if(currentPlayer===undefined){
        console.log(`[ERROR] player_turn_event: player_not_found: seatid:${action.param.seatid}`);
        return prevState
    }

    if(currentPlayer.isLocal){
        // TODO set selectable domino 
    }

    currentPlayer.isOnTurn=true
    currentPlayer.timer.visibility=true
    currentPlayer.timer.isRunning=true
    currentPlayer.timer.duration=action.param.duration
    
    return {
        ...prevState,
        players:newState.players,
    }
}
const HideAllPlayerTimerEvent=(prevState, action)=>{
   // console.log(`on_discard_event`);

    const newState=JSON.parse(JSON.stringify(prevState));

    for(let player of newState.players){
        player.timer.visibility=false
        player.timer.isRunning=false
        player.timer.timePassed=0
    }
    
    return {
        ...prevState,
        players:newState.players,
    }
}
const PlayerDiscardEvent=(prevState, action)=>{
   // console.log(`on_discard_event`);

    const newState=JSON.parse(JSON.stringify(prevState));

    for(let player of newState.players){
        player.dominos=[]
    }
    
    return {
        ...prevState,
        players:newState.players,
    }
}
//#endregion



//#region PLAYER_EVENT
const DominoClickEvent=(prevState, action)=>{
   // console.log(`on_domino_click: hand_index: ${action.param.handIndex}`)

    const newState=JSON.parse(JSON.stringify(prevState));

    let currentPlayer=newState.players.find(p=>p.seatid===action.param.seatid)
    if(currentPlayer===undefined){
        console.log('[ERROR] on_domino_click: player_not_found')
        return prevState
    }
    if(!currentPlayer.isLocal)
        return prevState
    
    let selectedDomino=currentPlayer.dominos[action.param.handIndex]
    if(selectedDomino===undefined)
        return prevState

    if(!selectedDomino.selectable)
        return prevState

    newState.pile.dominos=newState.pile.dominos.filter(d=>!d.isPileClue)
    
    if(selectedDomino.isSelected){
        selectedDomino.isSelected=false
    }
    else{
        for(let domino of currentPlayer.dominos)
            domino.isSelected=false
        selectedDomino.isSelected=true
        
        for(let dominoClue of GetDominoClue(newState.pile, selectedDomino)){
            newState.pile.dominos.push(dominoClue)
        }
    }
    
    return {
        ...prevState,
        players:newState.players,
        pile:newState.pile,
    }
}
const PlayerPassEvent=(prevState, action)=>{
   // console.log(`on_player_pass: seatid: ${action.param.seatid}`)

    const newState=JSON.parse(JSON.stringify(prevState));

    let currentPlayer=newState.players.find(p=>p.seatid===action.param.seatid)
    if(currentPlayer===undefined){
        console.log(`[ERROR] player_pass_not_found`)
        return prevState
    }

    currentPlayer.lastAction=Actions.PASS
    currentPlayer.isOnTurn=false
    currentPlayer.timer.visibility=false

    if(newState.players.filter(p=>p.lastAction===Actions.PASS).length===newState.players.length)
        newState.gameState=GameState.ActionDone

    newState.currentTurnSeatid++
    if(newState.currentTurnSeatid>3)
        newState.currentTurnSeatid=0
    
    return {
        ...prevState,
        gameState:newState.gameState,
        currentTurnSeatid:newState.currentTurnSeatid,
        players:newState.players,
        pile:newState.pile,
    }
}
const DiscardHandEvent=(prevState, action)=>{
   // console.log(`on_domino_click: seatid: ${action.param.seatid}`)
}
const TimerCompleteEvent=(prevState, action)=>{
   // console.log(`on_player_timer_complete: seatid: ${action.param.seatid}`)

    const newState=JSON.parse(JSON.stringify(prevState));

    let currentPlayer=newState.players.find(p=>p.seatid===action.param.seatid)
    if(currentPlayer===undefined){
        console.log('[ERROR] on_player_timer_complete: player_not_found')
        return prevState
    }
    
    currentPlayer.timer.isRunning=false
    
    return {
        ...prevState,
        players:newState.players,
    }
}

//#region ANIMATION
const OnRemoveDominoAnimationComplete=(prevState, action)=>{
    //console.log(`on_remove_domino_animation_complete: domino:[${action.param.domino.value[0]}, ${action.param.domino.value[1]}] hand_index:${action.param.handIndex}`)

    if(action.param.seatid===undefined){
        console.log('[ERROR] seatid==undefined')
        return prevState
    }

    const newState=JSON.parse(JSON.stringify(prevState));

    let player=newState.players.find(p=>p.seatid===action.param.seatid)
    if(player===undefined){
        console.log('[ERROR] player_action_not_found')
        return prevState
    }

    if(action.param.handIndex===undefined){
        console.log('[ERROR] hand_index_not_found')
        return prevState
    }
    //player.dominos.splice(action.param.handIndex, 1)

    player.animation.removeDomino=undefined

    return {
        ...prevState,
        players:newState.players,
    }
}
//#endregion

//#endregion



//#region PILE_EVENT
const AddDominoToPileEvent=(prevState, action)=>{
    // console.log(`on_add_domino_to_pile: domino:[${action.param.domino.value[0]}, ${action.param.domino.value[1]}] side:${action.param.pileSide}`)

    const newState=JSON.parse(JSON.stringify(prevState));

    // ---------------------------------------------------------check player-------------------------------------------------------------------
    let player=undefined
    if(action.param.seatid===undefined) player=newState.players.find(p=>p.isLocal)
    else                                player=newState.players.find(p=>p.seatid===action.param.seatid)
    if(player===undefined){
        console.log('[ERROR] player_action_not_found')
        return prevState
    }
    // ----------------------------------------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------remove domino in hand--------------------------------------------------------------
    let handIndex=undefined
    if(player.isLocal){
        handIndex=player.dominos.findIndex(d=>d.value[0]===action.param.domino.value[0] && d.value[1]===action.param.domino.value[1])
    }
    else{
        if(player.dominos.filter(d=>d.value===undefined).length===player.dominos.length)
            handIndex=player.dominos.length-1
        else
            handIndex=player.dominos.findIndex(d=>d.value[0]===action.param.domino.value[0] && d.value[1]===action.param.domino.value[1])
    }
    player.animation.removeDomino={
        seatid:player.seatid,
        handIndex:handIndex,
        domino:player.dominos[handIndex],
    }
    player.dominos=player.dominos.filter(d=>d.value[0]!==action.param.domino.value[0] || d.value[1]!==action.param.domino.value[1])
    player.timer.visibility=false
    player.lastAction=Actions.ACTION
    // ----------------------------------------------------------------------------------------------------------------------------------------

    let pile=newState.pile
    pile.dominos=newState.pile.dominos.filter(d=>!d.isPileClue)

    let dominoPosition={
        x:CenterXOfParent(pile.size.width, DominoSize.width),
        y:CenterYOfParent(pile.size.height, DominoSize.height)
    }
    let dominoTransform=(action.param.domino.isBalak)?0:270
    let dominoVector=(action.param.pileSide===PileSide.HEAD)?PileVector.LEFT:PileVector.RIGHT

    if(pile.dominos.length>0){
        if(action.param.pileSide===PileSide.HEAD){
            dominoVector=pile.headDomino.pileVector
            if(pile.headDomino.pileVector===PileVector.LEFT){
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=90
                else                                                dominoTransform=270

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.headDomino.position.x-(2*DominoSize.height/3),
                            y:pile.headDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x-DominoSize.height,
                            y:pile.headDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.headDomino.position.x-(3*DominoSize.width/2),
                        y:pile.headDomino.position.y
                    }
                }
            }
            else if(pile.headDomino.pileVector===PileVector.UP){
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=180
                else                                                dominoTransform=0

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    dominoPosition={
                        x:pile.headDomino.position.x,
                        y:pile.headDomino.position.y-(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y-(2*DominoSize.height/3),
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y-DominoSize.height
                        }
                    }
                }
            }
            else if(pile.headDomino.pileVector===PileVector.RIGHT){
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=270
                else                                                dominoTransform=90

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.headDomino.position.x+(2*DominoSize.height/3),
                            y:pile.headDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x+DominoSize.height,
                            y:pile.headDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.headDomino.position.x+(3*DominoSize.width/2),
                        y:pile.headDomino.position.y
                    }
                }
            }
            else{ //DOWN
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=0
                else                                                dominoTransform=180

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    dominoPosition={
                        x:pile.headDomino.position.x,
                        y:pile.headDomino.position.y+(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y+(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y+DominoSize.height
                        }
                    }
                }
            }
        }
        else{   // TAIL
            dominoVector=pile.tailDomino.pileVector
            if(pile.tailDomino.pileVector===PileVector.LEFT){
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=90
                else                                                dominoTransform=270

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.tailDomino.position.x-(2*DominoSize.height/3),
                            y:pile.tailDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x-DominoSize.height,
                            y:pile.tailDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.tailDomino.position.x-(3*DominoSize.width/2),
                        y:pile.tailDomino.position.y
                    }
                }
            }
            else if(pile.tailDomino.pileVector===PileVector.UP){
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=180
                else                                                dominoTransform=0

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    dominoPosition={
                        x:pile.tailDomino.position.x,
                        y:pile.tailDomino.position.y-(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y-(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y-DominoSize.height
                        }
                    }
                }
            }
            else if(pile.tailDomino.pileVector===PileVector.RIGHT){
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=270
                else                                                dominoTransform=90

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.tailDomino.position.x+(2*DominoSize.height/3),
                            y:pile.tailDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x+DominoSize.height,
                            y:pile.tailDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.tailDomino.position.x+(3*DominoSize.width/2),
                        y:pile.tailDomino.position.y
                    }
                }
            }
            else{ //DOWN
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=0
                else                                                dominoTransform=180

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    dominoPosition={
                        x:pile.tailDomino.position.x,
                        y:pile.tailDomino.position.y+(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y+(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y+DominoSize.height
                        }
                    }
                }
            }
        }

        if(dominoPosition.x<=(0+60) && dominoVector===PileVector.LEFT)
            dominoVector=PileVector.UP
        if(dominoPosition.x>=(pile.size.width-80) && dominoVector===PileVector.RIGHT)
            dominoVector=PileVector.DOWN
        if(dominoPosition.y<=(0+20) && dominoVector===PileVector.UP)
            dominoVector=PileVector.RIGHT
        if(dominoPosition.y>=(pile.size.height-80) && dominoVector===PileVector.DOWN)
            dominoVector=PileVector.LEFT
    }

    action.param.domino.pileSide=action.param.pileSide
    action.param.domino.isFaceup=true
    action.param.domino.size=DominoSize
    action.param.domino.position=dominoPosition
    action.param.domino.transform=dominoTransform
    action.param.domino.pileVector=dominoVector

    pile.animation={
        isRunning:true,
        delay:10,
        insertDomino:{
            seatid:player.seatid,
            domino:action.param.domino,
            endPosition:dominoPosition,
            transform:dominoTransform,
        }, // {seatid, domino, endPosition, transform}
    }

    

    for(let p of newState.players)
        p.isOnTurn=false

    return {
        ...prevState,
        players:newState.players,
        pile:pile,
    }
}
const ResetPileEvent=(prevState, action)=>{
    // console.log(`on_reset_pile`)

    const newState=JSON.parse(JSON.stringify(prevState));

    let pile=newState.pile
    pile.dominos=[]
    pile.headDomino=undefined
    pile.headValue=undefined
    pile.tailDomino=undefined
    pile.tailValue=undefined
    
    return {
        ...prevState,
        pile:pile,
    }
}

//#region ANIMATION
const OnInsertDominoAnimationComplete=(prevState, action)=>{
    //console.log(`on_insert_domino_animation_complete: domino:[${action.param.domino.value[0]}, ${action.param.domino.value[1]}] side:${action.param.domino.pileSide}`)

    if(action.param.seatid===undefined){
        console.log('[ERROR] seatid==undefined')
        return prevState
    }
    if(action.param.domino===undefined){
        console.log('[ERROR] domino==undefined')
        return prevState
    }

    const newState=JSON.parse(JSON.stringify(prevState));

    let currentPlayer=newState.players.find(p=>p.seatid===action.param.seatid)
    if(currentPlayer===undefined){
        console.log('[ERROR] player_not_found')
        return prevState
    }

    let pile=newState.pile
    pile.dominos=newState.pile.dominos.filter(d=>!d.isPileClue)

    let dominoPosition={
        x:CenterXOfParent(pile.size.width, DominoSize.width),
        y:CenterYOfParent(pile.size.height, DominoSize.height)
    }
    let dominoTransform=(action.param.domino.isBalak)?0:270
    let dominoVector=(action.param.domino.pileSide===PileSide.HEAD)?PileVector.LEFT:PileVector.RIGHT

    if(pile.dominos.length>0){
        if(action.param.domino.pileSide===PileSide.HEAD){
            dominoVector=pile.headDomino.pileVector
            if(pile.headDomino.pileVector==PileVector.LEFT){
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=90
                else                                                dominoTransform=270

                if(pile.headDomino.transform==90 || pile.headDomino.transform==270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.headDomino.position.x-(2*DominoSize.height/3),
                            y:pile.headDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x-DominoSize.height,
                            y:pile.headDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.headDomino.position.x-(3*DominoSize.width/2),
                        y:pile.headDomino.position.y
                    }
                }
            }
            else if(pile.headDomino.pileVector==PileVector.UP){
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=180
                else                                                dominoTransform=0

                if(pile.headDomino.transform==90 || pile.headDomino.transform==270){
                    dominoPosition={
                        x:pile.headDomino.position.x,
                        y:pile.headDomino.position.y-(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y-(2*DominoSize.height/3),
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y-DominoSize.height
                        }
                    }
                }
            }
            else if(pile.headDomino.pileVector==PileVector.RIGHT){
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=270
                else                                                dominoTransform=90

                if(pile.headDomino.transform==90 || pile.headDomino.transform==270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.headDomino.position.x+(2*DominoSize.height/3),
                            y:pile.headDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x+DominoSize.height,
                            y:pile.headDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.headDomino.position.x+(3*DominoSize.width/2),
                        y:pile.headDomino.position.y
                    }
                }
            }
            else{ //DOWN
                if(pile.headValue===action.param.domino.value[0])   dominoTransform=0
                else                                                dominoTransform=180

                if(pile.headDomino.transform==90 || pile.headDomino.transform==270){
                    dominoPosition={
                        x:pile.headDomino.position.x,
                        y:pile.headDomino.position.y+(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y+(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y+DominoSize.height
                        }
                    }
                }
            }
        }
        else{   // TAIL
            dominoVector=pile.tailDomino.pileVector
            if(pile.tailDomino.pileVector==PileVector.LEFT){
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=90
                else                                                dominoTransform=270

                if(pile.tailDomino.transform==90 || pile.tailDomino.transform==270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.tailDomino.position.x-(2*DominoSize.height/3),
                            y:pile.tailDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x-DominoSize.height,
                            y:pile.tailDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.tailDomino.position.x-(3*DominoSize.width/2),
                        y:pile.tailDomino.position.y
                    }
                }
            }
            else if(pile.tailDomino.pileVector==PileVector.UP){
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=180
                else                                                dominoTransform=0

                if(pile.tailDomino.transform==90 || pile.tailDomino.transform==270){
                    dominoPosition={
                        x:pile.tailDomino.position.x,
                        y:pile.tailDomino.position.y-(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y-(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y-DominoSize.height
                        }
                    }
                }
            }
            else if(pile.tailDomino.pileVector==PileVector.RIGHT){
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=270
                else                                                dominoTransform=90

                if(pile.tailDomino.transform==90 || pile.tailDomino.transform==270){
                    if(action.param.domino.isBalak){
                        dominoTransform=0
                        dominoPosition={
                            x:pile.tailDomino.position.x+(2*DominoSize.height/3),
                            y:pile.tailDomino.position.y
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x+DominoSize.height,
                            y:pile.tailDomino.position.y
                        }
                    }
                }
                else{
                    dominoPosition={
                        x:pile.tailDomino.position.x+(3*DominoSize.width/2),
                        y:pile.tailDomino.position.y
                    }
                }
            }
            else{ //DOWN
                if(pile.tailValue===action.param.domino.value[0])   dominoTransform=0
                else                                                dominoTransform=180

                if(pile.tailDomino.transform==90 || pile.tailDomino.transform==270){
                    dominoPosition={
                        x:pile.tailDomino.position.x,
                        y:pile.tailDomino.position.y+(3*DominoSize.width/2)
                    }
                }
                else{
                    if(action.param.domino.isBalak){
                        dominoTransform=90
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y+(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoPosition={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y+DominoSize.height
                        }
                    }
                }
            }
        }

        if(dominoPosition.x<=(0+60) && dominoVector===PileVector.LEFT)
            dominoVector=PileVector.UP
        if(dominoPosition.x>=(pile.size.width-80) && dominoVector===PileVector.RIGHT)
            dominoVector=PileVector.DOWN
        if(dominoPosition.y<=(0+20) && dominoVector===PileVector.UP)
            dominoVector=PileVector.RIGHT
        if(dominoPosition.y>=(pile.size.height-80) && dominoVector===PileVector.DOWN)
            dominoVector=PileVector.LEFT
    }

    action.param.domino.isFaceup=true
    action.param.domino.size=DominoSize
    action.param.domino.position=dominoPosition
    action.param.domino.transform=dominoTransform
    action.param.domino.pileVector=dominoVector

    pile.dominos.push(action.param.domino)
    
    if(pile.dominos.length===1){
        const headDomino={ ...action.param.domino };
        headDomino.pileVector=PileVector.LEFT
        pile.headDomino=headDomino
        pile.headValue=headDomino.value[0]
        
        const tailDomino={ ...action.param.domino };
        tailDomino.pileVector=PileVector.RIGHT
        pile.tailDomino=tailDomino
        pile.tailValue=tailDomino.value[1]
    }
    else if(action.param.domino.pileSide===PileSide.HEAD){
        if(pile.headValue===action.param.domino.value[0])
            pile.headValue=action.param.domino.value[1]
        else
            pile.headValue=action.param.domino.value[0]
        pile.headDomino=action.param.domino
    }
    else{
        if(pile.tailValue===action.param.domino.value[0])
            pile.tailValue=action.param.domino.value[1]
        else
            pile.tailValue=action.param.domino.value[0]
        pile.tailDomino=action.param.domino
    }

    pile.animation.isRunning=false
    pile.animation.insertdomino=undefined

    // update selectable domino local player
    let localPlayer=newState.players.find(p=>p.isLocal)
    for(let domino of localPlayer.dominos){
        if(domino.value[0]===pile.headValue || domino.value[1]===pile.headValue)
            domino.selectable=true
        else if(domino.value[0]===pile.tailValue || domino.value[1]===pile.tailValue)
            domino.selectable=true
        else
            domino.selectable=false
    }

    
    // -------------------SET NEXT TURN------------------
    if(currentPlayer.dominos.length===0){
        newState.gameState=GameState.ActionDone
    }
    else{
        newState.currentTurnSeatid++
        if(newState.currentTurnSeatid>3)
            newState.currentTurnSeatid=0
    }
    // --------------------------------------------------

    return {
        ...prevState,
        players:newState.players,
        currentTurnSeatid:newState.currentTurnSeatid,
        gameState:newState.gameState,
        pile:pile,
    }
}
//#endregion

//#endregion



//#region HELPER_FUNCTION
function CenterXOfParent(parentWidth, contentWidth){
    return (parentWidth/2-contentWidth/2);
}
function CenterYOfParent(parentHeight, contentHeight){
    return (parentHeight/2-contentHeight/2);
}

function GetDominoClue(pile, selectedDomino){
    let clues=[]

    if(pile.dominos.length===0){
        let dominoClue=DominoTemplate(selectedDomino.value[0], selectedDomino.value[1])
        dominoClue.isPileClue=true
        dominoClue.isFaceup=true
        dominoClue.size=DominoSize
        dominoClue.position={
            x:CenterXOfParent(pile.size.width, DominoSize.width),
            y:CenterYOfParent(pile.size.height, DominoSize.height)
        }
        dominoClue.transform=(selectedDomino.isBalak)?0:270

        clues.push(dominoClue)
    }
    else{
        if(selectedDomino.value[0]===pile.headValue || selectedDomino.value[1]===pile.headValue){
            let dominoClue=DominoTemplate(selectedDomino.value[0], selectedDomino.value[1])
            dominoClue.isPileClue=true
            dominoClue.isFaceup=true
            dominoClue.size=DominoSize
            dominoClue.pileSide=PileSide.HEAD
            dominoClue.pileVector=pile.headDomino.pileVector
            if(pile.headDomino.pileVector===PileVector.LEFT){
                if(pile.headValue===dominoClue.value[0])    dominoClue.transform=90
                else                                        dominoClue.transform=270

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    if(dominoClue.isBalak){
                        dominoClue.transform=0
                        dominoClue.position={
                            x:pile.headDomino.position.x-(2*DominoSize.height/3),
                            y:pile.headDomino.position.y
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.headDomino.position.x-DominoSize.height,
                            y:pile.headDomino.position.y
                        }
                    }
                }
                else{
                    dominoClue.position={
                        x:pile.headDomino.position.x-(3*DominoSize.width/2),
                        y:pile.headDomino.position.y
                    }
                }
            }
            else if(pile.headDomino.pileVector===PileVector.UP){
                if(pile.headValue===dominoClue.value[0])    dominoClue.transform=180
                else                                        dominoClue.transform=0

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    dominoClue.position={
                        x:pile.headDomino.position.x,
                        y:pile.headDomino.position.y-(3*DominoSize.width/2)
                    }
                }
                else{
                    if(dominoClue.isBalak){
                        dominoClue.transform=90
                        dominoClue.position={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y-(2*DominoSize.height/3),
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y-DominoSize.height
                        }
                    }
                }
            }
            else if(pile.headDomino.pileVector===PileVector.RIGHT){
                if(pile.headValue===dominoClue.value[0])    dominoClue.transform=270
                else                                        dominoClue.transform=90

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    if(dominoClue.isBalak){
                        dominoClue.transform=0
                        dominoClue.position={
                            x:pile.headDomino.position.x+(2*DominoSize.height/3),
                            y:pile.headDomino.position.y
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.headDomino.position.x+DominoSize.height,
                            y:pile.headDomino.position.y
                        }
                    }
                }
                else{
                    dominoClue.position={
                        x:pile.headDomino.position.x+(3*DominoSize.width/2),
                        y:pile.headDomino.position.y
                    }
                }
            }
            else{ //DOWN
                if(pile.headValue===dominoClue.value[0])   dominoClue.transform=0
                else                                                dominoClue.transform=180

                if(pile.headDomino.transform===90 || pile.headDomino.transform===270){
                    dominoClue.position={
                        x:pile.headDomino.position.x,
                        y:pile.headDomino.position.y+(3*DominoSize.width/2)
                    }
                }
                else{
                    if(dominoClue.isBalak){
                        dominoClue.transform=90
                        dominoClue.position={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y+(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.headDomino.position.x,
                            y:pile.headDomino.position.y+DominoSize.height
                        }
                    }
                }
            }

            clues.push(dominoClue)
        }
        if(selectedDomino.value[0]===pile.tailValue || selectedDomino.value[1]===pile.tailValue){
            let dominoClue=DominoTemplate(selectedDomino.value[0], selectedDomino.value[1])
            dominoClue.isPileClue=true
            dominoClue.isFaceup=true
            dominoClue.size=DominoSize
            dominoClue.pileSide=PileSide.TAIL
            dominoClue.pileVector=pile.headDomino.pileVector
            if(pile.tailDomino.pileVector===PileVector.LEFT){
                if(pile.tailValue===dominoClue.value[0])    dominoClue.transform=90
                else                                        dominoClue.transform=270

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    if(dominoClue.isBalak){
                        dominoClue.transform=0
                        dominoClue.position={
                            x:pile.tailDomino.position.x-(2*DominoSize.height/3),
                            y:pile.tailDomino.position.y
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.tailDomino.position.x-DominoSize.height,
                            y:pile.tailDomino.position.y
                        }
                    }
                }
                else{
                    dominoClue.position={
                        x:pile.tailDomino.position.x-(3*DominoSize.width/2),
                        y:pile.tailDomino.position.y
                    }
                }
            }
            else if(pile.tailDomino.pileVector===PileVector.UP){
                if(pile.tailValue===dominoClue.value[0])    dominoClue.transform=180
                else                                        dominoClue.transform=0

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    dominoClue.position={
                        x:pile.tailDomino.position.x,
                        y:pile.tailDomino.position.y-(3*DominoSize.width/2)
                    }
                }
                else{
                    if(dominoClue.isBalak){
                        dominoClue.transform=90
                        dominoClue.position={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y-(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y-DominoSize.height
                        }
                    }
                }
            }
            else if(pile.tailDomino.pileVector===PileVector.RIGHT){
                if(pile.tailValue===dominoClue.value[0])    dominoClue.transform=270
                else                                        dominoClue.transform=90

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    if(dominoClue.isBalak){
                        dominoClue.transform=0
                        dominoClue.position={
                            x:pile.tailDomino.position.x+(2*DominoSize.height/3),
                            y:pile.tailDomino.position.y
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.tailDomino.position.x+DominoSize.height,
                            y:pile.tailDomino.position.y
                        }
                    }
                }
                else{
                    dominoClue.position={
                        x:pile.tailDomino.position.x+(3*DominoSize.width/2),
                        y:pile.tailDomino.position.y
                    }
                }
            }
            else{ //DOWN
                if(pile.tailValue===dominoClue.value[0])    dominoClue.transform=0
                else                                        dominoClue.transform=180

                if(pile.tailDomino.transform===90 || pile.tailDomino.transform===270){
                    dominoClue.position={
                        x:pile.tailDomino.position.x,
                        y:pile.tailDomino.position.y+(3*DominoSize.width/2)
                    }
                }
                else{
                    if(dominoClue.isBalak){
                        dominoClue.transform=90
                        dominoClue.position={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y+(2*DominoSize.height/3)
                        }
                    }
                    else{
                        dominoClue.position={
                            x:pile.tailDomino.position.x,
                            y:pile.tailDomino.position.y+DominoSize.height
                        }
                    }
                }
            }

            clues.push(dominoClue)
        }
    }

    return clues
}
//#endregion


export default UIReducer;