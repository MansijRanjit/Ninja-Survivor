import { FighterState, HurtBoxTurtle, PushBox } from "./Constants.js";
import { Fighter } from "./Fighter.js";

export class enemy1 extends Fighter{
    constructor(x,y,direction,playerId){
        super('enemy1',x,y,direction,playerId);

        this.image= document.querySelector('img[alt="enemy1"]');

        this.frames= new Map([
            //Idle
            ['idle-1',[[[61,3,68,86],[34,85]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['idle-2',[[[135,1,64,88],[31,88]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['idle-3',[[[206,1,65,89],[32,89]],PushBox.IDLE,HurtBoxTurtle.IDLE]],

            //Move Forward
            ['forward-1',[[[5,108,66,85],[32,85]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['forward-2',[[[76,105,65,88],[31,87]],PushBox.IDLE,HurtBoxTurtle.direction]],
            ['forward-3',[[[149,101,65,91],[33,90]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['forward-4',[[[220,101,65,90],[34,88]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['forward-5',[[[294,102,66,85],[33,86]],PushBox.IDLE,HurtBoxTurtle.IDLE]],

            //Jump Up
            ['jump-up-1',[[[7,711,102,89],[51,87]],PushBox.JUMP]],
            ['jump-up-2',[[[117,713,102,74],[50,73]],PushBox.JUMP]],
            ['jump-up-3',[[[231,699,61,88],[31,87]],PushBox.JUMP]],
            ['jump-up-4',[[[301,701,58,94],[28,92]],PushBox.JUMP]],

            //Jump Forward/Backward
            ['jump-roll-1',[[[371,710,44,42],[22,42]],PushBox.JUMP]],
            ['jump-roll-2',[[[427,708,41,44],[21,44]],PushBox.JUMP]],
            ['jump-roll-3',[[[472,711,44,41],[23,41]],PushBox.JUMP]],
            ['jump-roll-4',[[[520,709,41,44],[20,43]],PushBox.JUMP]],

            //Crouch
            ['crouch-1', [[[22,418,66,76],[33,65]],PushBox.IDLE]],
            ['crouch-2',[[[103,424,67,69],[34,58]],PushBox.BEND]],
            ['crouch-3',[[[181,427,56,67],[28,57]],PushBox.CROUCH]],

             //Slash
             ['slash-1',[[[75,222,80,78],[38,78]],PushBox.IDLE,HurtBoxTurtle.IDLE, [17,-85,40,14]]],
             ['slash-2',[[[185,214,67,82],[32,82]],PushBox.IDLE,HurtBoxTurtle.IDLE,[17,-85,40,14]]],
             ['slash-3',[[[266,227,86,65],[43,85]],PushBox.IDLE,HurtBoxTurtle.IDLE, [17,-85,40,14]]],
        
 
             //Kick
             ['kick-1',[[[1,319,74,82],[27,82]],PushBox.IDLE, HurtBoxTurtle.IDLE,[17,-69,30,14]]],
             ['kick-2',[[[89,309,97,96],[38,86]],PushBox.IDLE, HurtBoxTurtle.IDLE,[17,-69,30,14]]],
        ]);

        this.animations ={
            [FighterState.IDLE]:[
                ['idle-1',168],['idle-2',168],['idle-3',168]
            ],

            [FighterState.WALK_FORWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-5',65],
            ],

            [FighterState.WALK_BACKWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-5',65]
            ],

            [FighterState.JUMP_UP]: [
                ['jump-up-1',200],['jump-up-2',200],['jump-up-3',200],['jump-up-4',-1]
            ],

            [FighterState.JUMP_FORWARD]:[
                ['jump-roll-1',200],['jump-roll-2',200],['jump-roll-3',200],['jump-roll-4',0],
            ],

            [FighterState.JUMP_BACKWARD]:[
               ['jump-roll-4',200],['jump-roll-3',200],['jump-roll-2',200],['jump-roll-1',0],
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

            [FighterState.SLASH]:
             [
                ['slash-1',260],['slash-2',260],['slash-3',260],['slash-2',260],['slash-1',-2]
             ],

            [FighterState.KICK]:
            [
                ['kick-1',260],['kick-2',260],['kick-1',-2]
            ], 

        };

        // this.initialVelocity ={
        //     jump:-10
        // }
        
        // console.log(this.initialVelocity.jump)
        // console.log(this.velocity.y)

    }

    
}


