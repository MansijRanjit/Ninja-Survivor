import { FighterDirection, FighterState, PUSH_FRICTION } from "./Constants.js";
import * as inputKey from "./InputKeys.js";
import { rectCollision } from "./collisions.js";

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

        this.opponent;
        this.pushBox= {x:0, y:0, width:0, height:0};

        this.states= {
            [FighterState.IDLE]:{
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom:[ FighterState.IDLE,FighterState.WALK_FORWARD,FighterState.WALK_BACKWARD,FighterState.JUMP_UP,FighterState.JUMP_FORWARD,FighterState.JUMP_BACKWARD,FighterState.CROUCH_UP]
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
        }

        this.changeState(FighterState.IDLE);
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

    //Calling rectCollision to check collision and returns bool value
    hasCollidedWithOpponent =() => rectCollision(
        this.position.x+this.pushBox.x,
        this.position.y+ this.pushBox.y,
        this.pushBox.width,
        this.pushBox.height,
        this.opponent.position.x + this.opponent.pushBox.x,
        this.opponent.position.y + this.opponent.pushBox.y,
        this.opponent.pushBox.width,
        this.opponent.pushBox.height
    )

    //returns direction to make fighter face each other
    getDirection(){
        if(this.position.x + this.pushBox.x +this.pushBox.width <= this.opponent.position.x + this.opponent.pushBox.x){
            return FighterDirection.RIGHT;
        }
        else if(this.position.x+this.pushBox.x>=this.opponent.position.x + this.opponent.pushBox.x + this.opponent.pushBox.width){
            return FighterDirection.LEFT;
        }
        return this.direction;
    }
    
    //returns push box coordinates
    getPushBox(frameKey){
        const [,[x,y,width,height]=[0,0,0,0]]= this.frames.get(frameKey);
        return {x,y,width,height};
    }

    //Changing currentState to newState and calling init() of the state
    changeState(newState){
        if(newState == this.currentState || !this.states[newState].validFrom.includes(this.currentState)) return;

        console.log(this.currentState)
        console.log(newState)
        this.currentState=newState;
        this.animationFrame=0;

        this.states[this.currentState].init();
    }

    handleIdleInit(){
        this.resetVelocities();
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

    updateLevelConstraints(time,context){
        //Preventing players to move outside canvas
        const [[[, , width]]]=this.frames.get(this.animations[this.currentState][this.animationFrame][0]);

        if(this.position.x + width/2 >= context.canvas.width){
            this.position.x= context.canvas.width-width;
        }
        if(this.position.x - width/2 <0){
            this.position.x=width;
        }

        //Prevent overlap on collision between fighters
        if(this.hasCollidedWithOpponent()){
            if(this.position.x <= this.opponent.position.x){
                this.position.x =Math.max(
                    (this.opponent.position.x + this.opponent.pushBox.x) - ( this.pushBox.x + this.pushBox.width),//this.pushBox.width
                )
                //Pushing opponent to right
                if([FighterState.IDLE,FighterState.CROUCH,FighterState.JUMP_UP,FighterState.JUMP_FORWARD,FighterState.JUMP_BACKWARD].includes(this.opponent.currentState)){
                    this.opponent.position.x += PUSH_FRICTION* time.secPassed;
                }
            }
            if(this.position.x >= this.opponent.position.x){
                this.position.x=Math.min(
                    (this.opponent.position.x + this.opponent.pushBox.x + this.opponent.pushBox.width
                        )+(this.pushBox.width + this.pushBox.x), context.canvas.width- this.pushBox.width
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
                this.pushBox= this.getPushBox(frameKey);
            }
    
           if(this.animationFrame>= animation.length)
           {
               this.animationFrame=0;
           }
        }
    }

    update(time, context){

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
    }

    //Placing + sign at origin
    drawDebug(context){
        const [frameKey]= this.animations[this.currentState][this.animationFrame];
        const pushBox= this.getPushBox(frameKey);

        context.lineWidth=1;

        //Push Box
        context.beginPath();
        context.strokeStyle ='#55FF55';
        context.fillStyle='#55FF5555';
        context.fillRect(
            Math.floor(this.position.x + pushBox.x)+0.5,
            Math.floor(this.position.y+ pushBox.y)+0.5,
            pushBox.width,
            pushBox.height,
        );
        context.rect(
            Math.floor(this.position.x + pushBox.x)+0.5,
            Math.floor(this.position.y +pushBox.y)+0.5,
            pushBox.width,
            pushBox.height,
        );
        context.stroke();

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
        
        //Drawing different size images for different statese
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