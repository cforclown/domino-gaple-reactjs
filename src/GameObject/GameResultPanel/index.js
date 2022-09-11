import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';



const Container=styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);

    padding: 40px 80px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px; 
    background-color: #7158e2;
    box-shadow: 0 0 12px #7d5fff;

    color: white;
    font-family: 'Quicksand-Bold';

    h1 {
        font-size: 1.2rem;
    }

    button {
        display: inline-block;
        padding: 4px 16px;
        margin: 0;

        background-color: #56baed;
        border: none;
        border-radius: 4px;
        box-shadow: 0 0 20px 0 rgba(95, 186, 233, 0.4);

        text-transform: uppercase;
        text-align: center;
        text-decoration: none;
        font-size: 1.4rem;
        color: white;
    
        transition: all 0.25s ease-in-out;
        -webkit-transition: all 0.25s ease-in-out;
        -moz-transition: all 0.25s ease-in-out;
        -ms-transition: all 0.25s ease-in-out;
        -o-transition: all 0.25s ease-in-out;
    } 
        button:hover {
            background-color: #39ace7;
        }
        button:active {
            -moz-transform: scale(0.95);
            -webkit-transform: scale(0.95);
            -o-transform: scale(0.95);
            -ms-transform: scale(0.95);
            transform: scale(0.95);
        }
`

function GameResultPanel(props){
    function onPlayAgainClick(){
        props.onPlayAgainClick()
    }



    return (
        <Container>
            <h1 className='mb-4'>
                {props.win ? ("YOU WIN !!") : "YOU LOSE !!"}
            </h1>

            <button onClick={onPlayAgainClick} >
                PLAY AGAIN
            </button> 
        </Container>
    )
}

GameResultPanel.propTypes={
    win: PropTypes.bool.isRequired,
    onPlayAgainClick: PropTypes.func.isRequired,
}

export default GameResultPanel;