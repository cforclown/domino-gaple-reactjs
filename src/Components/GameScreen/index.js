import React from 'react';
import styled from 'styled-components'

import {S_WIDTH, S_HEIGHT} from '../../Global/Global';
import UIManager from '../../GameObject/UIManager';



const Container=styled.div`
    position: relative;
    width: ${props=>props.width}px;
    height: ${props=>props.height}px;
    
    background-color: rgba(24, 220, 255, 0.75);
    background-size: cover;
    border-radius: 4px;
    box-shadow: 0 0 12px #7efff5;

    margin: 25px auto;
`

function GameScreen(){
    return (
        <Container width={S_WIDTH} height={S_HEIGHT}>
            <UIManager width={S_WIDTH} height={S_HEIGHT}/>
        </Container>
    )
}


export default GameScreen;
