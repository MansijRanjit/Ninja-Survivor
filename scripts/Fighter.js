
export class Fighter{
    constructor(name,x,y,velocity){
        this.name= name;
        this.image = new Image();
        this.position={x,y};
        this.velocity=velocity;
    }

    update(secPassed, context){
        this.position.x += this.velocity *secPassed;

        if(this.position.x + this.image.width > context.canvas.width || this.position.x<0){
            this.velocity= -this.velocity;
        }
    }

    draw(context){
        context.drawImage(this.image,this.position.x,this.position.y,80,80);
    }
}