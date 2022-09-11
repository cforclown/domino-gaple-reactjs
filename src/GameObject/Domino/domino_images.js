import facedown from './domino_images/facedown.png';

import d00 from './domino_images/00.png';
import d01 from './domino_images/01.png';
import d02 from './domino_images/02.png';
import d03 from './domino_images/03.png';
import d04 from './domino_images/04.png';
import d05 from './domino_images/05.png';
import d06 from './domino_images/06.png';

import d11 from './domino_images/11.png';
import d12 from './domino_images/12.png';
import d13 from './domino_images/13.png';
import d14 from './domino_images/14.png';
import d15 from './domino_images/15.png';
import d16 from './domino_images/16.png';

import d22 from './domino_images/22.png';
import d23 from './domino_images/23.png';
import d24 from './domino_images/24.png';
import d25 from './domino_images/25.png';
import d26 from './domino_images/26.png';

import d33 from './domino_images/33.png';
import d34 from './domino_images/34.png';
import d35 from './domino_images/35.png';
import d36 from './domino_images/36.png';

import d44 from './domino_images/44.png';
import d45 from './domino_images/45.png';
import d46 from './domino_images/46.png';

import d55 from './domino_images/55.png';
import d56 from './domino_images/56.png';

import d66 from './domino_images/66.png';

export const DominoImages={
    facedown:facedown,
    d00:d00, d01:d01, d02:d02, d03:d03, d04:d04, d05:d05, d06:d06,
    d11:d11, d12:d12, d13:d13, d14:d14, d15:d15, d16:d16,
    d22:d22, d23:d23, d24:d24, d25:d25, d26:d26,
    d33:d33, d34:d34, d35:d35, d36:d36,
    d44:d44, d45:d45, d46:d46,
    d55:d55, d56:d56,
    d66:d66,
};

export const GetDominoImage=(value)=>{
    if(value===undefined){
        return DominoImages['facedown'];
    }

    return DominoImages[`d${value[0]}${value[1]}`];
}