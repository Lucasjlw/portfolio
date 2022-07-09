import { isThisTypeNode } from "typescript";
import { domainToASCII } from "url";

/**
 * Custom class to represent two-dimensional vectors
 * @param {number} x The x value of the vector
 * @param {number} y the y value of the vector
 */
export class Vector2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents the basic properties of any physical object, without shape.
 * @param {number} mass Mass of the object
 * @param {Vector2D} position The position of the object as a vector
 * @param {Vector2D} velocity The velocity of the object as a vector
 * @param {Vector2D} acceleration The acceleration of the object as a vector
 */
export class Body {
    mass: number;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;

    constructor(mass: number, position: Vector2D, velocity?: Vector2D, acceleration?: Vector2D) {
        this.mass = mass;
        this.position = position;

        // For the next two lines we supply a default value of 0 unless the values have been supplied.
        this.velocity = velocity ? velocity : new Vector2D(0, 0);
        this.acceleration = acceleration ? acceleration : new Vector2D(0, 0);
    }

    /**
     * Handles the kinematics of the object 
     */
    move() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}