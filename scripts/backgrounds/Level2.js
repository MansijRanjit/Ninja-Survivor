
export class Level2{
    constructor(){
        this.image=document.querySelector('img[alt="background2"]')
    }

    draw(context){
        context.drawImage(this.image,0,0,384,222);
    }
}