import UIActionTypes from './UIActionTypes'

export const InitAction=(uiSize, pilePosition, pileSize)=>{
    return {
        type:UIActionTypes.INIT_UI_ACTION,
        param:{
            uiSize:uiSize,
            pilePosition:pilePosition,
            pileSize:pileSize
        }
    }
}
export const HideGameMenu=()=>{
    return {
        type:UIActionTypes.HIDE_GAME_MENU,
        param:null
    }
}
export const UpdateGameState=(gameState, currentTurnSeatid=undefined)=>{
    return {
        type:UIActionTypes.UPDATE_GAME_STATE_ACTION,
        param:{
            gameState:gameState,
            currentTurnSeatid:currentTurnSeatid,
        }
    }
}
export const PlayerJoinAction=(player)=>{
    return {
        type:UIActionTypes.PLAYER_JOIN_ACTION,
        param:{
            player:player
        },
    }
}
export const PlayerHandAction=(seatid, dominos)=>{
    return {
        type:UIActionTypes.PLAYER_HAND_ACTION,
        param:{
            seatid:seatid,
            dominos:dominos,
        },
    }
}
export const ShowPlayerHandAction=(seatid)=>{
    return {
        type:UIActionTypes.SHOW_HAND_ACTION,
        param:{
            seatid:seatid
        },
    }
}
export const PlayerTurnAction=(seatid, duration)=>{
    return {
        type:UIActionTypes.PLAYER_TURN_ACTION,
        param:{
            seatid:seatid,
            duration:duration
        },
    }
}
export const HideAllPlayerTimer=()=>{
    return {
        type:UIActionTypes.HIDE_ALL_PLAYER_TIMER_ACTION,
        param:null
    }
}
export const DiscardAction=()=>{
    return {
        type:UIActionTypes.DISCARD_ACTION,
        param:null,
    }
}