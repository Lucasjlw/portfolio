import { P5Instance } from "react-p5-wrapper";

export function sketch(p5: P5Instance): void {
    let handler: PhysicsHandler;

    p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);

        handler = new PhysicsHandler(50);
    }

    p5.draw = () => {
        p5.background(0);

        handler.draw();
    }

    /**
     * Handles collisions between moving Bubbles. Does not follow conservation of momentum.
     */
    class PhysicsHandler {
        bubbles: Array<Bubble> = [];
        startingPoints: Array<Array<number>> = [];

        constructor(numBubbles: number) {
            for (let i = 0; i < numBubbles; i++) {
                this.bubbles.push(new Bubble(p5, undefined, undefined, 20, 20));
            }
        }

        draw(): void {
            this.checkForCollision();

            for (let i of this.bubbles) {
                i.move();

                i.color();

                i.draw();
            }
        }

        /**
         * Check if any bubble's circumference is right next to another bubble's circumference.
         * If the bubbles are close, it changes the velocity of the bubbles.
         */
        checkForCollision(): void {
            for (let i = 0; i < this.bubbles.length; i++) {
                let circ1: Array<Array<number>> = this.bubbles[i].circumference;

                for (let n = 0; n < this.bubbles.length; n++) {
                    if (i === n) {break};

                    // For all of the points on the circumference of the bubble
                    for (let k in circ1) {
                        let circ2 = this.bubbles[n].circumference;

                        // Euclidean distance formula
                        let distance = (circ1[k][0] - circ2[k][0]) ** 2 + (circ1[k][1] - circ2[k][1]) ** 2;
                        distance = Math.sqrt(distance);

                        // If they are close enough totouch
                        if (distance < (this.bubbles[i].xRadius * 2) + 2) {
                            // Change the velocity of the first bubble (simple 180 degree rotation)
                            this.bubbles[i].xSpeed *= -1;
                            this.bubbles[i].ySpeed *= -1;

                            // This will go ahead and move the bubble one time step ahead with the new
                            // Velocity
                            this.bubbles[i].x += this.bubbles[i].xSpeed;
                            this.bubbles[i].y += this.bubbles[i].ySpeed;

                            // See above. This is the second bubble in the collision.
                            this.bubbles[n].xSpeed *= -1;
                            this.bubbles[n].ySpeed *= -1;
                            this.bubbles[n].x += this.bubbles[n].xSpeed;
                            this.bubbles[n].y += this.bubbles[n].ySpeed;
                                
                            // We do not need to check any more points since a collision has been found.
                            break;
                        }
                    }
                }
                
            }
        } 
    }
}

/**
     * Maintains state and methods for a ellipse on the screen.
     * @param {P5Instance} p5 A reference to the current p5 instance context.
     * @param {number} [x] x position of the center of the ellipse
     * @param {number} [y] y position of the center of the ellipse
     * @param {number} [width] how wide the ellipse is
     * @param {number} [height] how tall the ellispe is
     * @param {number} [xSpeed] how fast the ellipse will move in the x axis
     * @param {number} [ySpeed] how fast the ellipse will move in the y axis
    */
 export class Bubble {
    p5: P5Instance;
    height: number;
    width: number;
    x: number;
    y: number;
    xSpeed: number;
    ySpeed: number;
    xRadius: number;
    yRadius: number;
    colors: Array<number> = [0, 0, 0];
    colorXIndex: number = 0;
    colorYIndex: number = 0;
    colorSIndex: number = 0;
    circumference: Array<Array<number>> = [];

    private static speedConst: number = 10;
    private static count = 0;

    constructor(p5: P5Instance, x?: number, y?: number, width?: number, height?: number, xSpeed?: number, ySpeed?: number) {
        this.p5 = p5;

        // Set this.width to the supplied width. If the width is not supplied, create one randomly.
        this.width = width ? width : Math.random() * 200;

        // Same thing happening as in this.width
        this.height = height ? height : Math.random() * 200;

        // Calculate the radii of the ellipse
        this.xRadius = Math.floor(this.width / 2);
        this.yRadius = Math.floor(this.height / 2);

        this.x = 
            // if an x param is supplied
            x ? 
            // make sure that the x parameter is within the bounds defined by the screen.
            Math.min(Math.max(x, this.xRadius), p5.width - this.xRadius) : 
            // otherwise, generate an x at random and make sure it is within the bounds of the screen.
            Math.min(Math.max(Math.random() * p5.width, this.xRadius), p5.width - this.xRadius);

        // See the comment for this.x
        this.y = 
            y ?
            Math.min(Math.max(y, this.yRadius), p5.height - this.yRadius) :
            Math.min(Math.max(Math.random() * p5.height, this.yRadius), p5.height - this.yRadius);

        // if an xSpeed param is supplied set it to that. Otherwise, get one at random.
        this.xSpeed = xSpeed ? xSpeed : Math.floor(Math.random() * Bubble.speedConst) * [1, -1][Math.floor(Math.random() * 2)];

        // see this.xSpeed
        this.ySpeed = ySpeed ? ySpeed : Math.floor(Math.random() * Bubble.speedConst) * [1, -1][Math.floor(Math.random() * 2)];

        this.randomizeColorIndices();
    }

    private randomizeColorIndices(): void {
        const indices: Array<number> = [0, 1, 2];

        this.colorXIndex = Math.floor(Math.random() * 3);
        indices.splice(this.colorXIndex, 1);

        this.colorYIndex = Math.floor(Math.random() * 3);
        this.colorYIndex = this.colorYIndex === this.colorXIndex ? Math.floor(Math.random() * 3) : this.colorYIndex;
        indices.splice(this.colorYIndex, 1);

        this.colorSIndex = indices[0];
    }

    draw(): void {
        this.p5.fill(this.colors[0], this.colors[1], this.colors[2]);
        this.p5.ellipse(this.x, this.y, this.width, this.height);
        this.getCircumference();
    }

    /**
     * Calculates the next value of this.x and this.y. If the ellipse is touching the bounds of the screen, makes it bounce.
     */
    move(): void {
        this.x += this.xSpeed;
        if (this.x - this.xRadius < 2 || this.x + this.xRadius > this.p5.width - 2) {
            this.xSpeed *= -1;
        }

        this.y += this.ySpeed;
        if (this.y - this.yRadius < 2 || this.y + this.yRadius > this.p5.height - 2) {
            this.ySpeed *= -1;
        }
    }

    /**
     * Calculates color values for the ellipse based on it's position and speed.
     */
    color(): void {
        let speedMag = ((this.xSpeed) ** 2 + (this.ySpeed) ** 2);

        this.colors[this.colorSIndex] = (256 * speedMag) / ((Bubble.speedConst ** 2) * 2 + 1);

        this.colors[this.colorXIndex] = (256 * this.x) / ((this.p5.width - this.xRadius) + 1);

        this.colors[this.colorYIndex] = (256 * this.y) / ((this.p5.height - this.yRadius) + 1);
    }

    /**
     * Gets x, y pairs for points on the circumference of the bubble.
     */
    getCircumference(): void {
        this.circumference = [];
        for (let k = 0; k < 10; k++) {
            let x: number = Math.cos(k) ** 2 + this.x;
            let y: number = Math.sin(k) ** 2 + this.y;

            this.circumference.push([x, y]);
        }
    }
}