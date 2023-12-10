import { Ninja } from "./Ninja.js";
import { enemy1 } from "./Enemy.js";
import { Level1 } from "./Level1.js";
import { FighterDirection,GameView } from "./Constants.js";
import { inputKeyboardEvents } from "./InputKeys.js";
import { StatusBar } from "./overlays/StatusBar.js";

window.addEventListener('load',function(){
    const canvas =document.querySelector("canvas");
    const context=canvas.getContext("2d");
    context.imageSmoothingEnabled=false; //remove blur effect

    canvas.width=GameView.WIDTH;
    canvas.height=GameView.HEIGHT;

    const player =new Ninja(90,220,FighterDirection.RIGHT,0);
    const turtle=new enemy1(190,220,FighterDirection.LEFT,1);
    const level1= new Level1();

    this.fighters=[
        player,turtle
    ]
    const statusBar= new StatusBar(this.fighters);

    //placing opponrnts for adjusting directions
    player.opponent=turtle;
    turtle.opponent=player;
    
    inputKeyboardEvents();

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

        statusBar.update(frameTime);
        statusBar.draw(context);

        //console.log(time);
    }
    window.requestAnimationFrame(animate);
});