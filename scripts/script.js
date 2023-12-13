import { Ninja } from "./Ninja.js";
import { enemy1 } from "./Enemy.js";
import { Level1 } from "./Level1.js";
import { FighterDirection,GameView } from "./Constants.js";
import { inputKeyboardEvents } from "./InputKeys.js";
import { StatusBar } from "./overlays/StatusBar.js";
import { BattleScene } from "./scenes/BattleScene.js";

window.addEventListener('load',function(){
    const canvas =document.querySelector("canvas");
    const context=canvas.getContext("2d");
    context.imageSmoothingEnabled=false; //remove blur effect

    canvas.width=GameView.WIDTH;
    canvas.height=GameView.HEIGHT;

     const menuContainer = document.getElementById('menu-container');
    // const multiplayerStartButton = document.getElementById('multiplayerStart-button');

    // const vsComputerStartButton = document.getElementById('vsComputerStart-button');

    // // Hide canvas and show menu initially
    // canvas.style.display = 'none';
    // menuContainer.style.display = 'flex';

    // // Handle Start Game Multiplayer button click
    // multiplayerStartButton.addEventListener('click', function () {
    //     // Show canvas and hide menu on button click
    //     canvas.style.display = 'block';
    //     menuContainer.style.display = 'none';

    //     // Start the game in multiplayer mode
    //     startMultiplayerGame();
    // });

    menuContainer.style.display = 'none';
    startMultiplayerGame();

    function startMultiplayerGame(){
        const scene=new BattleScene();
    
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
    
            scene.update(frameTime,context);
            scene.draw(context);
        }
        window.requestAnimationFrame(animate);
    }
    
});