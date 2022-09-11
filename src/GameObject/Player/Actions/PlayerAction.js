import PlayerActionTypes from "./PlayerActionTypes"

export const DominoClickAction=(seatid, handIndex)=>{
    return {
        type:PlayerActionTypes.DOMINO_CLICK_ACTION,
        param:{
            seatid:seatid,
            handIndex:handIndex
        }
    }
}
export const PassAction=(seatid)=>{
    return {
        type:PlayerActionTypes.PASS_ACTION,
        param:{
            seatid:seatid,
        }
    }
}
export const DiscardAction=(seatid)=>{
    return {
        type:PlayerActionTypes.DISCARD_ACTION,
        param:{
            seatid:seatid
        }
    }
}
export const OnTimerComplete=(seatid)=>{
    return {
        type:PlayerActionTypes.ON_TIMER_COMPLETE,
        param:{
            seatid:seatid
        }
    }
}

export const OnRemoveDominoAnimationComplete=(seatid, handIndex, domino)=>{
    return {
        type:PlayerActionTypes.ON_REMOVE_DOMINO_ANIMATION_COMPLETE,
        param:{
            seatid:seatid,
            handIndex:handIndex,
            domino:domino
        }
    }
}