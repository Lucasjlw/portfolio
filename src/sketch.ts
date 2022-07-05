import { P5Instance } from "react-p5-wrapper";

export default function sketch(p5: P5Instance): void {
    const bubbles: Array<Bubble> = [];

    p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);

        for (let i = 0; i < 100; i++) {
            bubbles.push(new Bubble(undefined, undefined, 50, 50));
        }
    }

    p5.draw = () => {
        p5.background(0);

        for (let i of bubbles) {
            i.move();

            i.color();
            
            i.draw();
        }
    }

    /**
     * Maintains state and methods for a ellipse on the screen.
     * @param {number} [x] x position of the center of the ellipse
     * @param {number} [y] y position of the center of the ellipse
     * @param {number} [width] how wide the ellipse is
     * @param {number} [height] how tall the ellispe is
     * @param {number} [xSpeed] how fast the ellipse will move in the x axis
     * @param {number} [ySpeed] how fast the ellipse will move in the y axis
     */
    class Bubble {
        height: number;
        width: number;
        x: number;
        y: number;
        xSpeed: number;
        ySpeed: number;
        xRadius: number;
        yRadius: number;
        xColor: number;
        yColor: number;
        speedColor: number;

        private static speedConst: number = 10;

        constructor(x?: number, y?: number, width?: number, height?: number, xSpeed?: number, ySpeed?: number) {
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
            this.xSpeed = xSpeed ? xSpeed : Math.floor(Math.random() *  Bubble.speedConst);

            // see this.xSpeed
            this.ySpeed = ySpeed ? ySpeed : Math.floor(Math.random() * Bubble.speedConst);
        }

        draw(): void {
            p5.fill(this.xColor, this.yColor, this.speedColor);
            p5.ellipse(this.x, this.y, this.width, this.height);
        }

        /**
         * Calculates the next value of this.x and this.y. If the ellipse is touching the bounds of the screen, makes it bounce.
         */
        move(): void {
            this.x += this.xSpeed;
            if (this.x - this.xRadius < 0 || this.x + this.xRadius > p5.width) {
                this.xSpeed *= -1;
            }

            this.y += this.ySpeed;
            if (this.y - this.yRadius < 0 || this.y + this.yRadius > p5.height) {
                this.ySpeed *= -1;
            }
        }

        /**
         * Calculates color values for the ellipse based on it's position and speed.
         */
        color() {
            let speedMag = ((this.xSpeed) ** 2 + (this.ySpeed) ** 2);
            this.speedColor = (256 * speedMag) / ((Bubble.speedConst ** 2) * 2 + 1);
            this.xColor = (256 * this.x) / ((p5.width - this.xRadius) + 1);
            this.yColor = (256 * this.y) / ((p5.height - this.yRadius) + 1);
        }
    }
}