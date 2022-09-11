import {useState, useEffect } from 'react';

import Player from '../GameObject/Player/Player';
import { GetPositionBySeatid, GameState } from '../Global/Global';

export const useUIManager=(initialState)=>{
    const [currentState, setState] = useState(initialState);

    useEffect(()=>{
        //console.log("ui_on_change")
    })

    return [currentState, setState];
}