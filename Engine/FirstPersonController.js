import { vec3, quat } from '../lib/gl-matrix-module.js';

export class FirstPersonController {
    constructor(node,tail, domElement) {
        this.node = node;
        this.tail = tail;
        this.dom = domElement;
        this.keys = {};

        //Log position of the snake for the tail to follow.
        this.translationQ = [this.node.translation];
        this.rotationQ = [this.node.rotation];


        // Current direction the controller is moving
        this.direction = vec3.create();

        // Current orientation of the snake
        this.forward = vec3.fromValues(0, 0, 1);
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.fromValues(1, 0, 0);
        
        this.speed = 10;
        this.rotating = false;
        
        this.initHandlers();
    }

    initHandlers() {
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        const element = this.dom;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);

        element.addEventListener('click', e => element.requestPointerLock());
    }

    update(dt) {
        this.delay = 750/this.speed;
        this.dt = dt;
        this.rotationQ.push(this.node.rotation);

        // Update the snake's direction
        this.direction = vec3.scale(vec3.create(), this.forward, dt * 1000 * this.speed);

        // Rotate the snake on player input
        if (this.keys['KeyW'] && !this.rotating) {
            this.temp = this.forward;
            this.forward = this.up;
            this.up = vec3.scale(quat.create(), this.temp, -1);
            this.rotate(this.up,1);
        }
        if (this.keys['KeyS'] && !this.rotating) {
            this.temp = this.forward;
            this.forward = vec3.scale(quat.create(), this.up, -1);
            this.up = this.temp;
            this.rotate(this.up,-1)
        }
        if (this.keys['KeyA'] && !this.rotating) {
            this.temp = this.forward;
            this.forward = this.right;
            this.right = vec3.scale(quat.create(), this.temp, -1);
            
            this.rotate(this.right,-1);
        }
        if (this.keys['KeyD'] && !this.rotating) {
            this.temp = this.forward;
            this.forward = vec3.scale(quat.create(), this.right, -1);
            this.right = this.temp;
            this.rotate(this.right,1);
        }

        
        
        // Update the snake's transformation matrix
        this.node.translation = vec3.add(vec3.create(), this.node.translation, vec3.scale(vec3.create(), this.direction, dt));
        this.translationQ.push(this.node.translation);
        if(this.translationQ.length > this.delay){
            this.tail.translation = this.translationQ[this.translationQ.length - this.delay];
            this.tail.rotation = this.rotationQ[this.rotationQ.length - this.delay];
            
        }
    }
    async rotate(axis, k) {
        // Calculate the angle of rotation
        const x = -k * 90 * (axis == this.up);
        const y = -k * 90 * (axis == this.right);

        // Start rotation
        this.rotating = true;
        let startTime = performance.now();
        let elapsedTime = 0;
        const duration = 600;  // Duration of rotation in milliseconds
        const startRotation = quat.clone(this.node.rotation);
        const endRotation = quat.mul(quat.create(), startRotation, quat.fromEuler(quat.create(), x, y, 0));

        // Rotate the snake until it reaches the end rotation
        while (elapsedTime < duration) {
            elapsedTime = performance.now() - startTime;
            let t = elapsedTime / duration;
            t = Math.min(1, t);
            this.node.rotation = quat.slerp(quat.create(), startRotation, endRotation, t);
            this.tail.rotation = quat.slerp(quat.create(), endRotation, startRotation, t);
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        this.node.rotation = endRotation;

        // Stop rotation
        this.rotating = false;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
        this.direction = vec3.create();
    }
}
