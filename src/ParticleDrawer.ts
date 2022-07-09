import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";
import { Body, Vector2D } from "./Body";

export default function sketch(p5: P5Instance) {
    let simulator: Simulator;

    p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);

        simulator = new Simulator(p5, 1000);
    }

    p5.draw = () => {
        p5.background(0);

        simulator.draw();
    }
}

/**
 * Handles the simulation of the Block objects.
 * @param {P5Instance} p5 Reference to the current p5 context
 * @param {number} numBlocks How many blocks we should simulate
 */
class Simulator {
    p5: P5Instance
    blocks: Array<Block> = [];
    time: number = 0;
    lastTime: number = 0;
    lines: Array<[number, number]> = [];

    constructor(p5: P5Instance, numBlocks?: number) {
        // If numBlocks is supplied we use that value; otherwise, use 10 blocks.
        numBlocks = numBlocks ? numBlocks : 10;

        this.p5 = p5;

        for (let i = 0; i < numBlocks; i++) {
            this.blocks.push(this.createBlock());
        }
    }
 
    /**
     * Helper function to create new Block instances with random values.
     * @returns {Block} The block instance we created
     */
    createBlock(): Block {
        return new Block(
            this.p5,
            1,
            new Vector2D(
                Math.random() * this.p5.width, 
                Math.random() * this.p5.height
            ),
            10,
            10,
            [Math.random() * 255, Math.random() * 255, Math.random() * 255],
        )
    }

    draw() {
        // We load all of the pixels on the screen
        this.p5.loadPixels();

        for (let k of this.lines) {
            // This will set the pixal at the (x, y) location defined by k[1] and k[2].
            this.p5.set(
                k[0], 
                k[1],
                [255, 255, 255, 255]  
            );
        }
        
        // All of the pixels that we set in the for loop are now rendered to the screen.
        this.p5.updatePixels();

        // This handles the main simulation of all of the blocks on the screen.
        for (let i of this.blocks) {
            // These next two lines create random values for the acceleration. Not going to lie, it's a "clever" solution but I love looking at it.
            // We generate the first random value to serve as the magnitude of our acceleration vector
            // Then the line [-1, 1][Math.floor(Math.random() * 2)] will choose either 1 or -1 at random to provide a direction for
            // The acceleration vector.
            i.acceleration.x = Math.random() * [-1, 1][Math.floor(Math.random() * 2)];
            i.acceleration.y = Math.random() * [-1, 1][Math.floor(Math.random() * 2)];
            
            // Add the (x, y) values of the current block's location to the lines array so we can draw them using set() function.
            this.lines.push([i.position.x, i.position.y]);

            // This calls the Block instance's draw function
            i.draw();

            // The next two lines are used to check of the current block has gone off the bounds of the screen dimensions.
            let check1 = i.position.x > this.p5.width || i.position.x < 0;
            let check2 = i.position.y > this.p5.width || i.position.y < 0;

            
            if (check1 || check2) {
                // Get the index of the current block
                let index = this.blocks.indexOf(i);

                // And then delete it.
                this.blocks.splice(index, 1);
            }
        }
    }
}

/**
 * Block class that gives a "shape" and color to the body class.
 * @param {number} width how wide the block should be
 * @param {number} height how tall the block should be
 * @param {Array<number>} color the RGB values of the block's color.
 */
class Block extends Body {
    p5: P5Instance;
    width: number;
    height: number;
    color: [number, number, number] = [0, 0, 0];

    constructor(p5: P5Instance, mass: number, position: Vector2D, width: number, height: number, color: [number, number, number]) {
        super(mass, position);

        this.p5 = p5;
        this.width = width;
        this.height = height;

        this.color = color;
    }

    
    draw() {
        // Set the blocks color
        this.p5.fill(this.color[0], this.color[1], this.color[2]);

        // Draw the block
        this.p5.rect(this.position.x, this.position.y, this.width, this.height);

        // Call the Body move method
        super.move();
    }
}