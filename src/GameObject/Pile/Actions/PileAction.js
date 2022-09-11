import PileActionTypes from "./PileActionTypes"

export const AddDominoAction=(seatid, domino, pileSide)=>{
    return {
        type:PileActionTypes.ADD_DOMINO_ACTION,
        param:{
            seatid:seatid,
            domino:domino,
            pileSide:pileSide,
        }
    }
}

export const LocalPlayerAction=(domino, pileSide)=>{
    return {
        type:PileActionTypes.LOCAL_PLAYER_ACTION,
        param:{
            domino:domino,
            pileSide:pileSide,
        }
    }
}

export const ResetAction=()=>{
    return {
        type:PileActionTypes.RESET_ACTION,
        param:null
    }
}

export const OnInsertDominoComplete=(seatid, domino)=>{
    return {
        type:PileActionTypes.ON_INSERT_DOMINO_ANIMATION_COMPLETE,
        param:{
            seatid:seatid,
            domino:domino
        }
    }
}