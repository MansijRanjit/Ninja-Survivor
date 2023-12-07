import { FighterDirection } from "./Constants.js";

export class Fighter{
    constructor(name,x,y,direction){
        this.name= name;
        this.image = new Image();
        this.position={x,y};
        this.direction=direction;
        this.velocity=150 * direction;

        this.frames=new Map();
        this.animationFrame=0;
        this.animationTimer=0;
        this.state=this.changeState();
        this.animations={};
    }

    changeState = ()=>
        this.velocity * this.direction < 0 ? 'walkBackward' : 'walkForward';

    update(time, context){
        const [[, , width]]=this.frames.get(this.animations[this.state][this.animationFrame]);

        //Adding delay of 60ms between Animation Frame
        if(time.prevTime > this.animationTimer + 60){
            this.animationTimer=time.prevTime;
            this.animationFrame++;
    
           if(this.animationFrame>4)
           {
               this.animationFrame=0;
           }

        }

        this.position.x += this.velocity *time.secPassed;

        if(this.position.x + width/2 >= context.canvas.width){
            this.velocity= -150;
            this.state=this.changeState();
        }
        if(this.position.x - width/2 <0){
            this.velocity = 150;
            this.state=this.changeState();
        }
    }

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
        ]=this.frames.get(this.animations[this.state][this.animationFrame]);

        context.scale(this.direction,1);
        context.drawImage(
            this.image,
            x,y,
            width,
            height,
            Math.floor(this.position.x*this.direction) - originX,
            Math.floor(this.position.y) - originY,
            72,80
        );
        context.setTransform(1,0,0,1,0,0);

        this.drawDebug(context);
    }
}