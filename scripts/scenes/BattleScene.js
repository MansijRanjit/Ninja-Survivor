import { Ninja } from "../Ninja.js";
import { enemy1 } from "../Enemy.js";
import { Level1 } from "../Level1.js";
import { FighterDirection,GameView } from "../Constants.js";
import { StatusBar } from "../overlays/StatusBar.js";

export class BattleScene{
    fighters=[];

    constructor(){
        this.stage= new Level1();

        this.statusBar= new StatusBar(this.fighters);

        this.fighters=this.getFighterEntities();

        this.fighters[0].opponent=this.fighters[1];
        this.fighters[1].opponent=this.fighters[0];
    }
    getFighterEntities(){
        const fighterEntities=[
            new Ninja(90,220,FighterDirection.RIGHT,0),
            new enemy1(190,220,FighterDirection.LEFT,1)
        ]
        return fighterEntities;
    }


    updateFighters(time,context){
        for(const fighter of this.fighters){
            fighter.update(time,context)
        }
    }
    updateStatusBar(time){
        this.statusBar.update(time)
    }
    update(time,context){
        this.updateFighters(time,context);
        this.updateStatusBar(time);
    }


    drawFighters(context){
        for(const fighter of this.fighters){
            fighter.draw(context)
        }
    }
    drawStatusBar(context){
        this.statusBar.draw(context);
    }
    draw(context){
        this.stage.draw(context)
        this.drawFighters(context);
        this.drawStatusBar(context);
    }
}