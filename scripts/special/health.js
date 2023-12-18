import { FighterAttackType, GameView, NinjaStarState,HEALTH_MAX_HIT_POINTS} from "../Constants.js";
import { getActualBoxDimensions ,boxOverlap} from "../collisions.js";
import { StatusBar } from "../overlays/StatusBar.js";
import { gameState } from "../state/gameState.js";

export class Health{
    image = document.querySelector('img[alt="healthPotion"]');
    
    constructor(fighters){
        this.fighters=fighters;
        
        this.statusBar = new StatusBar(this.fighters);

        this.isHealthAvailable=true; //draw potion
        
        this.position={
            x: 200,
            y: 60,
        };
    }

    hasCollidedWithFighter(){
            const [x,y,width,height] =[this.fighters[0].boxes.push];
            if(boxOverlap(
                {
                    x:this.position.x,
                    y:this.position.y,
                    width:20,
                    height:20
                },
               {
                    x:this.fighters[0].position.x+this.fighters[0].boxes.push.x,
                    y:this.fighters[0].position.y+ this.fighters[0].boxes.push.y,
                    width:this.fighters[0].boxes.push.width,
                    height:this.fighters[0].boxes.push.height
                }
            )){
                //console.log("collided")
                return true;
            }
            else{
                return false;
            }
    }

    update(context,level){
        const hasCollided = this.hasCollidedWithFighter();
        if(!hasCollided) return;
        if(hasCollided&& level===2){
            if(this.isHealthAvailable){
                gameState.fighters[this.fighters[0].playerId].hitPoints +=50
                this.statusBar.healthBars[0].hitPoints += 50
                
            }
            this.isHealthAvailable=false;
        }
    }

    draw(context){
        if(this.isHealthAvailable){
            const [x,y,width,height]=[79,23,101,133]
    
            context.drawImage(
                    this.image,
                    x,y,
                    width,
                    height,
                    this.position.x,
                    this.position.y,
                    20,20
            );
        }
    }
}