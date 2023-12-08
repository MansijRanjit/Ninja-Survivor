import { FighterState } from "./Constants.js";
import { Fighter } from "./Fighter.js";

export class enemy1 extends Fighter{
    constructor(x,y,direction){
        super('enemy1',x,y,direction);

        this.image= document.querySelector('img[alt="enemy1"]');

        this.frames= new Map([
            //Idle
            ['idle-1',[[61,3,68,86],[34,85]]],
            ['idle-2',[[135,1,64,88],[31,88]]],
            ['idle-3',[[206,1,65,89],[32,89]]],

            //Move Forward
            ['forward-1',[[5,108,66,85],[32,85]]],
            ['forward-2',[[76,105,65,88],[31,87]]],
            ['forward-3',[[149,101,65,91],[33,90]]],
            ['forward-4',[[220,101,65,90],[34,88]]],
            ['forward-5',[[294,102,66,85],[33,86]]],

            //Jump Up
            ['jump-up-1',[[7,711,102,89],[51,87]]],
            ['jump-up-2',[[117,713,102,74],[50,73]]],
            ['jump-up-3',[[231,699,61,88],[31,87]]],
            ['jump-up-4',[[301,701,58,94],[28,92]]],

            //Jump Forward/Backward
            ['jump-roll-1',[[371,710,44,42],[22,42]]],
            ['jump-roll-2',[[427,708,41,44],[21,44]]],
            ['jump-roll-3',[[472,711,44,41],[23,41]]],
            ['jump-roll-4',[[520,709,41,44],[20,43]]],
        ]);

        this.animations ={
            [FighterState.IDLE]:['idle-1','idle-2','idle-3','idle-2','idle-1'],

            [FighterState.WALK_FORWARD]: ['forward-1','forward-2','forward-3','forward-4','forward-5'],

            [FighterState.WALK_BACKWARD]: ['forward-1','forward-2','forward-3','forward-4','forward-5'],

            [FighterState.JUMP_UP]: ['jump-up-1','jump-up-2','jump-up-3','jump-up-4',],

            [FighterState.JUMP_FORWARD]:['jump-roll-1','jump-roll-2','jump-roll-3','jump-roll-4'],

            [FighterState.JUMP_BACKWARD]:['jump-roll-4','jump-roll-3','jump-roll-2','jump-roll-1'],
        };

        // this.initialVelocity ={
        //     jump:-10
        // }
        
        // console.log(this.initialVelocity.jump)
        // console.log(this.velocity.y)

    }

    
}


