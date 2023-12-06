import { Ninja } from "./Ninja.js";
import { enemy1 } from "./Enemy.js";
import { Level1 } from "./Level1.js";

const GameView={
    HEIGHT:222,
    WIDTH:384
}

window.addEventListener('load',function(){
    const canvas =document.querySelector("canvas");
    const context=canvas.getContext("2d");

    canvas.width=GameView.WIDTH;
    canvas.height=GameView.HEIGHT;

    const turtle=new enemy1(90,130,150);
    const player =new Ninja(90,130,-150);
    const level1= new Level1();

    let prevTime=0;
    let secPassed=0;

    function animate(time){
        window.requestAnimationFrame(animate);

        secPassed=(time - prevTime) /1000;
        prevTime=time;
       // console.log(secPassed)

        player.update(secPassed,context);
        turtle.update(secPassed,context);

        level1.draw(context);
        player.draw(context);
        turtle.draw(context);

        //console.log(time);
    }
    window.requestAnimationFrame(animate);
});