
export class Level3{
    constructor(){
        this.image=document.querySelector('img[alt="background3"]')
    }

    draw(context){
        context.drawImage(this.image,0,0,384,222);
        
    }
}