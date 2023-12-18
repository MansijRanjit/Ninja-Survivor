import { Ninja } from "../fighters/Ninja.js";
import { Computer1 } from "../fighters/Computer1.js";
import { Level1 } from "../backgrounds/Level1.js";
import { FighterDirection} from "../Constants.js";
import { StatusBar } from "../overlays/StatusBar.js";
import { gameState } from "../state/gameState.js";
import { Level2 } from "../backgrounds/Level2.js";
import { Computer2 } from "../fighters/Computer2.js";
import { Level3 } from "../backgrounds/Level3.js";
import { Computer3 } from "../fighters/Computer3.js";
import { Level4 } from "../backgrounds/Level4.js";
import { Computer4 } from "../fighters/Computer4.js";
import { Health } from "../special/health.js";

export class vsCompBattleScene{
    fighters=[];
    entities=[];
    isEnded=false;
    level=0
    
    constructor(){
        this.stage= [new Level1(),new Level2(),new Level3(),new Level4()];
        
        this.fighters=this.getFighters();

        this.otherFighters=[
            new Computer1(290,220,FighterDirection.LEFT,1,this.addEntity.bind(this)),
            new Computer2(290,220,FighterDirection.LEFT,1,this.addEntity.bind(this)),
            new Computer3(290,220,FighterDirection.LEFT,1,this.addEntity.bind(this)),
            new Computer4(290,220,FighterDirection.LEFT,1,this.addEntity.bind(this))
        ]

        this.statusBar= new StatusBar(this.fighters);

        this.health= new Health(this.fighters,this.level);


        this.fighters[0].opponent=this.fighters[1];
        this.fighters[1].opponent=this.fighters[0];

        this.timer=0;
    }

    getFighters(){
        const fighters=[
            new Ninja(90,220,FighterDirection.RIGHT,0,this.addEntity.bind(this)),
            new Computer1(290,220,FighterDirection.LEFT,1,this.addEntity.bind(this))
        ]
        return fighters;
    }

    //special move is pushed/included in entities
    addEntity(EntityClass,time, ...args){
        this.entities.push(new EntityClass(...args,time,this.removeEntity.bind(this)));//adding reference to removeEntity method

    }
    removeEntity(entity){
        this.entities = this.entities.filter((thisEntity) => thisEntity !==entity);// keeping only those entities that are not equal to the specified entity i.e.removing the specified entity from the array.
    }

    updateFighters(time,context){
        for(const fighter of this.fighters){
            fighter.update(time,context)
        }
    }
    updateStatusBar(time){
        this.statusBar.update(time)
    }
    updateEntities(time,context){
        for (const entity of this.entities){
            entity.update(time,context)
        }
    }
    update(time,context){
        this.timer=this.statusBar.time;
        this.updateFighters(time,context);
        this.updateStatusBar(time);
        this.updateEntities(time,context);
    
        this.health.update(context,this.level)

        if(this.timer<=0 || gameState.fighters[0].hitPoints<=0 || gameState.fighters[1].hitPoints<=0){           
            this.isEnded=true;
        }
    }

    drawFighters(context){
        for(const fighter of this.fighters){
                fighter.draw(context) 
        }
    }
    drawStatusBar(context){
        this.statusBar.drawVsComp(context,this.level);
    }
    drawEntities(context){
        for(const entity of this.entities){
            entity.draw(context)
        }
    }
    draw(context){
        this.stage[this.level].draw(context)
        this.drawFighters(context);
        this.drawStatusBar(context);
        this.drawEntities(context);

        if(this.level===2){
            this.health.draw(context);   
        }
    }

}