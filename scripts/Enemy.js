import { Fighter } from "./Fighter.js";

export class enemy1 extends Fighter{
    constructor(x,y,direction){
        super('enemy1',x,y,direction);

        this.image= document.querySelector('img[alt="enemy1"]');

        this.frames= new Map([
            ['forward-1',[[5,108,66,85],[32,85]]],
            ['forward-2',[[76,105,65,88],[31,87]]],
            ['forward-3',[[149,101,65,91],[33,90]]],
            ['forward-4',[[220,101,65,90],[34,88]]],
            ['forward-5',[[294,102,66,85],[33,86]]],

        ]);

        this.animations ={
            'walkForward': ['forward-1','forward-2','forward-3','forward-4','forward-5'],

            'walkBackward': ['forward-1','forward-2','forward-3','forward-4','forward-5']
        };
    }
}


