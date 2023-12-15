import { Ninja } from "../fighters/Ninja.js";
import { enemy1 } from "../fighters/Enemy.js";
import { Level1 } from "../Level1.js";
import { FighterDirection,GameView } from "../Constants.js";
import { StatusBar } from "../overlays/StatusBar.js";
import { gameState } from "../state/gameState.js";

export class BattleScene{
    fighters=[];
    entities=[];
    isEnded=false;

    constructor(){
        this.stage= new Level1();

        this.fighters=this.getFighters();

        this.statusBar= new StatusBar(this.fighters);

        this.fighters[0].opponent=this.fighters[1];
        this.fighters[1].opponent=this.fighters[0];

        this.timer=0;
    }

    getFighters(){
        const fighters=[
            new Ninja(90,220,FighterDirection.RIGHT,0,this.addEntity.bind(this)),
            new enemy1(290,220,FighterDirection.LEFT,1,this.addEntity.bind(this))
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

    updateFighters(time,context,timer){
        for(const fighter of this.fighters){
            fighter.update(time,context,timer)
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
        this.updateFighters(time,context,this.timer);
        this.updateStatusBar(time);
        this.updateEntities(time,context);
        //console.log(this.statusBar.time)
        //console.log(this.timer)

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
        this.statusBar.draw(context);
    }
    drawEntities(context){
        for(const entity of this.entities){
            entity.draw(context)
        }
    }
    draw(context){
        this.stage.draw(context)
        this.drawFighters(context);
        this.drawStatusBar(context);
        this.drawEntities(context);
    }

}