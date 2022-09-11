const Deck=()=>{
    const dominos = [  [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], 
                        [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], 
                        [2,2], [2,3], [2,4], [2,5], [2,6], 
                        [3,3], [3,4], [3,5], [3,6], 
                        [4,4], [4,5], [4,6], 
                        [5,5], [5,6], 
                        [6,6]   ]
    const shuffledDomino=[]

    const Shuffle=()=>{
        shuffledDomino=[...dominos]

        for(let x=this.dominos.length-1; x>0; x--){
            let currentDomino = shuffledDomino[x];
            let otherDomino = RandomInteger(0, x);

            shuffledDomino[x] = shuffledDomino[otherDomino];
            shuffledDomino[otherDomino] = currentDomino;
        }
    }

    const Dequeue=()=>{
        if(shuffledDomino.length()===0)
            Shuffle()

        return shuffledDomino.pop()
    }

    const RandomInteger=(min, max)=>{
        let minNum = Math.ceil(min);
        let maxNum = Math.floor(max);
        return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }
}

export default Deck