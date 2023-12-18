import { GameView, HEALTH_MAX_HIT_POINTS } from "./Constants.js";
import { heldKeys, inputKeyboardEvents, pressedKeys } from "./InputKeys.js";
import { BattleScene } from "./scenes/BattleScene.js";
import { vsCompBattleScene } from "./scenes/vsCompBattleScene.js";
import { gameState } from "./state/gameState.js";

window.addEventListener("load", function () {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false; //remove blur effect

  canvas.width = GameView.WIDTH;
  canvas.height = GameView.HEIGHT;

  //Menu display items
  const menuContainer = document.getElementById("menu-container");
  const multiplayerStartButton = document.getElementById(
    "multiplayerStart-button"
  );
  const vsComputerStartButton = document.getElementById(
    "vsComputerStart-button"
  );
  const controls = this.document.getElementById("controls");

  //Sounds
  const menuMusic= this.document.getElementById("menuSound");
  const musicFight =document.querySelector("#ninjaSound")

  //Result display items
  const winnerDisplay = document.getElementById("winner-display");
  const playAgainButton = document.getElementById("play-again-button");
  const returnToMenuButton = document.getElementById("return-to-menu-button");
  const gameOverContainer = document.querySelector(".game-over-container");
  const controlsContainer = this.document.getElementById("controls-container");

  // Hide canvas and show menu initially
  canvas.style.display = "none";
  menuContainer.style.display = "flex";

  // Handle Start Game:Multiplayer button click
  multiplayerStartButton.addEventListener("click", startMultiplayerGame);

  // Handle Start Game:vsComputer button click
  vsComputerStartButton.addEventListener("click", startvsComputerGame);

  //Handle Controls Display
  controls.addEventListener("click",showControls);
  function showControls(){
    menuMusic.play();
    musicFight.pause();
    musicFight.currentTime=0;

    controlsContainer.style.display ="flex";
    menuContainer.style.display="none"

    document.getElementById("return-menu").addEventListener("click", ()=>{
      menuContainer.style.display = "flex";
      controlsContainer.style.display="none";
    });

  }
  ////
  //Multiplayer Mode
  function startMultiplayerGame() {

    menuMusic.pause();
    menuMusic.currentTime=0;
    musicFight.play();

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
      animationFrameId = window.requestAnimationFrame(animate);
      frameTime = {
        secPassed: (time - frameTime.prevTime) / 1000,
        prevTime: time,
      };

      scene.draw(context);
      scene.update(frameTime, context);

      if (scene.isEnded) {
        gameEnd();
      }
    }
    window.requestAnimationFrame(animate);

    //After game over
    function gameEnd() {
      menuMusic.pause();
      menuMusic.currentTime = 0;
      musicFight.pause();
      musicFight.currentTime = 0;

      const image1 = document.querySelector('img[alt="ninja"]');
      const image2 = document.querySelector('img[alt="turtle"]');
      image1.style.display = "none";
      image2.style.display = "none";

      if (scene.timer <= 0) {
        if (gameState.fighters[0].hitPoints > gameState.fighters[1].hitPoints) {
          //scene.statusBar.time = 0;
          winnerDisplay.textContent = `Player 1 wins`;
          drawPlayer(image1);
        } else if (
          gameState.fighters[1].hitPoints > gameState.fighters[0].hitPoints
        ) {
          winnerDisplay.textContent = `Player 2 wins`;
          drawPlayer(image2);
        } else {
          winnerDisplay.textContent = `Draw`;
        }
      }
      if (gameState.fighters[0].hitPoints <= 0) {
        winnerDisplay.textContent = `Player 2 wins`;
        drawPlayer(image2);
      } else if (gameState.fighters[1].hitPoints <= 0) {
        winnerDisplay.textContent = `Player 1 wins`;
        drawPlayer(image1);
      }

      // Hide the canvas
      const canvas = document.querySelector("canvas");
      canvas.style.display = "none";

      // Show the winner display and buttons
      gameOverContainer.style.display = "flex";

      playAgainButton.addEventListener("click", playAgain);
      returnToMenuButton.addEventListener("click", moveToMenu);
    }

    function playAgain() {
      resetGame();
      menuMusic.pause();
      menuMusic.currentTime=0;
      musicFight.play();
      
      //hide the results and buttons
      gameOverContainer.style.display = "none";

      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = "block";
    }

    function moveToMenu() {
      menuMusic.play();
      musicFight.pause();
      musicFight.currentTime=0;

      //Cancel the previous animation frame request
      window.cancelAnimationFrame(animationFrameId);

      resetGame();

      gameOverContainer.style.display = "none";

      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = "none";
      menuContainer.style.display = "flex";
    }

    function resetGame() {
      //health bar display reset
      scene.statusBar.healthBars[0].hitPoints = HEALTH_MAX_HIT_POINTS;
      scene.statusBar.healthBars[1].hitPoints = HEALTH_MAX_HIT_POINTS;

      //fighter health reset
      gameState.fighters[0].hitPoints = HEALTH_MAX_HIT_POINTS;
      gameState.fighters[1].hitPoints = HEALTH_MAX_HIT_POINTS;

      //resets fighter initial position
      scene.fighters[0].position.x = 90;
      scene.fighters[1].position.x = 290;

      //timer reset
      scene.statusBar.time = 99;

      //clear hold keys set
      heldKeys.clear();
      pressedKeys.clear();

      //Set Game Ended false
      scene.isEnded = false;

      //Reset Game Over Container
      const image1 = document.querySelector('img[alt="ninja"]');
      const image2 = document.querySelector('img[alt="turtle"]');
      image1.style.display = "none";
      image2.style.display = "none";
    }
    function drawPlayer(image) {
      image.style.display = "block";
    }
  }
  /////
  //vsComputer Mode
  function startvsComputerGame() {
        menuMusic.pause();
        menuMusic.currentTime=0;
        musicFight.play();

        // Show canvas and hide menu on button click
        canvas.style.display = "block";
        menuContainer.style.display = "none";

        const scene = new vsCompBattleScene();

        inputKeyboardEvents();

        let frameTime = {
            prevTime: 0,
            secPassed: 0,
        };

        let animationFrameId;

        function animate(time) {
            animationFrameId = window.requestAnimationFrame(animate);
            frameTime = {
                secPassed: (time - frameTime.prevTime) / 1000,
                prevTime: time,
            };

            scene.draw(context);
            scene.update(frameTime, context);

            if (scene.isEnded) {
                gameEnd();
            }
        }
        window.requestAnimationFrame(animate);

        function gameEnd() {
            const image1 = document.querySelector('img[alt="loose"]');
            //image1.style.display = "none";
            const imageWin = document.querySelector('img[alt="victory"]');
            //imageWin.style.display="none";

            //Time over and level is valid
            if (scene.timer <= 0 && scene.level<4) {
                    winnerDisplay.textContent = `Game Over!!
                    You lost`;
                    drawPlayer(image1);
                    EndContainer();        
            } 

            //Player Health 0 and within level limit
            if (gameState.fighters[0].hitPoints <= 0 && scene.level<4) 
            {
                winnerDisplay.textContent = `Game Over!!You Lost`;
                drawPlayer(image1);
                EndContainer();
            } 

            //Enemy health 0
            if (gameState.fighters[1].hitPoints <= 0) 
            {
                scene.statusBar.time = 1000;
                scene.statusBar.isEnemyKilled=true;//status bar removed

                //remove the computer opponent by placing out and removing from array
                if (scene.fighters[1]) scene.fighters[1].position.x = 3000;
                scene.fighters.splice(1, 1);

                if(scene.fighters[0].position.x>350 && scene.level<3){//3
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    scene.fighters[0].position.x=-10;

                    //Increasing Level and adding new enemy
                    scene.level++;
                    scene.fighters.push(scene.otherFighters[scene.level]);
                    scene.fighters[0].opponent=scene.fighters[1];
                    scene.fighters[1].opponent=scene.fighters[0];
                    resetGame();
                }

                if(scene.fighters[0].position.x>350 && scene.level>=3){
                  winnerDisplay.textContent = `Victory!!
                   You Won`;
                  drawPlayer(imageWin);
                  EndContainer();
               }
            }
        }
        function EndContainer() {
            menuMusic.pause();
            menuMusic.currentTime = 0;
            musicFight.pause();
            musicFight.currentTime = 0;

            // Hide the canvas
            const canvas = document.querySelector("canvas");
            canvas.style.display = "none";

            // Show the winner display and buttons
            gameOverContainer.style.display = "flex";

            playAgainButton.addEventListener("click", playAgain);
            returnToMenuButton.addEventListener("click", moveToMenu);
        }

        function playAgain() {
            menuMusic.pause();
            menuMusic.currentTime = 0;
            musicFight.play();

            resetGame();
            scene.level=0; //reset level
            
            //Reset first enemy
            scene.fighters[1]=scene.otherFighters[0];
            scene.fighters[0].opponent=scene.fighters[1];
            scene.fighters[1].opponent=scene.fighters[0];

            gameState.fighters[0].hitPoints = HEALTH_MAX_HIT_POINTS;//fighter health reset

            gameOverContainer.style.display = "none";//hide the results and buttons

            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "block";

            //resets fighter initial position
            scene.fighters[0].position.x = 90;
            scene.fighters[1].position.x = 290;
        }

        function moveToMenu() {
            musicFight.pause();
            musicFight.currentTime=0;
            menuMusic.play();

            //Cancel the previous animation frame request
            window.cancelAnimationFrame(animationFrameId);

            resetGame();
            scene.level=0;//reset level

            gameState.fighters[0].hitPoints = HEALTH_MAX_HIT_POINTS;//fighter health reset

            gameOverContainer.style.display = "none";

            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            menuContainer.style.display = "flex";
        }

        function resetGame() {
            //draw status bar contents
            scene.statusBar.isEnemyKilled=false;

            //health bar display reset
            scene.statusBar.healthBars[0].hitPoints = HEALTH_MAX_HIT_POINTS;
            scene.statusBar.healthBars[1].hitPoints = HEALTH_MAX_HIT_POINTS;

            //enemy health reset
            gameState.fighters[1].hitPoints = HEALTH_MAX_HIT_POINTS;

            //timer reset
            scene.statusBar.time = 99;

            //clear hold keys set
            heldKeys.clear();
            pressedKeys.clear();

            //Set Game Ended false
            scene.isEnded = false;

             //Reset Game Over Container
             document.querySelector('img[alt="loose"]').style.display = "none";

             //immune potion reset
             scene.health.isHealthAvailable=true;
        }
        function drawPlayer(image) {
            image.style.display = "block";
        }
    }
});
