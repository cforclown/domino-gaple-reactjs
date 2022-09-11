import {useState} from 'react';

export const usePlayer=()=>{
    const [player, setPlayer] = useState({
        username:'',
        avatar:0,
        seatid:0,
        pos:[],
        dominos:[],
    });

    return [player, setPlayer];
}