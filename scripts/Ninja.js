import { FighterState } from "./Constants.js";
import { Fighter } from "./Fighter.js";

export class Ninja extends Fighter{
    constructor(x,y,direction){
        super("Ninja",x,y,direction);

        this.image=document.querySelector('img[alt="blueNinja"]');
        
        this.frames=new Map([
            //Idle
            ['idle-1',[[250,109,71,105],[36,90]]],
            ['idle-2',[[335,109,72,104],[36,88]]],
            ['idle-3',[[425,110,72,102],[35,87]]],
            ['idle-4',[[509,113,72,101],[35,86]]],
            ['idle-5',[[595,113,72,101],[36,86]]],


            //Move Forward
            ['forward-1',[[198,2411,82,99],[40,84]]],
            ['forward-2',[[305,2410,80,97],[41,83]]],
            ['forward-3',[[421,2412,66,97],[33,83]]],
            ['forward-4',[[522,2413,59,94],[29,81]]],
            ['forward-5',[[613,2414,57,96],[29,80]]],
            ['forward-6',[[688,2415,60,95],[30,81]]],
            ['forward-7',[[774,2413,66,96],[33,82]]],
            ['forward-8',[[868,2411,80,97],[40,84]]],

            //Jump Up
            ['jump-up-1',[[103,2681,54,117],[27,116]]],
            ['jump-up-2',[[176,2694,61,97],[31,97]]],
            ['jump-up-3',[[259,2695,53,73],[27,73]]],

            //Jump Forward/Backward
            ['jump-roll-1',[[236,2884,91,69],[45,69]]],
            ['jump-roll-2',[[359,2887,61,54],[31,53]]],
            ['jump-roll-3',[[446,2891,70,50],[35,49]]],
            ['jump-roll-4',[[549,2884,61,54],[31,53]]],
            ['jump-roll-5',[[632,2887,70,50],[35,49]]],


        ]);

        this.animations ={
            [FighterState.IDLE]:['idle-1','idle-2','idle-3','idle-4','idle-5'],

            [FighterState.WALK_FORWARD]:['forward-1','forward-2','forward-3','forward-4','forward-5','forward-6','forward-7','forward-8'],

            [FighterState.WALK_BACKWARD]:['forward-1','forward-2','forward-3','forward-4','forward-5','forward-6','forward-7','forward-8'],

            [FighterState.JUMP_UP]: ['jump-up-1','jump-up-2','jump-up-3','jump-up-2','jump-up-1'],

            [FighterState.JUMP_FORWARD]:['jump-roll-1','jump-roll-2','jump-roll-3','jump-roll-4','jump-roll-5'],

            [FighterState.JUMP_BACKWARD]:['jump-roll-5','jump-roll-4','jump-roll-3','jump-roll-2','jump-roll-1'],
        };

        // this.initialVelocity ={
        //     jump: -10
        // }

    }
}
