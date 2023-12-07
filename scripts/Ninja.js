import { Fighter } from "./Fighter.js";

export class Ninja extends Fighter{
    constructor(x,y,direction){
        super("Ninja",x,y,direction);

        this.image=document.querySelector('img[alt="blueNinja"]');
        
        this.frames=new Map([
            ['forward-1',[[198,2411,82,99],[40,90]]],
            ['forward-2',[[305,2410,80,97],[41,89]]],
            ['forward-3',[[421,2412,66,97],[33,89]]],
            ['forward-4',[[522,2413,59,94],[29,87]]],
            ['forward-5',[[613,2414,57,96],[29,86]]],
            ['forward-6',[[688,2416,60,95],[101,56]]],
            ['forward-7',[[774,2413,66,96],[33,88]]],
            ['forward-8',[[868,2411,80,97],[40,90]]],
        ]);

        this.animations ={
            'walkForward':['forward-1','forward-2','forward-3','forward-4','forward-5','forward-6','forward-7','forward-8'],

            'walkBackward':['forward-1','forward-2','forward-3','forward-4','forward-5','forward-6','forward-7','forward-8'],
        };
    }
}
