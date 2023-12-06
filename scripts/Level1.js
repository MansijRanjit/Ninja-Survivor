
export class Level1{
    constructor(){
        this.image=document.querySelector('img[alt="background"]')
    }

    draw(context){
        context.drawImage(this.image,0,0,384,222);
    }
}