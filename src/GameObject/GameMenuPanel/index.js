import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'

import {AvatarImages} from '../../Assets/Images/avatar'



const Container=styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    
    width: ${props=>props.width}px;
    height: ${props=>props.height}px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px; 
    background-color: #7158e2;
    box-shadow: 0 0 12px #7d5fff;

    font-family: 'Quicksand-Bold';
    color: white;

    h1 {
        font-size: 1.2rem;
    }
    input {
        display: inline-block;
        width: 60%;
        padding: 8px 16px;
        margin: 0 0 24px 0;

        background-color: rgba(255, 255, 255, 0.25);
        border: none;
        border-radius: 4px;

        text-align: left;
        text-decoration: none;
        font-size: 1rem;
        font-weight: bold;
        color: white;
    }
        input:focus {
            background-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 0 8px white;
        }
        input:hover {
            background-color: rgba(255, 255, 255, 0.35);
        }
        input::placeholder {
            color: white;
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
            transform: scale(0.95);
            -moz-transform: scale(0.95);
            -webkit-transform: scale(0.95);
            -o-transform: scale(0.95);
            -ms-transform: scale(0.95);
        }
`
const AvatarContainer=styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin: 0 0 24px 0;
`
const AvatarImage=styled.div`
    width: ${props=>props.width}px;
    height: ${props=>props.height}px;

    background-image: url('${props=>props.image}');
    background-size: cover;
    background-color: #3d3d3d;
    box-shadow: 0px 0px 8px #4b4b4b;

    margin: 0 12px;
`

function GameMenuPanel(props){
    const [state, setState]=useState({
        username: "",
        avatar: 1,
    });



    function OnPlayClick(){
        if(!state.username || state.username==="")
            return;
        props.onPlayClick(state.username, state.avatar)
    }
    function OnUsernameInputChange(e){
        setState({
            ...state,
            username: e.target.value
        })
    }
    function OnPrevAvatarClick(){
        let prevAvatar=state.avatar-1;
        if(prevAvatar<1)
            prevAvatar+=10;
        setState({
            ...state,
            avatar: prevAvatar,
        })
    }
    function OnNextAvatarClick(){
        let nextAvatar=state.avatar+1;
        if(nextAvatar>10)
            nextAvatar-=10;
        setState({
            ...state,
            avatar: nextAvatar,
        })
    }



    if(props.isVisible){
        return (
            <Container width={props.size.width} height={props.size.height}>
                <h1 className='mb-3'>SELECT AVATAR</h1>

                <AvatarContainer>
                    {/* <AvatarControlBtn onClick={OnPrevAvatarClick} image={PreviousBtnImg}/> */}
                    <button onClick={OnPrevAvatarClick} >
                        <FontAwesomeIcon icon={faCaretLeft} size='lg' />
                    </button>
                    <AvatarImage width={72} height={72} image={AvatarImages[`a${state.avatar}`]}/>
                    {/* <AvatarControlBtn onClick={OnNextAvatarClick} image={NextBtnImg}/> */}
                    <button onClick={OnNextAvatarClick} >
                        <FontAwesomeIcon icon={faCaretRight} size='lg' />
                    </button>
                </AvatarContainer>

                <input value={state.username} onChange={OnUsernameInputChange} placeholder="Player name"/>

                <button onClick={OnPlayClick}>
                    Play
                </button>
            </Container>
        )
    }
    else
        return null;
}

GameMenuPanel.propTypes={
    size: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onPlayClick: PropTypes.func.isRequired,
}

export default GameMenuPanel;