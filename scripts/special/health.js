import { FighterAttackType, GameView, NinjaStarState } from "../Constants.js";
import { getActualBoxDimensions ,boxOverlap} from "../collisions.js";

export class Health{
    image = document.querySelector('img[alt="healthPotion"]');
    
    animationFrame=0;

    constructor(fighter,time){
        this.frames = new Map([
            ['health',[[[79,23,101,133],[51,132]],[-15,-13,30,24],[-28,-20,56,30]]],

        ]);
        
        this.animations ={
            [NinjaStarState.ACTIVE]:[
                ['health',60],['health',60]
            ],
            [NinjaStarState.COLLIDED]:[
                [],[]
            ],
           
        }
        this.fighter=fighter;
        this.direction=1;
        
        this.position={
            x: 200,
            y: 40,
        };
        this.animationTimer = time.prevTime;
    }

    hasCollidedWithFighter(){
        const [x,y,width,height]= [-15,-13,30,24];

        const actualHitBox = getActualBoxDimensions(this.position,this.direction, {x,y,width,height});

        for(const push of this.fighter.boxes.push){
            const [x,y,width,height] =push;
            const actualFighterPushBox = getActualBoxDimensions(
                this.fighter.position,
                this.fighter.direction,
                {x,y,width,height}
            );

            if(boxOverlap(actualHitBox, actualFighterPushBox)) {
                return true;
            }
        }
        return false;
    }
    updateMovement(time){

        const hasCollided = this.hasCollidedWithFighter();
        if(!hasCollided) return;

        this.state = NinjaStarState.COLLIDED;
       
        gameState.fighters[this.fighter.playerId].hitPoints +=50
    }

    update(time){
        this.updateMovement(time);
    }

    draw(context){
        const [[
            [x,y,width,height],
            [originX,originY]
        ]]=[[79,23,101,133],[51,132]]

        context.drawImage(
                this.image,
                x,y,
                width,
                height,
                this.position.x - originX,
                this.position.y - originY,
                width,height
        );

    }
}