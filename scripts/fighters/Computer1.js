import { FighterState, HurtBoxEnemy1, enemy1PushBox,FighterAttackBaseData ,FighterAttackType} from "../Constants.js";
import { Fighter } from "./Fighter.js";
import { NinjaStar } from "../special/NinjaStar.js";
import * as inputKey from "../InputKeys.js";


export class Computer1 extends Fighter{
    constructor(x,y,direction,playerId,addEntity){
        super('computer1',x,y,direction,playerId);

        this.image= document.querySelector('img[alt="enemy2"]');

        this.slashCount=0;
        this.kickCount=0;
        this.starCount=0;

        this.frames= new Map([
            //Idle
            ['idle-1',[[[658,13,46,92],[24,90]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['idle-2',[[[392,18,50,87],[25,90]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['idle-3',[[[658,13,46,92],[24,90]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],

            //Move Forward/Backward
            ['forward-1',[[[589,16,50,89],[26,89]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['forward-2',[[[524,17,49,88],[25,88]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['forward-3',[[[456,18,49,89],[25,89]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['forward-4',[[[387,18,50,88],[26,88]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['forward-5',[[[320,19,48,87],[25,87]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['forward-6',[[[255,18,49,87],[25,87]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],

            //Jump Up
            ['jump-up-1',[[[591,454,39,80],[20,81]],enemy1PushBox.JUMP]],
            ['jump-up-2',[[[538,454,44,73],[22,73]],enemy1PushBox.JUMP]],
            ['jump-up-3',[[[475,469,48,61],[25,61]],enemy1PushBox.JUMP]],
            ['jump-up-4',[[[399,469,63,65],[32,64]],enemy1PushBox.JUMP]],
            ['jump-up-5',[[[338,469,51,63],[25,63]],enemy1PushBox.JUMP]],

            
            //Jump Forward/Backward
            ['jump-roll-1',[[[436,562,44,78],[22,78]],enemy1PushBox.JUMP]],
            ['jump-roll-2',[[[492,564,71,76],[35,76]],enemy1PushBox.JUMP]],
            ['jump-roll-3',[[[585,564,49,73],[24,74]],enemy1PushBox.JUMP]],
            ['jump-roll-4',[[[646,564,53,65],[27,65]],enemy1PushBox.JUMP]],


            //Crouch
            ['crouch-1', [[[278,262,51,63],[25,63]],enemy1PushBox.CROUCH]],
            ['crouch-2', [[[211,261,52,64],[26,64]],enemy1PushBox.CROUCH]],
            ['crouch-3', [[[146,260,53,64],[26,64]],enemy1PushBox.CROUCH]],

            
             //Slash
             ['slash-1',[[[622,793,79,91],[41,90]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE, [17,-85,40,14]]],
             ['slash-2',[[[513,793,98,91],[49,90]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE, [17,-85,40,14]]],
             ['slash-3',[[[463,786,51,98],[25,99]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE, [17,-85,40,14]]],

             //Kick
             ['kick-1',[[[204,1505,49,87],[25,88]],enemy1PushBox.IDLE, HurtBoxEnemy1.IDLE]],
             ['kick-2',[[[103,1514,78,78],[39,88]],enemy1PushBox.IDLE, HurtBoxEnemy1.IDLE,[20,-79,32,14]]],

             //Hurt
             ['hurt-1',[[[593,1417,43,73],[22,83]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],

             //Special Move
            ['special-1',[[[247,1174,50,86],[25,86]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
            ['special-2',[[[158,1182,62,77],[31,87]],enemy1PushBox.IDLE,HurtBoxEnemy1.IDLE]],
        ]);

        this.animations ={
            [FighterState.IDLE]:[
                ['idle-1',168],['idle-2',168],['idle-3',168]
            ],

            [FighterState.WALK_FORWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-5',65],['forward-6',-2]
            ],

            [FighterState.WALK_BACKWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-5',65],['forward-6',-2]
            ],

            [FighterState.JUMP_UP]: [
                ['jump-up-1',200],['jump-up-2',200],['jump-up-3',200],['jump-up-4',200],['jump-up-5',-2]
            ],

            [FighterState.JUMP_FORWARD]:[
                ['jump-roll-1',200],['jump-roll-2',200],['jump-roll-3',200],['jump-roll-4',0],
            ],

            [FighterState.JUMP_BACKWARD]:[
               ['jump-roll-4',200],['jump-roll-3',200],['jump-roll-2',200],['jump-roll-1',0],
            ],

            [FighterState.CROUCH_DOWN]:
            [
                ['crouch-1',1],['crouch-2',1],['crouch-3',-2]
            ],

            [FighterState.CROUCH]:
            [['crouch-3',-2]],

            [FighterState.CROUCH_UP]:
            [
                ['crouch-3',260],['crouch-2',260],['crouch-1',-2]
             ],

            [FighterState.SLASH]:
             [
                ['slash-1',260],['slash-2',260],['slash-3',-2]
             ],

            [FighterState.KICK]:
            [
                ['kick-1',260],['kick-2',260],['kick-1',-2]
            ], 

            [FighterState.HURT]:[
                ['hurt-1',300],['hurt-1',-2]
            ],

            [FighterState.SPECIAL]:[
                ['special-1',260],['special-2',260],['special-2',-2],
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
   
    hitTimer=0;
    handleIdleState(){
            function getRandomAttackState(){
                const attacks=[FighterAttackType.KICK,FighterAttackType.SLASH,FighterAttackType.SPECIAL];

                const randomIndex=Math.floor(Math.random() * attacks.length)
                return attacks[randomIndex]
            }

            if(inputKey.heldKeys.has("KeyR")){
                // Increment slashCount only if the key was not pressed in the previous frame
                if(!this.keyRPressed){
                    this.slashCount++;
                    if(this.slashCount%4===0){
                        this.changeState(FighterState.CROUCH_DOWN);
                    }

                    if(this.slashCount%3===0){
                        this.changeState(getRandomAttackState());
                    }
                    this.keyRPressed=true;
                }      
            }
            else{
                this.keyRPressed=false
            }
            
            
            if(inputKey.heldKeys.has("KeyT")){
                if(!this.keyTPressed){
                    this.kickCount++;
                    if(this.kickCount%3===0){ 
                        this.changeState(FighterState.CROUCH_DOWN); 
                    }
                    if(this.kickCount%2===0){
                        this.changeState(getRandomAttackState()); 
                    }
                }
                this.keyTPressed=true
            }
            else{
                this.keyTPressed=false
            }

            if(inputKey.heldKeys.has("KeyY")){
                if(!this.keyYPressed){
                    this.starCount++;
                    if(this.starCount%3===0){
                        this.changeState(FighterState.JUMP_FORWARD);
                    }
                    if(this.starCount%2===0){
                        this.changeState(FighterState.SPECIAL);
                    }
                }
                this.keyYPressed=true;
            }
            else{
                this.keyYPressed=false
            }


            setTimeout(() => {
                if(Math.abs(this.position.x-this.opponent.position.x) >78 ){
                    this.changeState(FighterState.WALK_FORWARD);           
                }
            },5000)

            this.hitTimer++;
            if(this.hitTimer%400===0){
                if(Math.abs(this.position.x-this.opponent.position.x) <78 ){
                    this.changeState(getRandomAttackState());
                }
            }
    }
    handleWalkForwardState(){
        if(!this.isAnimationCompleted())return;
        this.changeState(FighterState.IDLE);
    }
}

