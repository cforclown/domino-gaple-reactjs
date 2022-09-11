export const PlayerTemplate=(username, avatar, seatid, pos, isLocal=false)=>{
    return {
        isLocal:isLocal,
        username:username,
        avatar:avatar,
        seatid:seatid,
        position:pos,
        dominos:[],
        isOnTurn:false,
        lastAction:undefined,
        animation:{
            isRunning:false,
            removeDomino:undefined,     // (domino)
            rearrangeHand:undefined,
            faceupDomino:undefined,
        },
        timer:{
            visibility:false,
            isRunning:false,
            duration:5,
            timePassed:0,
        },
    }
}

export const Actions={
    ACTION:"ACTION",
    PASS:"PASS",
}