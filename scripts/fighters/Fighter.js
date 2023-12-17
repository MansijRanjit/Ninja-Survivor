import { FighterAttackBaseData, FighterAttackType, FighterDirection, FighterState, PUSH_FRICTION } from "../Constants.js";
import * as inputKey from "../InputKeys.js";
import { Control } from "../KeysControl.js";
import { boxOverlap, getActualBoxDimensions, rectCollision } from "../collisions.js";
import { StatusBar } from "../overlays/StatusBar.js";
import { gameState } from "../state/gameState.js";

export class Fighter{
    constructor(name,x,y,direction,playerId){
        this.name= name;
        this.image = new Image();
        this.position={x,y};
        this.direction=direction;
        this.velocity={x:0, y:0};

        this.playerId=playerId;

        this.frames=new Map();
        this.animationFrame=0;
        this.animationTimer=0;
        this.animations={};

        this.initialVelocity={
            x:{
                [FighterState.WALK_FORWARD]:200,
                [FighterState.WALK_BACKWARD]:-150,
                [FighterState.JUMP_FORWARD]:170,
                [FighterState.JUMP_BACKWARD]:-200,
            },
            jump:-500
        };
        this.gravity=1000;
        this.currentState=FighterState.IDLE;//self
        this.attackStruck=false;

        this.opponent;
        this.boxes ={
            push: {x:0, y:0, width:0, height:0},
            hurt:[[0,0,0,0],[0,0,0,0],[0,0,0,0]],
            hit: {x:0, y:0, width:0, height:0},
        }
        this.states= {
            [FighterState.IDLE]:{
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom:[ FighterState.IDLE,FighterState.WALK_FORWARD,FighterState.WALK_BACKWARD,FighterState.JUMP_UP,FighterState.JUMP_FORWARD,FighterState.JUMP_BACKWARD,FighterState.CROUCH_UP,FighterState.SLASH,FighterState.KICK,FighterState.HURT,FighterState.SPECIAL]
            },
            [FighterState.WALK_FORWARD]:{
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkForwardState.bind(this),
                validFrom:[FighterState.IDLE,FighterState.WALK_BACKWARD]//transition is valid from these states only
            },
            [FighterState.WALK_BACKWARD]:{
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkBackwardState.bind(this),
                validFrom:[FighterState.IDLE,FighterState.WALK_FORWARD]
            },
            [FighterState.JUMP_UP]:{
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom:[FighterState.IDLE]
            },
            [FighterState.JUMP_FORWARD]:{
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD]
            },
            [FighterState.JUMP_BACKWARD]:{
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE,FighterState.WALK_BACKWARD]
            },
            [FighterState.CROUCH]:{
                init: ()=>{},
                update:this.handleCrouchState.bind(this),
                validFrom:[FighterState.CROUCH_DOWN]
            },
            [FighterState.CROUCH_DOWN]:{
                init: this.handleCrouchDownInit.bind(this),
                update: this.handleCrouchDownState.bind(this),
                validFrom:[FighterState.IDLE,FighterState.WALK_BACKWARD,FighterState.WALK_FORWARD]
            },
            [FighterState.CROUCH_UP]:{
                init: ()=>{},
                update: this.handleCrouchUpState.bind(this),
                validFrom:[FighterState.CROUCH]
            },
            [FighterState.SLASH]:{
                attackType:FighterAttackType.SLASH,
                init: this.handleSlashInit.bind(this),
                update:this.handleSlashState.bind(this),
                validFrom:[FighterState.IDLE,FighterState.WALK_BACKWARD,FighterState.WALK_FORWARD]
            },
            [FighterState.KICK]:{
                attackType:FighterAttackType.KICK,
                init: this.handleKickInit.bind(this),
                update: this.handleKickState.bind(this),
                validFrom:[FighterState.IDLE,FighterState.WALK_BACKWARD,FighterState.WALK_FORWARD]
            },
            [FighterState.HURT]:{
                init:this.handleHurtInit.bind(this),
                update:this.handleHurtState.bind(this),
                validFrom:[FighterState.IDLE,FighterState.WALK_FORWARD,FighterState.WALK_BACKWARD]
            },
        }
    }

    //Resets Velocities
    resetVelocities(){
        this.velocity.x=0;
        this.velocity.y=0
    }

    //Checking if the animation is the last one
    isAnimationCompleted(){
        return this.animations[this.currentState][this.animationFrame][1] === -2
    }

    //Calling rectCollision in collision.js to check collision  and returns bool value
    hasCollidedWithOpponent =() => rectCollision(
        this.position.x+this.boxes.push.x,
        this.position.y+ this.boxes.push.y,
        this.boxes.push.width,
        this.boxes.push.height,
        this.opponent.position.x + this.opponent.boxes.push.x,
        this.opponent.position.y + this.opponent.boxes.push.y,
        this.opponent.boxes.push.width,
        this.opponent.boxes.push.height
    )

    //returns direction to make fighter face each other
    getDirection(){
        if(this.position.x + this.boxes.push.x +this.boxes.push.width <= this.opponent.position.x + this.opponent.boxes.push.x){
            return FighterDirection.RIGHT;
        }
        else if(this.position.x+this.boxes.push.x>=this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width){
            return FighterDirection.LEFT;
        }
        return this.direction;
    }
    
    //returns push/hurt/hit box coordinates
    getBoxes(frameKey){
        const [,
            [x=0,y=0,width=0,height=0]=[],
            [head=[0,0,0,0],body=[0,0,0,0],feet=[0,0,0,0]] =[],
            [hitX=0,hitY=0,hitWidth=0,hitHeight=0]=[],    
    ]= this.frames.get(frameKey);
        return{
            push: {x,y,width,height},
            hurt: [head,body,feet],
            hit:{x:hitX,y:hitY,width:hitWidth,height:hitHeight}
        } 
    }

    //Changing currentState to newState and calling init() of the state
    changeState(newState){
        if(newState == this.currentState || !this.states[newState].validFrom.includes(this.currentState)) return;

       // console.log(this.currentState)
       // console.log(newState)
        this.currentState=newState;
        this.animationFrame=0;

        this.states[this.currentState].init();
    }

    handleIdleInit(){
        this.resetVelocities();
        this.attackStruck=false;
    }
    handleMoveInit(){
        this.velocity.x =this.initialVelocity.x[this.currentState] ?? 0;// returns 0 when the left-hand operand is null or undefined. If the initial velocity for the current state is not defined, it will default to 0

    }
    handleJumpInit(){
        this.velocity.y=this.initialVelocity.jump;
        //console.log(this.velocity.y);

        this.handleMoveInit();
    }
    handleCrouchDownInit(){
        this.resetVelocities();
    }
    handleSlashInit(){
        this.resetVelocities();
    }
    handleKickInit(){
        this.resetVelocities();
    }
    handleHurtInit(){
        this.resetVelocities();
    }

    handleIdleState(){
        if(inputKey.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_UP);
        }
        else if(inputKey.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }
        else if(inputKey.isBackward(this.playerId,this.direction)){
            this.changeState(FighterState.WALK_BACKWARD);   
        } 
        else if(inputKey.isForward(this.playerId,this.direction)) {
            this.changeState(FighterState.WALK_FORWARD);
        }
        else if(inputKey.isSlash(this.playerId)){
            this.changeState(FighterState.SLASH);
        }
        else if(inputKey.isKick(this.playerId)){
            this.changeState(FighterState.KICK);
        }
        else if(inputKey.isSpecial(this.playerId)){
            setTimeout(()=>{this.changeState(FighterState.SPECIAL);},500)
            //this.changeState(FighterState.SPECIAL);
        }
    }

    handleWalkForwardState(){
        if(!inputKey.isForward(this.playerId,this.direction)) {
            this.changeState(FighterState.IDLE);
        }
        else if(inputKey.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_FORWARD);
        }
        else if(inputKey.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }
        else if(inputKey.isSlash(this.playerId)){
            this.changeState(FighterState.SLASH);
        }
        else if(inputKey.isKick(this.playerId)){
            this.changeState(FighterState.KICK);
        }
    }

    handleWalkBackwardState(){
        if(!inputKey.isBackward(this.playerId,this.direction)) {
            this.changeState(FighterState.IDLE);
        }
        else if(inputKey.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_BACKWARD);
        }
        else if(inputKey.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }
        else if(inputKey.isSlash(this.playerId)){
            this.changeState(FighterState.SLASH);
        }
        else if(inputKey.isKick(this.playerId)){
            this.changeState(FighterState.KICK);
        }
    }

    handleJumpState(time){
        this.velocity.y += this.gravity * time.secPassed;

        if(this.position.y > 220){//floor position=220
            this.position.y=220,
            this.changeState(FighterState.IDLE);
        }
    }

    handleCrouchState(){
        if(!inputKey.isDown(this.playerId)) this.changeState(FighterState.CROUCH_UP);
    }
    handleCrouchDownState(){
        if(this.isAnimationCompleted()){
            this.changeState(FighterState.CROUCH);
        }
    }
    handleCrouchUpState(){
        if(this.isAnimationCompleted()){
            this.changeState(FighterState.IDLE);
        }
    }
    handleSlashState(){
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);
    }
    handleKickState(){
        if(!this.isAnimationCompleted())return;
        this.changeState(FighterState.IDLE);
    }
    handleHurtState(){
        if(!this.isAnimationCompleted())return;
        this.changeState(FighterState.IDLE);
    }

    updateLevelConstraints(time,context){
        //Preventing players to move outside canvas
        const [[[, , width]]]=this.frames.get(this.animations[this.currentState][this.animationFrame][0]);

        if(this.position.x + width/2 >= context.canvas.width){
            this.position.x= context.canvas.width-width/2;
        }
        if(this.position.x - width/2 <0){
            this.position.x=width/2;
        }

        //Prevent overlap on collision between fighters
        if(this.hasCollidedWithOpponent()){
            if(this.position.x <= this.opponent.position.x){
                this.position.x =Math.max(
                    (this.opponent.position.x + this.opponent.boxes.push.x) - ( this.boxes.push.x + this.boxes.push.width),//this.boxes.push.width
                )
                //Pushing opponent to right
                if([FighterState.IDLE,FighterState.CROUCH,FighterState.JUMP_UP,FighterState.JUMP_FORWARD,FighterState.JUMP_BACKWARD].includes(this.opponent.currentState)){
                    this.opponent.position.x += PUSH_FRICTION* time.secPassed;
                }
            }
            if(this.position.x >= this.opponent.position.x){
                this.position.x=Math.min(
                    (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width
                        )+(this.boxes.push.width + this.boxes.push.x), context.canvas.width- this.boxes.push.width
                )
                //Pushing opponent to left
                if([FighterState.IDLE,FighterState.CROUCH,FighterState.JUMP_UP,FighterState.JUMP_FORWARD,FighterState.JUMP_BACKWARD].includes(this.opponent.currentState)){
                    this.opponent.position.x -= PUSH_FRICTION* time.secPassed;
                }
            }
        }
    }

    updateAnimation(time){
        //Adding delay of frameDelay miliseconds between Animation Frame ,and updating animation frame

        const animation= this.animations[this.currentState];
        const [frameKey,frameDelay]=animation[this.animationFrame];

        if(time.prevTime > this.animationTimer + frameDelay){
            this.animationTimer=time.prevTime;

            if(frameDelay>0){
                this.animationFrame++;
                this.boxes= this.getBoxes(frameKey);
            }
    
           if(this.animationFrame>= animation.length)
           {
               this.animationFrame=0;
           }
        }
    }

    updateAttackBoxCollided(time){
        if(!this.states[this.currentState].attackType || this.attackStruck) return;//if box is not attack,then returns

        const actualHitBox= getActualBoxDimensions(this.position,this.direction,this.boxes.hit);

        for(const hurt of this.opponent.boxes.hurt){
            const [x,y,width,height] =hurt;
            const actualOpponentsHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                {x,y,width,height}
            );

            if(boxOverlap(actualHitBox, actualOpponentsHurtBox)) { 
                const attack=this.states[this.currentState].attackType;
                
                if(gameState.fighters[this.opponent.playerId].hitPoints >0 && gameState.fighters[this.playerId].hitPoints >0){
                    this.updateHealth(attack);
                }
                
                //const hurtIndex = this.opponent.boxes.hurt.indexOf(hurt);
                // console.log(`${this.name} has hit ${this.opponent.name}'s ${hurtIndex}`);

                this.attackStruck=true;
                return;
            }
        }
    }

    updateHealth(attack){
            this.opponent.changeState(FighterState.HURT)//change opponent state to hurt if attack connects

            gameState.fighters[this.opponent.playerId].hitPoints -=FighterAttackBaseData[attack].damage;
    }

    update(time, context,timer){
        this.position.x += (this.velocity.x * this.direction) *time.secPassed;
        this.position.y += this.velocity.y *time.secPassed;

        //changing direction of fighters on changing positions
        if(
            [FighterState.IDLE,FighterState.WALK_FORWARD,FighterState.WALK_BACKWARD].includes(this.currentState)
        ){
            this.direction=this.getDirection();
        }

        this.states[this.currentState].update(time,context);//calls  update: ..State()
        this.updateAnimation(time);
        this.updateLevelConstraints(time,context);
        this.updateAttackBoxCollided(time);
        /////////////////////
        this.timer=timer;
    
    }

    //drawing boxes
    drawDebugBox(context,dimensions,baseColor){
        if(!Array.isArray(dimensions)) return;//returns if dimensions not in array format
        
        const[x=0, y=0, width=0, height=0]= dimensions;

        context.beginPath();
        context.strokeStyle =baseColor+'AA';
        context.fillStyle=baseColor+'44';
        context.fillRect(
            Math.floor(this.position.x +(x*this.direction))+0.5,
            Math.floor(this.position.y+y)+0.5,
            width*this.direction,
            height,
        );
        context.rect(
            Math.floor(this.position.x + (x*this.direction))+0.5,
            Math.floor(this.position.y +y)+0.5,
            width*this.direction,
            height,
        );
        context.stroke();
    }

    //Placing + sign at origin and placing boxes
    drawDebug(context){
        const [frameKey]= this.animations[this.currentState][this.animationFrame];
        const boxes= this.getBoxes(frameKey);

        context.lineWidth=1;

        //Push Box
        this.drawDebugBox(context,[boxes.push.x,boxes.push.y,boxes.push.width,boxes.push.height],'#55FF55');

        //Hurt Box
        for (const hurtBox of boxes.hurt){
            this.drawDebugBox(context,hurtBox,'#7777FF');
        }

        //Hit Box
        this.drawDebugBox(context,[boxes.hit.x,boxes.hit.y,boxes.hit.width,boxes.hit.height],'#FF0000');
        
        //Origin
        context.beginPath();
        context.strokeStyle="white";
        context.moveTo(Math.floor(this.position.x) -4, Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x) +5 , Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x),Math.floor(this.position.y)-5);
        context.lineTo(Math.floor(this.position.x),Math.floor(this.position.y)+4)
        context.stroke();
    }

    draw(context){
        const [frameKey]=this.animations[this.currentState][this.animationFrame];//destructuring to extract first element of array
        const [[
            [x,y,width,height],
            [originX,originY]
        ]]=this.frames.get(frameKey);

        context.scale(this.direction,1);
        
        //Drawing different size images for different states
        if(this.currentState==FighterState.JUMP_FORWARD || this.currentState== FighterState.JUMP_BACKWARD){
            context.drawImage(
                this.image,
                x,y,
                width,
                height,
                Math.floor(this.position.x*this.direction) - originX, //drawing image making origin at base/feet
                Math.floor(this.position.y) - originY,
                47,55
            );
        }
        else if(this.currentState== FighterState.JUMP_UP){
            context.drawImage(
                this.image,
                x,y,
                width,
                height,
                Math.floor(this.position.x*this.direction) - originX,
                Math.floor(this.position.y) - originY,
                60,68
            );
        }
        else if(this.currentState== FighterState.CROUCH|| this.currentState==FighterState.CROUCH_DOWN || this.currentState==FighterState.CROUCH_UP){
            context.drawImage(
                this.image,
                x,y,
                width,
                height,
                Math.floor(this.position.x*this.direction) - originX,
                Math.floor(this.position.y) - originY,
                57,55
            );
        }
        else{
            context.drawImage(
                this.image,
                x,y,
                width,
                height,
                Math.floor(this.position.x*this.direction) - originX,
                Math.floor(this.position.y) - originY,
                72,80
            );
        }
        context.setTransform(1,0,0,1,0,0);

        this.drawDebug(context);
    }
}