import { Ninja } from "../Ninja.js";
import { enemy1 } from "../Enemy.js";
import { Level1 } from "../Level1.js";
import { FighterDirection,GameView } from "../Constants.js";
import { StatusBar } from "../overlays/StatusBar.js";

export class BattleScene{
    fighters=[];
    entities=[];

    constructor(){
        this.stage= new Level1();

        this.fighters=this.getFighterEntities();

        this.statusBar= new StatusBar(this.fighters);

        this.fighters[0].opponent=this.fighters[1];
        this.fighters[1].opponent=this.fighters[0];

    }

    getFighterEntities(){
        const fighterEntities=[
            new Ninja(90,220,FighterDirection.RIGHT,0,this.addEntity.bind(this)),
            new enemy1(190,220,FighterDirection.LEFT,1,this.addEntity.bind(this))
        ]
        return fighterEntities;
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
        this.updateFighters(time,context);
        this.updateStatusBar(time);
        this.updateEntities(time,context);
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