import { FighterAttackBaseData, FighterState, HurtBoxNinja, PushBox,FighterAttackType } from "../Constants.js";
import { Fighter } from "../fighters/Fighter.js";
import { NinjaStar } from "../special/NinjaStar.js";
import { gameState } from "../state/gameState.js";

export class Ninja extends Fighter{
    constructor(x,y,direction,playerId,addEntity){
        super("Ninja",x,y,direction,playerId);

        this.image=document.querySelector('img[alt="blueNinja"]');  
        
        this.frames=new Map([
            //Idle
            ['idle-1',[[[250,109,71,105],[36,90]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['idle-2',[[[335,109,72,104],[36,88]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['idle-3',[[[425,110,72,102],[35,87]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['idle-4',[[[509,113,72,101],[35,86]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['idle-5',[[[595,113,72,101],[36,86]],PushBox.IDLE,HurtBoxNinja.IDLE]],


            //Move Forward/Backward
            ['forward-1',[[[198,2411,82,99],[40,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['forward-2',[[[305,2410,80,97],[41,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['forward-3',[[[421,2412,66,97],[33,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['forward-4',[[[522,2413,59,94],[29,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['forward-5',[[[613,2414,57,96],[29,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['forward-6',[[[688,2415,60,95],[30,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['forward-7',[[[774,2413,66,96],[33,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['forward-8',[[[868,2411,80,97],[40,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],

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
            ['crouch-1', [[[1126,122,65,86],[33,85]],PushBox.IDLE]], //y+10
            ['crouch-2', [[[843,139,59,70],[30,70]],PushBox.CROUCH]],
            ['crouch-3',[[[919,141,71,67],[35,67]],PushBox.CROUCH]],

            //Slash
            ['slash-1',[[[79,412,96,88],[49,88]],PushBox.IDLE,HurtBoxNinja.IDLE]], //, [17,-85,40,14]
            ['slash-2',[[[205,410,143,88],[41,88]],PushBox.IDLE,HurtBoxNinja.IDLE, [17,-85,40,14]]],
            ['slash-3',[[[362,406,152,91],[42,91]],PushBox.IDLE,HurtBoxNinja.IDLE, [17,-85,40,14]]],
            ['slash-4',[[[531,403,130,92],[35,91]],PushBox.IDLE,HurtBoxNinja.IDLE, [17,-85,40,14]]],
            ['slash-5',[[[679,405,95,90],[19,90]],PushBox.IDLE,HurtBoxNinja.IDLE, [17,-85,40,14]]],
            ['slash-6',[[[811,404,97,90],[50,89]],PushBox.IDLE,HurtBoxNinja.IDLE, [17,-85,40,14]]],

            //Kick
            ['kick-1',[[[360,12867,75,99],[26,89]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['kick-2',[[[455,12863,98,102],[38,92]],PushBox.IDLE,HurtBoxNinja.IDLE,[17,-85,30,14]]],
            
            //Hurt
            ['hurt-1',[[[213,3094,88,89],[52,86]],PushBox.IDLE,HurtBoxNinja.IDLE]],

            //Special Move
            ['special-1',[[[54,5742,72,92],[36,91]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['special-2',[[[157,5743,63,87],[32,91]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['special-3',[[[407,5766,68,70],[35,91]],PushBox.IDLE,HurtBoxNinja.IDLE]], 
            ['special-4',[[[500,5759,67,76],[34,91]],PushBox.IDLE,HurtBoxNinja.IDLE]], 
            ['special-5',[[[252,5763,99,69],[50,91]],PushBox.IDLE,HurtBoxNinja.IDLE]],

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

            [FighterState.SLASH]:
             [
                ['slash-1',60],['slash-2',60],['slash-3',260],['slash-4',60],['slash-5',60],['slash-6',-2],
             ],

            [FighterState.KICK]:
            [
                ['kick-1',260],['kick-2',260],['kick-1',-2]
            ], 

            [FighterState.HURT]:[
                ['hurt-1',300],['hurt-1',-2]
            ],

            [FighterState.SPECIAL]:[
                ['special-1',60],['special-2',60],['special-3',60],['special-4',260],['special-4',-2],
            ]
        };

        this.ninjaStar={fired:false, strength:FighterAttackBaseData[FighterAttackType.SPECIAL].damage}
        
        this.addEntity=addEntity;

        this.states[FighterState.SPECIAL]={
            init: this.handleSpecialInit.bind(this),
            update: this.handleSpecialState.bind(this),
            validFrom:[FighterState.IDLE,FighterState.WALK_FORWARD,FighterState.WALK_BACKWARD]
        }
    }

    handleSpecialInit(){
        this.resetVelocities();
        this.ninjaStar={fired:false, strength:FighterAttackBaseData[FighterAttackType.SPECIAL].damage}
    }
    handleSpecialState(time){
        if(!this.ninjaStar.fired && this.animationFrame ===2){
            this.ninjaStar.fired = true;
            this.addEntity(NinjaStar,time,this,this.ninjaStar.strength);
        }

        if(!this.isAnimationCompleted())return;
        this.changeState(FighterState.IDLE);
    }

}
