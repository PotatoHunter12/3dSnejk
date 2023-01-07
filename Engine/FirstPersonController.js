import { vec3, quat } from '../lib/gl-matrix-module.js';

export class FirstPersonController {
    constructor(node, domElement) {
        this.node = node;
        this.dom = domElement;
        this.keys = {};

        // Current direction the controller is moving
        this.direction = vec3.create();

        // Current orientation of the snake
        this.forward = vec3.fromValues(0, 0, 1);
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.fromValues(1, 0, 0);
        
        this.speed = 0;
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
        // Update the snake's direction
        this.direction = vec3.add(vec3.create(), this.direction, vec3.scale(vec3.create(), this.forward, dt * this.speed));

        // Rotate the snake on player input
        if (this.keys['KeyW'] && !this.rotating) {
            this.rotate(this.up,1);
        }
        if (this.keys['KeyS'] && !this.rotating) {
            this.rotate(this.up,-1)
        }
        if (this.keys['KeyA'] && !this.rotating) {
            this.rotate(this.right,-1);
        }
        if (this.keys['KeyD'] && !this.rotating) {
            this.rotate(this.right,1);
        }
        
        // Update the snake's transformation matrix
        this.node.translation = vec3.add(vec3.create(), this.node.translation, vec3.scale(vec3.create(), this.direction, dt));
    }
    rotate(axis,k){
        //Calculate the angle of rotation
        const x = -k * 90 * (axis == this.up);
        const y = -k * 90 * (axis == this.right)
        
        //Swap axis
        this.temp = this.forward;
        this.forward = vec3.scale(quat.create(), axis,k);
        axis = vec3.scale(quat.create(), this.temp,-k);

        //Rotate the snake
        this.node.rotation = quat.mul(quat.create(), this.node.rotation, quat.fromEuler(quat.create(),x,y,0));
        this.rotating = true;
    }

    keydownHandler(e) {
        this.rotating = false;
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
        this.direction = vec3.create();
    }
}
