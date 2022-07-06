import { P5Instance } from "react-p5-wrapper";
import { Bubble } from "./PhysicsEngineSketch";

export default function sketch(p5: P5Instance) {
    let handler: BallHandler;

    p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);

        handler = new BallHandler(p5, 500);
    }

    p5.draw = () => {
        p5.background(255);

        handler.draw();
    }
}

/**
 * Takes care of simulating and drawing all of the Ball objects.
 * @param {P5Instance} p5 Reference to the current p5 context.
 * @param {number} numBalls How many balls to simulate.
 */
class BallHandler {
    balls: Array<Ball> = [];
    p5: P5Instance;
    halfWidth: number;
    halfHeight: number;
    lineColors: Array<Array<number>> = [];

    constructor(p5: P5Instance, numBalls?: number) {
        this.p5 = p5;

        this.halfWidth = this.p5.width / 2;
        this.halfHeight = this.p5.height / 2;

        // This is our center ball. It is exactly in the center of the screen.
        this.balls.push(new Ball(this.p5, this.halfWidth, this.halfHeight, 50));

        numBalls = numBalls ? numBalls : 1000;

        for (let i = 0; i < numBalls; i++) {
            this.balls.push(
                new Ball(
                    this.p5,
                    Math.random() * this.p5.width,
                    Math.random() * this.p5.height,
                    20,
                )
            )
        }

        for (let i = 0; i < this.balls.length; i++) {
            // Generate some colors for us to use later.
            this.lineColors.push(
                [
                    Math.random() * 255,
                    Math.random() * 255,
                    Math.random() * 255
                ]
            )
        }

        // Set the center ball's ySpeed to 5;
        this.balls[0].ySpeed = 5;
    }

    /**
     * Simulates how each ball's x values should change
     * Draws the simulation to the canvas.
     */
    draw(): void {
        // For all of the balls we are simulating
        for (let i = 0; i < this.balls.length; i++) {
            // If this is the center ball, go to the next one.
            if (i === 0) {
                continue;
            }

            // Give the current ball a line connecting it to the center ball.
            this.p5.stroke(
                this.lineColors[i][0],
                this.lineColors[i][1],
                this.lineColors[i][2],
            );

            // Make the line thicker
            this.p5.strokeWeight(5);

            // Draw the line connecting the two balls
            this.p5.line(
                this.balls[0].x, this.balls[0].y,
                this.balls[i].x, this.balls[i].y
            )

            this.p5.noStroke();

            // Draw the ball
            this.balls[i].draw();

            // Gets the rate at which the ball's x value should change. Calculus derivation.
            let delX: number = (this.balls[0].ySpeed * (this.balls[i].y - this.balls[0].y)) / (this.balls[i].x - this.balls[0].x);

            // Calculate an exponential decay based on how fast the ball is moving.
            // This will make the ball move faster the further away it is.
            // It helps to prevent asymptotic infinites in the equation for delX.
            let calc: number = Math.E ** -Math.abs(delX / 100);

            // Apply this exponential decay
            delX = delX < 0 ? -calc : calc;

            // Update the balls position based on its calculated speed.
            this.balls[i].x += delX;

            // If the center ball is touching the top or bottom of the screen
            if (this.balls[0].y < 0 || this.balls[0].y > this.p5.height) {
                // Set it's speed to be opposite (makes it turn around)
                this.balls[0].ySpeed *= -1;

                // This will make the ball take a step.
                this.balls[0].y += this.balls[0].ySpeed;
            }
        }

        // We draw the center ball last to make sure that all of the lines are underneath it.
        this.balls[0].draw();
    }
}

/**
 * Ball class. Extends Bubble.
 * @param {P5Instance} p5 Reference to current p5 context
 * @param {number} x  x position of the ball
 * @param {number} y y position of the ball
 * @param {number} width how wide the ball is
 */
class Ball extends Bubble {
    count: number = 0;

    constructor(p5: P5Instance, x: number, y: number, width: number) {
        super(p5, x, y, width);

        this.height = this.width;

        this.xSpeed = 0;
        this.ySpeed = 0;
    }

    /**
     * The same as the Bubble class basically.
     */
    draw(): void {
        super.draw();

        this.move();
    }

    /** This move method is not as complex as the original Bubble class. */
    move(): void {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
}