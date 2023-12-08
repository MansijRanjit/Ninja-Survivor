import { FighterDirection, FighterState } from "./Constants.js";

export class Fighter{
    constructor(name,x,y,direction){
        this.name= name;
        this.image = new Image();
        this.position={x,y};
        this.direction=direction;
        this.velocity={x:0, y:0};

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

        this.states= {
            [FighterState.IDLE]:{
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom:[ FighterState.IDLE,FighterState.WALK_FORWARD,FighterState.WALK_BACKWARD,FighterState.JUMP_UP,FighterState.JUMP_FORWARD,FighterState.JUMP_BACKWARD]
            },
            [FighterState.WALK_FORWARD]:{
                init: this.handleWalkInit.bind(this),
                update: this.handleWalkState.bind(this),
                validFrom:[FighterState.IDLE,FighterState.WALK_BACKWARD]//transition is valid from these states only
            },
            [FighterState.WALK_BACKWARD]:{
                init: this.handleWalkInit.bind(this),
                update: this.handleWalkState.bind(this),
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
            }
        }

        this.changeState(FighterState.JUMP_FORWARD);
    }

    changeState(newState){
        if(newState == this.currentState || !this.states[newState].validFrom.includes(this.currentState)) return;

        console.log(newState)
        console.log(this.currentState)
        this.currentState=newState;
        this.animationFrame=0;

        this.states[this.currentState].init();
    }

    handleIdleInit(){
        this.velocity.x=0;
        this.velocity.y=0
    }

    handleIdleState(){

    }

    handleWalkInit(){
        this.velocity.x =this.initialVelocity.x[this.currentState] ?? 0;// returns 0 when the left-hand operand is null or undefined. If the initial velocity for the current state is not defined, it will default to 0

    }

    handleWalkState(){

    }


    handleJumpInit(){
        this.velocity.y=this.initialVelocity.jump;
        //console.log(this.velocity.y);

        this.handleWalkInit();
    }

    handleJumpState(time){
        this.velocity.y += this.gravity * time.secPassed;

        if(this.position.y > 220){
            this.position.y=220,
            this.changeState(FighterState.IDLE);
        }

    }
    updateLevelConstraints(context){
        //Preventing players to move outside canvas

        const [[, , width]]=this.frames.get(this.animations[this.currentState][this.animationFrame]);

        if(this.position.x + width/2 >= context.canvas.width){
            this.position.x= context.canvas.width-width;
        }
        if(this.position.x - width/2 <0){
            this.position.x=width;
        }

    }

    updateAnimation(time){
        //Adding delay of 60ms between Animation Frame
    
        if(time.prevTime > this.animationTimer + 260){
            this.animationTimer=time.prevTime;
            this.animationFrame++;
    
           if(this.animationFrame>= this.animations[this.currentState].length)
           {
               this.animationFrame=0;
           }
        }
    }

    update(time, context){

        this.position.x += (this.velocity.x * this.direction) *time.secPassed;
        this.position.y += this.velocity.y *time.secPassed;

        this.states[this.currentState].update(time,context);//calls handle JumpUpState()
        this.updateAnimation(time);
        this.updateLevelConstraints(context);
    }

    //Placing + sign at origin
    drawDebug(context){
        context.lineWidth=1;

        context.beginPath();
        context.strokeStyle="white";
        context.moveTo(Math.floor(this.position.x) -5.5, Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x) +4.5 , Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x),Math.floor(this.position.y)-5.5);
        context.lineTo(Math.floor(this.position.x),Math.floor(this.position.y)+4.5)
        context.stroke();
    }

    draw(context){
        const [
            [x,y,width,height],
            [originX,originY]
        ]=this.frames.get(this.animations[this.currentState][this.animationFrame]);

        context.scale(this.direction,1);
        
        if(this.currentState==FighterState.JUMP_FORWARD || this.currentState== FighterState.JUMP_BACKWARD){
            context.drawImage(
                this.image,
                x,y,
                width,
                height,
                Math.floor(this.position.x*this.direction) - originX,
                Math.floor(this.position.y) - originY,
                47,55
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