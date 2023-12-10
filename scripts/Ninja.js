import { FighterState, PushBox } from "./Constants.js";
import { Fighter } from "./Fighter.js";

export class Ninja extends Fighter{
    constructor(x,y,direction,playerId){
        super("Ninja",x,y,direction,playerId);

        this.image=document.querySelector('img[alt="blueNinja"]');
        
        this.frames=new Map([
            //Idle
            ['idle-1',[[[250,109,71,105],[36,90]],PushBox.IDLE]],
            ['idle-2',[[[335,109,72,104],[36,88]],PushBox.IDLE]],
            ['idle-3',[[[425,110,72,102],[35,87]],PushBox.IDLE]],
            ['idle-4',[[[509,113,72,101],[35,86]],PushBox.IDLE]],
            ['idle-5',[[[595,113,72,101],[36,86]],PushBox.IDLE]],


            //Move Forward/Backward
            ['forward-1',[[[198,2411,82,99],[40,84]],PushBox.IDLE]],
            ['forward-2',[[[305,2410,80,97],[41,83]],PushBox.IDLE]],
            ['forward-3',[[[421,2412,66,97],[33,83]],PushBox.IDLE]],
            ['forward-4',[[[522,2413,59,94],[29,81]],PushBox.IDLE]],
            ['forward-5',[[[613,2414,57,96],[29,80]],PushBox.IDLE]],
            ['forward-6',[[[688,2415,60,95],[30,81]],PushBox.IDLE]],
            ['forward-7',[[[774,2413,66,96],[33,82]],PushBox.IDLE]],
            ['forward-8',[[[868,2411,80,97],[40,84]],PushBox.IDLE]],

            //Jump Up
            ['jump-up-1',[[[103,2681,54,117],[17,106]],PushBox.JUMP]],
            ['jump-up-2',[[[176,2694,61,97],[21,87]],PushBox.JUMP]],
            ['jump-up-3',[[[259,2695,53,73],[17,63]],PushBox.JUMP]],

            //Jump Forward/Backward
            ['jump-roll-1',[[[236,2884,91,69],[45,69]],PushBox.JUMP]],
            ['jump-roll-2',[[[359,2887,61,54],[31,53]],PushBox.JUMP]],
            ['jump-roll-3',[[[446,2891,70,50],[35,49]],PushBox.JUMP]],
            ['jump-roll-4',[[[549,2884,61,54],[31,53]],PushBox.JUMP]],
            ['jump-roll-5',[[[632,2887,70,50],[35,49]],PushBox.JUMP]],

            //Crouch
            ['crouch-1', [[[1126,122,65,86],[33,75]],PushBox.IDLE]],
            ['crouch-2', [[[843,139,59,70],[30,60]],PushBox.BEND]],
            ['crouch-3',[[[919,141,71,67],[35,57]],PushBox.CROUCH]],

        ]);

        this.animations ={
            [FighterState.IDLE]:[
                ['idle-1',168],['idle-2',168],['idle-3',168],['idle-4',168],['idle-5',168],
            ],

            [FighterState.WALK_FORWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-5',65],['forward-6',65],['forward-7',65],['forward-8',65],
            ],

            [FighterState.WALK_BACKWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-5',65],['forward-6',65],['forward-7',65],['forward-8',65],
            ],

            [FighterState.JUMP_UP]: [
                ['jump-up-1',200],['jump-up-2',200],['jump-up-3',200],['jump-up-2',200], ['jump-up-1',0]
            ],

            [FighterState.JUMP_FORWARD]:[
                ['jump-roll-1',200],['jump-roll-2',200],['jump-roll-3',200],['jump-roll-4',200],['jump-roll-5',0],
            ],

            [FighterState.JUMP_BACKWARD]:[
                ['jump-roll-5',200],['jump-roll-4',200],['jump-roll-3',200],['jump-roll-2',200],['jump-roll-1',200],
            ],

            [FighterState.CROUCH_DOWN]:
            [
                ['crouch-1',60],['crouch-2',60],['crouch-3',-2]
            ],

            [FighterState.CROUCH]:
            [['crouch-3',0]],

            [FighterState.CROUCH_UP]:
            [
                ['crouch-3',60],['crouch-2',60],['crouch-1',-2]
             ],
        };

        // this.initialVelocity ={
        //     jump: -10
        // }

    }
}
