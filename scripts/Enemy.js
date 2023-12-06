import { Fighter } from "./Fighter.js";

export class enemy1 extends Fighter{
    constructor(x,y,velocity){
        super('enemy1',x,y,velocity);

        this.image= document.querySelector('img[alt="enemy1"]');
    }
}


