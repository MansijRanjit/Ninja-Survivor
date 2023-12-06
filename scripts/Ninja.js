import { Fighter } from "./Fighter.js";

export class Ninja extends Fighter{
    constructor(x,y,velocity){
        super("Ninja",x,y,velocity);

        this.image=document.querySelector('img[alt="blueNinja"]');
    }
}
