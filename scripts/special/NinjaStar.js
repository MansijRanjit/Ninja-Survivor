import { FighterAttackType, GameView, NinjaStarState } from "../Constants.js";
import { getActualBoxDimensions ,boxOverlap} from "../collisions.js";

export class NinjaStar{
    image = document.querySelector('img[alt="blueNinja"]');
    
    animationFrame=0;
    state=NinjaStarState.ACTIVE;

    constructor(fighter,strength,time,onEnd){
        this.frames = new Map([
            //Active
            ['star-1',[[[766,5779,13,13],[6,13]],[-15,-13,30,24],[-28,-20,56,30]]],
            ['star-2',[[[803,5780,14,14],[7,14]],[-15,-13,30,24],[-28,-20,56,30]]],

            //Collided
            ['collide-1',[[[71,6493,62,47],[31,48]],[-15,-13,30,24],[-28,-20,56,30]]],
        ]);
        
        this.animations ={
            [NinjaStarState.ACTIVE]:[
                ['star-1',60],['star-2',60]
            ],
            [NinjaStarState.COLLIDED]:[
                ['collide-1',2],['collide-1',-2]
            ],
        }
        this.fighter=fighter;
        this.onEnd =onEnd;
        this.velocity=250;//250
        this.direction = this.fighter.direction;
        this.position={
            x: this.fighter.position.x + (26 * this.direction),
            y: this.fighter.position.y -50,
        };
        this.animationTimer = time.prevTime;
    }

    hasCollidedWithOpponents(){
        const [x,y,width,height]= this.frames.get(this.animations[this.state][this.animationFrame][0])[1];

        const actualHitBox = getActualBoxDimensions(this.position,this.direction, {x,y,width,height});

        for(const hurt of this.fighter.opponent.boxes.hurt){
            const [x,y,width,height] =hurt;
            const actualOpponentsHurtBox = getActualBoxDimensions(
                this.fighter.opponent.position,
                this.fighter.opponent.direction,
                {x,y,width,height}
            );

            if(boxOverlap(actualHitBox, actualOpponentsHurtBox)) {
                return true;
            }
        }
        return false;
    }
    updateMovement(time){
        //movement of ninja star
        if(this.state !==NinjaStarState.ACTIVE) return;

        this.position.x += (this.velocity* this.direction) * time.secPassed;

         if(this.position.x > GameView.WIDTH || this.position.x <0){
             this.onEnd(this);
        }

        const hasCollided = this.hasCollidedWithOpponents();
        if(!hasCollided) return;

        this.state = NinjaStarState.COLLIDED;
        this.animationFrame=0;
        this.animationTimer = time.prevTime + this.animations[this.state][this.animationFrame][1] * 60;//Sets the animation timer based on the previous time, the animation frame duration, and a scaling factor (60)

        //Reduce opponents health on collision of star
        this.fighter.updateHealth(FighterAttackType.SPECIAL);
    }

    updateAnimation(time){
        if(time.prevTime < this.animationTimer) return;

        this.animationFrame +=1;
        if(this.animationFrame >= this.animations[this.state].length)
        {
            this.animationFrame=0;
            if(this.state === NinjaStarState.COLLIDED){
                this.onEnd(this);
            }
        }
        this.animationTimer = time.prevTime +this.animations[this.state][this.animationFrame][1] * 10;
    }

    update(time){
        this.updateMovement(time);
        this.updateAnimation(time);
    }

    draw(context){
        const [frameKey]=this.animations[this.state][this.animationFrame];//destructuring to extract first element of array
        const [[
            [x,y,width,height],
            [originX,originY]
        ]]=this.frames.get(frameKey);

        context.scale(this.direction,1);
        context.drawImage(
                this.image,
                x,y,
                width,
                height,
                Math.floor(this.position.x*this.direction) - originX, //drawing image making origin at base/feet
                Math.floor(this.position.y) - originY,
                width,height
        );
        context.setTransform(1,0,0,1,0,0);

    }
}