import { Ninja } from "./Ninja.js";
import { enemy1 } from "./Enemy.js";
import { Level1 } from "./Level1.js";
import { FighterDirection,GameView } from "./Constants.js";

window.addEventListener('load',function(){
    const canvas =document.querySelector("canvas");
    const context=canvas.getContext("2d");
    context.imageSmoothingEnabled=false;

    canvas.width=GameView.WIDTH;
    canvas.height=GameView.HEIGHT;

    const turtle=new enemy1(190,220,FighterDirection.LEFT);
    const player =new Ninja(90,220,FighterDirection.RIGHT);
    const level1= new Level1();

    let frameTime={
        prevTime: 0,
        secPassed:0
    }

    function animate(time){
        window.requestAnimationFrame(animate);

        frameTime={
            secPassed : (time - frameTime.prevTime) /1000,
            prevTime : time
        }
       // console.log(secPassed)

        player.update(frameTime,context);
        turtle.update(frameTime,context);

        level1.draw(context);
        player.draw(context);
        turtle.draw(context);

        //console.log(time);
    }
    window.requestAnimationFrame(animate);
});