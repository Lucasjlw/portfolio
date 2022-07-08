import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";
import { Body, Vector2D } from "./Body";

export default function sketch(p5: P5Instance) {
    let simulator: Simulator;

    p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);

        simulator = new Simulator(p5, 2);
    }

    p5.draw = () => {
        p5.background(0);

        simulator.draw();
    }
}

class Simulator {
    p5: P5Instance
    blocks: Array<Block> = [];
    time: number = 0;

    constructor(p5: P5Instance, numBlocks?: number) {
        numBlocks = numBlocks ? numBlocks : 2;

        this.p5 = p5;

        for (let i = 0; i < numBlocks; i++) {
            this.blocks.push(new Block(
                this.p5,
                1,
                new Vector2D(100, 100 + (100 * i)),
                10,
                10
            ))
        }
    }

    draw() {
        for (let i of this.blocks) {
            i.draw();
        }
    }
}

class Block extends Body {
    p5: P5Instance;
    width: number;
    height: number;

    constructor(p5: P5Instance, mass: number, position: Vector2D, width: number, height: number) {
        super(mass, position);

        this.p5 = p5;
        this.width = width;
        this.height = height;
    }

    draw() {
        this.p5.stroke(255);

        this.p5.rect(this.position.x, this.position.y, this.width, this.height);

        //this.acceleration.x = Math.cos(this.position.x);
        this.acceleration.y = Math.cos(this.p5.frameCount);

        super.move();
    }
}