import { FighterDirection } from "./Constants.js";
import { Control, controls } from "./KeysControl.js";

const heldKeys= new Set();//store key codes that are currently being held down
const pressedKeys = new Set();

function handleKeyDown(event){
    event.preventDefault();//prevent default behaviour assssociated with the keydown event
    heldKeys.add(event.code);//adds the key code of the pressed key to the heldKeys Set

    console.log(heldKeys)
}
function handleKeyUp(event){
    event.preventDefault();
    heldKeys.delete(event.code);//removes the key code from the heldKeys Set
    pressedKeys.delete(event.code);
}

export function inputKeyboardEvents(){
    window.addEventListener('keydown',handleKeyDown);
    window.addEventListener('keyup',handleKeyUp);

}

export function isKeyPressed(code){
    if(heldKeys.has(code) && !pressedKeys.has(code)){
        pressedKeys.add(code);
        return true;
    }
    return false;  
}

//check if the key is present in heldKeys Set or not and returns true or false accordingly
export const isKeyDown = (code) => heldKeys.has(code);
export const isKeyUp = (code) => !heldKeys.has(code);

export const isLeft =(id) => isKeyDown(controls[id].keyboard[Control.LEFT]);
export const isRight =(id) => isKeyDown(controls[id].keyboard[Control.RIGHT]);
export const isUp =(id) => isKeyDown(controls[id].keyboard[Control.UP]);
export const isDown =(id) => isKeyDown(controls[id].keyboard[Control.DOWN]);

//Move forward and backwards based on direction
export const isForward =(id,direction) => direction === FighterDirection.RIGHT? isRight(id):isLeft(id);
export const isBackward =(id,direction) => direction === FighterDirection.LEFT? isRight(id):isLeft(id);

//Attacks
//export const isControlDown =(id,control) => isKeyDown(controls[id].keyboard[control]);
export const isControlPressed =(id,control) => isKeyPressed(controls[id].keyboard[control]);

export const isSlash =(id) => isControlPressed(id,Control.SLASH);
export const isKick =(id) => isControlPressed(id,Control.KICK);
