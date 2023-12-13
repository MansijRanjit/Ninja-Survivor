import {  GameView, HEALTH_MAX_HIT_POINTS } from "./Constants.js";
import { heldKeys, inputKeyboardEvents, pressedKeys } from "./InputKeys.js";
import { BattleScene } from "./scenes/BattleScene.js";
import { gameState } from "./state/gameState.js";

window.addEventListener("load", function () {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false; //remove blur effect

    canvas.width = GameView.WIDTH;
    canvas.height = GameView.HEIGHT;

    //Menu display items
    const menuContainer = document.getElementById("menu-container");
    const multiplayerStartButton = document.getElementById("multiplayerStart-button");
    const vsComputerStartButton = document.getElementById("vsComputerStart-button");

    //Result display items
    const winnerDisplay = document.getElementById("winner-display");
    const playAgainButton = document.getElementById("play-again-button");
    const returnToMenuButton = document.getElementById( "return-to-menu-button");
    const gameOverContainer=document.querySelector(".game-over-container");

    // Hide canvas and show menu initially
    canvas.style.display = "none";
    menuContainer.style.display = "flex";

    // Handle Start Game:Multiplayer button click
    multiplayerStartButton.addEventListener("click", 
    startMultiplayerGame);

    function startMultiplayerGame() {
        // Show canvas and hide menu on button click
        canvas.style.display = "block";
        menuContainer.style.display = "none";

        const scene = new BattleScene();

        inputKeyboardEvents();

        let frameTime = {
        prevTime: 0,
        secPassed: 0,
        };

        let animationFrameId;

        function animate(time) {
            animationFrameId=window.requestAnimationFrame(animate);
            frameTime = {
                secPassed: (time - frameTime.prevTime) / 1000,
                prevTime: time,
            };
            //console.log(time);/////////

            scene.draw(context);
            scene.update(frameTime, context);

            //console.log(scene.isEnded);
            if(scene.isEnded){
                gameEnd();
            }
        }
        window.requestAnimationFrame(animate);
        
        //After game over
        function gameEnd()
        {
            if (scene.timer <= 0) {
                if (gameState.fighters[0].hitPoints > gameState.fighters[1].hitPoints) {
                    //scene.statusBar.time = 0;
                    winnerDisplay.textContent = `Player 1 wins`;
                    drawPlayer1(context);
                } 
                else if (
                gameState.fighters[1].hitPoints > gameState.fighters[0].hitPoints
                ) {
                    winnerDisplay.textContent = `Player 2 wins`;
                } 
                else {
                    winnerDisplay.textContent = `Draw`;
                }
            }
            if (gameState.fighters[0].hitPoints <= 0) {
                winnerDisplay.textContent = `Player 2 wins`;
            } 
            else if (gameState.fighters[1].hitPoints <= 0) {
                winnerDisplay.textContent = `Player 1 wins`;
               // drawPlayer1(context);
            }
    
            // Hide the canvas
            const canvas = document.querySelector("canvas");
            canvas.style.display = 'none';
            
            // Show the winner display and buttons
            gameOverContainer.style.display = "flex";
    
            playAgainButton.addEventListener("click", playAgain);    
            returnToMenuButton.addEventListener("click",moveToMenu);
        }
    
        function playAgain()
        {
            resetGame();

            //hide the results and buttons
            gameOverContainer.style.display = "none";

            context.clearRect(0,0,canvas.width,canvas.height);
            canvas.style.display="block";
    
        }
    
        function moveToMenu(){
            //Cancel the previous animation frame request
            window.cancelAnimationFrame(animationFrameId);

            resetGame();

            gameOverContainer.style.display = "none";
    
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            menuContainer.style.display = "flex";
        }
    
        function resetGame(){
            //health bar display reset
            scene.statusBar.healthBars[0].hitPoints=HEALTH_MAX_HIT_POINTS;
            scene.statusBar.healthBars[1].hitPoints=HEALTH_MAX_HIT_POINTS;
    
            //fighter health reset
            gameState.fighters[0].hitPoints=HEALTH_MAX_HIT_POINTS;
            gameState.fighters[1].hitPoints=HEALTH_MAX_HIT_POINTS;
    
            //timer reset
            scene.statusBar.time=99;
            
            //clear hold keys set
            heldKeys.clear();
            pressedKeys.clear();
    
            //Set Game Ended false
            scene.isEnded=false;
        }  
        // function drawPlayer1(context){
        //     console.log("cool")
        //     const image=document.querySelector('img[alt="ninja"]');
        //     context.drawImage(
        //         image,
        //         90,20,
        //         60,60
        //     )
        // }
    }
     
   
});


