const DominoTemplate=(top, bot, pileSide=undefined, pileVector=undefined, position=undefined)=>{
    return {
        value:[top, bot],
        totalValue:top+bot,
        isBalak:(top===bot),
        size:undefined,
        pileSide:pileSide,
        pileVector:pileVector,
        position:position,
        transform:0,
        isPileClue:false,
        isSelected:false,
        selectable:true,    //
        isFaceup:false,
    }
}

export default DominoTemplate
