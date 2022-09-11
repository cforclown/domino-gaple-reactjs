export const S_WIDTH=1200   //game window width
export const S_HEIGHT=675;  //game window height

export const SEATID_0_POS=[200, 550];
export const SEATID_1_POS=[1100, 525];
export const SEATID_2_POS=[950, 20];
export const SEATID_3_POS=[25, 75];

export const GameState={
    Waiting:'WAITING',
    Idle:'IDLE',
    DrawCard:'DRAWCARD',
    Ready:'READY',
    PlayerTurn:'PLAYERTURN',
    ActionDone:'ACTION_DONE',
    ShowHand:'SHOWHAND',
    Discard:'DISCARD',
}

export const GetPositionBySeatid=(_seatid)=>{
    switch(_seatid){
        case 0:
            return SEATID_0_POS;
        case 1:
            return SEATID_1_POS;
        case 2:
            return SEATID_2_POS;
        case 3:
            return SEATID_3_POS;
        default:
            return SEATID_0_POS
    }
}