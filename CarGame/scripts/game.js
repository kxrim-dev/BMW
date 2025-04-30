const carImage = new Image();
carImage.src = "pics/car.png";

const enemyImage = new Image();
enemyImage.src = "pics/enemyCar.png";

class GameObject {
    constructor() {
        this.components = [];
    }
}

class Component {
    constructor() {}
}

class Hitbox extends Component {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    drawHitbox(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Car extends GameObject {
    constructor(x, y, width, height, speed) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.hitbox = new Hitbox(this.x, this.y, this.width, this.height);
        this.components.push(this.hitbox);
    }

    draw(ctx) {
        if (carImage.complete) {
            ctx.save(); // aktueller Zustand merken
    
            // Mittelpunkt berechnen
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
    
            ctx.translate(centerX, centerY); // ins Zentrum verschieben
            ctx.rotate(1.58); // 90° gegen den Uhrzeigersinn drehen
    
            // Auto zeichnen, ausgehend vom Mittelpunkt
            ctx.drawImage(carImage, -this.height / 2, -this.width / 2, this.height, this.width);
    
            ctx.restore(); // Zustand zurücksetzen
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    

    move() {
        if (leftPressed) this.x -= this.speed;
        if (rightPressed) this.x += this.speed;
        if (upPressed) this.y -= this.speed;
        if (downPressed) this.y += this.speed;
    
        // Begrenzung innerhalb des Canvas
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    
        this.hitbox.x = this.x + 32;
        this.hitbox.y = this.y + 5;
    }
    
}

class EnemyCar extends GameObject {
    constructor(x, y, width, height, speed) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.hitbox = new Hitbox(this.x, this.y, this.width, this.height);
        this.components.push(this.hitbox);
    }

    draw(ctx) {
        if (enemyImage.complete) {
            ctx.save();
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
    
            ctx.translate(centerX, centerY);
            ctx.rotate(3.15); // oder + je nach Richtung
    
            ctx.drawImage(enemyImage, -this.height / 2, -this.width / 2, this.height, this.width);
    
            ctx.restore();
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(this.x, this.y, this.width, this.height);

        }
    }    
    

    update() {
        this.y += this.speed;
        this.hitbox.y = this.y + 9;
        this.hitbox.x = this.x + 17;
    }
}
