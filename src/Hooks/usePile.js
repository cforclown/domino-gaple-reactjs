import {useState} from 'react'
import Pile from '../GameObject/Pile/Pile'

export const usePile=()=>{
    const [pile, setPile] = useState({
        dominos:[],
        headDomino:undefined,
        tailDomino:undefined,
    })

    const Reset=()=>{
        setPile({
            dominos:[],
            headDomino:undefined,
            tailDomino:undefined,
        })
    }

    const AddDomino=(domino)=>{
        let currentDominos=pile.dominos
        currentDominos.push(domino);

        setPile(prev=>({
            ...prev,
            dominos:currentDominos,
        }))
    }

    return [pile, setPile];
}