
import { vec3,mat4,quat } from '../lib/gl-matrix-module.js';

export class FirstPersonController {
    constructor(node, camera, domElement) {
        this.node = node;
        this.dom = domElement;
        this.keys = {};

        this.rotating = false;

        // Movement speed in units per second
        this.speed = 1;

        // Current direction the controller is moving
        this.direction = vec3.create();

        // Current orientation of the controller
        this.forward = vec3.fromValues(0, 0, 1);
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.fromValues(1, 0, 0);
        this.temp = vec3.fromValues(0,0,0);
        this.yaw = 0;
        
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
        // Update the direction the controller is moving
        this.direction = vec3.add(vec3.create(), this.direction, vec3.scale(vec3.create(), this.forward, dt * this.speed));

        // Update the orientation of the controller
        if (this.keys['KeyW'] && !this.rotating) {
            // Rotate the forward vector upwards around the right vector
            this.temp = this.forward;
            this.forward = this.up;
            this.up = vec3.scale(quat.create(), this.temp,-1);
            this.node.rotation = quat.mul(quat.create(), this.node.rotation, quat.fromEuler(quat.create(), -90, 0, 0));
            this.rotating = true;
        }
        if (this.keys['KeyS'] && !this.rotating) {
            // Rotate the forward vector downwards around the right vector
            this.temp = this.forward;
            this.forward = vec3.scale(quat.create(), this.up,-1);
            this.up = this.temp;
            this.node.rotation = quat.mul(quat.create(), this.node.rotation, quat.fromEuler(quat.create(), 90, 0, 0));
            this.rotating = true;
        }
        if (this.keys['KeyA'] && !this.rotating) {
            // Rotate the forward vector to the left around the up vector
            this.temp = this.forward;
            this.forward = this.right;
            this.right =  vec3.scale(quat.create(), this.temp,-1);
            this.node.rotation = quat.mul(quat.create(), this.node.rotation, quat.fromEuler(quat.create(), 0, 90, 0));
            this.rotating = true;
        }
        if (this.keys['KeyD'] && !this.rotating) {
            // Rotate the forward vector to the right around the up vector
            this.temp = this.forward;
            this.forward = vec3.scale(quat.create(), this.right,-1);
            this.right =  this.temp;
            this.node.rotation = quat.mul(quat.create(), this.node.rotation, quat.fromEuler(quat.create(), 0, -90, 0));
            this.rotating = true;
        }
        
        // Update the node's transformation matrix
        this.node.translation = vec3.add(vec3.create(), this.node.translation, vec3.scale(vec3.create(), this.direction, dt));
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
