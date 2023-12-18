import { FighterState, HurtBoxTurtle, PushBox,FighterAttackBaseData ,FighterAttackType, HurtBoxNinja} from "../Constants.js";
import { Fighter } from "./Fighter.js";
import { NinjaStar } from "../special/NinjaStar.js";
import * as inputKey from "../InputKeys.js";


export class Computer3 extends Fighter{
    constructor(x,y,direction,playerId,addEntity){
        super('computer3',x,y,direction,playerId);

        this.image= document.querySelector('img[alt="enemy3"]');

        this.slashCount=0;
        this.kickCount=0;
        this.starCount=0;

        this.frames= new Map([
            //Idle
            ['idle-1',[[[366,192,79,106],[40,85]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['idle-2',[[[566,190,80,105],[40,85]],PushBox.IDLE,HurtBoxNinja.IDLE]],
            ['idle-3',[[[774,189,78,105],[39,85]],PushBox.IDLE,HurtBoxNinja.IDLE]],

            //Move Forward/Backward
            ['forward-1',[[[384,324,70,109],[35,89]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['forward-2',[[[473,321,71,115],[35,86]],PushBox.IDLE,HurtBoxTurtle.direction]],
            ['forward-3',[[[666,321,103,112],[50,90]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['forward-4',[[[785,325,70,105],[36,84]],PushBox.IDLE,HurtBoxTurtle.IDLE]],

            //Jump Up
            ['jump-up-1',[[[295,1384,63,104],[31,104]],PushBox.JUMP]],
            ['jump-up-2',[[[387,1397,63,81],[31,82]],PushBox.JUMP]],

            //Crouch
            ['crouch-1', [[[1098,2557,73,100],[36,69]],PushBox.IDLE]],
            ['crouch-2',[[[1204,2570,79,87],[39,56]],PushBox.CROUCH]],

             //Slash
             ['slash-1',[[[180,615,88,110],[34,85]],PushBox.IDLE,HurtBoxTurtle.IDLE, [17,-85,40,14]]],
             ['slash-2',[[[1089,618,79,109],[19,85]],PushBox.IDLE,HurtBoxTurtle.IDLE,[17,-85,40,14]]],
             ['slash-3',[[[1189,620,135,109],[28,85]],PushBox.IDLE,HurtBoxTurtle.IDLE, [17,-85,40,14]]],
        
 
             //Kick
             ['kick-1',[[[177,760,90,110],[46,89]],PushBox.IDLE, HurtBoxTurtle.IDLE]],
             ['kick-2',[[[294,762,118,105],[58,85]],PushBox.IDLE, HurtBoxTurtle.IDLE]],
             ['kick-3',[[[444,758,125,107],[61,88]],PushBox.IDLE, HurtBoxTurtle.IDLE,[17,-69,20,14]]],//[17,-69,30,14]

             //Hurt
             ['hurt-1',[[[290,2131,95,105],[48,84]],PushBox.IDLE,HurtBoxTurtle.IDLE]],

             //Special Move
            ['special-1',[[[433,3387,94,99],[47,87]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['special-2',[[[547,3380,115,107],[58,87]],PushBox.IDLE,HurtBoxTurtle.IDLE]],
            ['special-3',[[[681,3342,121,149],[62,88]],PushBox.IDLE,HurtBoxTurtle.IDLE,[17,-69,20,14]]], 
            ['special-4',[[[816,3357,100,137],[51,86]],PushBox.IDLE,HurtBoxTurtle.IDLE,[17,-69,20,14]]], 
            ['special-5',[[[937,3384,112,106],[57,87]],PushBox.IDLE,HurtBoxTurtle.IDLE]], 

            
        ]);

        this.animations ={
            [FighterState.IDLE]:[
                ['idle-1',168],['idle-2',168],['idle-3',168]
            ],

            [FighterState.WALK_FORWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-3',65],['forward-2',65],['forward-1',-2]
            ],

            [FighterState.WALK_BACKWARD]:[
                ['forward-1',65],['forward-2',65],['forward-3',65],['forward-4',65],['forward-3',65],['forward-2',65],['forward-1',-2]
            ],

            [FighterState.JUMP_UP]: [
                ['jump-up-1',200],['jump-up-2',300],['jump-up-2',300],['jump-up-1',-2]
            ],

            [FighterState.JUMP_FORWARD]:[
                ['jump-up-1',200],['jump-up-2',200],['jump-up-2',200],['jump-up-1',-2],
            ],

            [FighterState.JUMP_BACKWARD]:[
                ['jump-up-1',200],['jump-up-2',200],['jump-up-2',200],['jump-up-1',-2],
            ],

            [FighterState.CROUCH_DOWN]:
            [
                ['crouch-1',60],['crouch-2',-2]
            ],

            [FighterState.CROUCH]:
            [['crouch-2',-2]],

            [FighterState.CROUCH_UP]:
            [
                ['crouch-2',260],['crouch-1',-2]
             ],

            [FighterState.SLASH]:
             [
                ['slash-1',60],['slash-2',60],['slash-3',260],['slash-2',260],['slash-1',-2]
             ],

            [FighterState.KICK]:
            [
                ['kick-1',60],['kick-2',60],['kick-3',260],['kick-2',-2]
            ], 

            [FighterState.HURT]:[
                ['hurt-1',300],['hurt-1',-2]
            ],

            [FighterState.SPECIAL]:[
                ['special-1',60],['special-2',260],['special-3',260],['special-4',260],['special-5',60],['special-5',-2],
            ],


        };

        this.states[FighterState.SPECIAL]={
            attackType:FighterAttackType.SPECIAL,
            init: this.handleSpecialInit.bind(this),
            update: this.handleSpecialState.bind(this),
            validFrom:[FighterState.IDLE,FighterState.WALK_FORWARD,FighterState.WALK_BACKWARD]
        }
        
    }
    handleSpecialInit(){
        this.resetVelocities();
    }
    handleSpecialState(time){
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
                    
                    if(this.slashCount%3===0){
                        this.changeState(FighterState.CROUCH_DOWN);
                    }

                    if(this.slashCount%2===0){
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
                    if(this.kickCount%2===0){ 
                        this.changeState(FighterState.CROUCH_DOWN); 
                    }
                    if(this.kickCount%1===0){
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
                    if(this.starCount%2===0){
                        this.changeState(FighterState.JUMP_FORWARD);
                    }
                    else if(Math.abs(this.position.x-this.opponent.position.x) <70)
                    {
                        this.changeState(getRandomAttackState());
                    }
                }
                this.keyYPressed=true;
            }
            else{
                this.keyYPressed=false
            }

            setTimeout(() => {
                if(Math.abs(this.position.x-this.opponent.position.x) >70 ){
                    this.changeState(FighterState.WALK_FORWARD);           
                }
            },5000)

            this.hitTimer++;
            if(this.hitTimer%200===0){// && inputKey.heldKeys.size===0
                if(Math.abs(this.position.x-this.opponent.position.x) <70 ){
                    this.changeState(getRandomAttackState());
                }
            }


    }
    handleWalkForwardState(){
        if(!this.isAnimationCompleted())return;
        this.changeState(FighterState.IDLE);
    }


}

