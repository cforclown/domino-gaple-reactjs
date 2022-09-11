import React from 'react';
import styled from 'styled-components';

import GameScreen from '../GameScreen';

import './index.scss'



const Container=styled.div`
    width: 100vw;
    height: 100vh;
    background-size: cover;
    overflow: hidden;
`
function DominoGaple(){
    return (
        <>
            <div className="stars">
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
            </div>

            <Container>
                <GameScreen/>
            </Container>
        </>
    )
}


export default DominoGaple;