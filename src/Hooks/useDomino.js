import {useState} from 'react';

export const DominoTemplate=(top, bot, pileSide=undefined, pileVector=undefined, pilePosition=undefined)=>{
    return {
        value:[top, bot],
        pileSide:pileSide,
        pileVector:pileVector,
        pilePosition:pilePosition,
        isSelected:false,
        isFaceup:false,
    }
}

export const useDomino=(top, bot, pileSide=undefined, pileVector=undefined, pilePosition=undefined)=>{
    const [domino, setDomino]=useState({
        value:[top, bot],
        pileSide:pileSide,
        pileVector:pileVector,
        pilePosition:pilePosition,
        isSelected:false,
        isFaceup:false,
    })

    return [domino, setDomino];
}