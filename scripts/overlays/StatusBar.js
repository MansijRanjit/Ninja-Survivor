import { HEALTH_DAMAGE_COLOR, HEALTH_MAX_HIT_POINTS } from "../Constants.js";
import { gameState } from "../state/gameState.js";

export class StatusBar{
    constructor(fighters){
        this.image= document.querySelector('img[alt="miscellaneous"]');

        this.time=99;
        this.timeTimer=0;
        this.fighters=fighters;

        this.healthBars=[{
            timer:0,
            hitPoints:HEALTH_MAX_HIT_POINTS,
        }, {
            timer:0,
            hitPoints:HEALTH_MAX_HIT_POINTS,
        }]
        this.frames=new Map([
            ['health-bar',[17,19,144,9]],

            ['time-0',[16,32,12,14]],
            ['time-1',[34,32,9,14]],
            ['time-2',[48,32,13,14]],
            ['time-3',[64,32,13,14]],
            ['time-4',[80,32,13,14]],
            ['time-5',[96,32,13,14]],
            ['time-6',[112,32,12,14]],
            ['time-7',[128,32,13,14]],
            ['time-8',[144,32,12,14]],
            ['time-9',[160,32,12,14]],
        ])
    }

    updateHealthBars(time){
        for (const index in this.healthBars){
            if(this.healthBars[index].hitPoints <= gameState.fighters[index].hitPoints) continue;
            //reduce healthBars until it becomeless or equal to  fighter hitpoints
            this.healthBars[index].hitPoints = Math.max(0, this.healthBars[index].hitPoints - (time.secPassed*90))
        }
    }

    update(frameTime){
        //Update Time
        if(frameTime.prevTime > this.timeTimer+600){
            if(this.time >0) this.time -=1;
            this.timeTimer=frameTime.prevTime;
        }

        //Update Health bars
        this.updateHealthBars(frameTime);
    }
    
    drawFrame(context,frameKey,x,y,direction=1){
        const [sourceX,sourceY,sourceWidth,sourceHeight]= this.frames.get(frameKey);

        context.scale(direction,1);
        context.drawImage(
            this.image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            x*direction,
            y,
            sourceWidth,
            sourceHeight
        )
        context.setTransform(1,0,0,1,0,0);
    }
    drawHealthBar(context){
        this.drawFrame(context,'health-bar',31,20,1);//left health bar
        this.drawFrame(context,'health-bar',353,20,-1);//right health bar

        context.fillStyle= HEALTH_DAMAGE_COLOR;
        context.beginPath();
        context.fillRect(
            31,20,
            HEALTH_MAX_HIT_POINTS-Math.floor(this.healthBars[0].hitPoints),
            9
        );
        context.fillRect(
            209+Math.floor(this.healthBars[1].hitPoints),20,
            HEALTH_MAX_HIT_POINTS-Math.floor(this.healthBars[1].hitPoints),
            9
        );
    }
    draw(context){
        this.drawHealthBar(context);

        const timeString = String(this.time).padStart(2,'00');

        this.drawFrame(context,`time-${timeString.charAt(0)}`,178,20);
        this.drawFrame(context,`time-${timeString.charAt(1)}`,194,20);
    }
}