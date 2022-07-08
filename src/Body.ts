export class Vector2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2D) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector: Vector2D) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    dot(vector: Vector2D) {
        this.x *= vector.x;
        this.y *= vector.y;
    }
}

export class Body {
    mass: number;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;

    constructor(mass: number, position: Vector2D, velocity?: Vector2D, acceleration?: Vector2D) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity ? velocity : new Vector2D(0, 0);
        this.acceleration = acceleration ? acceleration : new Vector2D(0, 0);
    }

    move() {
        this.velocity.add(this.acceleration);

        this.position.add(this.velocity);
    }
}