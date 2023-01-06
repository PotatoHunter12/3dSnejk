import { vec3,mat4,quat } from '../lib/gl-matrix-module.js';

export class FirstPersonController {
    constructor(node, domElement) {
        this.node = node;
        this.dom = domElement;
        this.keys = {};

        // Movement speed in units per second
        this.speed = 10;

        // Rotation speed in radians per second
        this.turnSpeed = Math.PI / 2;

        // Current direction the controller is moving
        this.direction = vec3.create();

        // Current orientation of the controller
        this.forward = vec3.fromValues(1, 0, 0);
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.fromValues(0, 0, 1);
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
        if (this.keys['KeyW']) {
            // Rotate the forward vector upwards around the right vector
            this.forward = vec3.rotateY(vec3.create(), this.forward, this.right, -dt * this.turnSpeed);
        }
        if (this.keys['KeyS']) {
            // Rotate the forward vector downwards around the right vector
            this.forward = vec3.rotateY(vec3.create(), this.forward, this.right, dt * this.turnSpeed);
        }
        if (this.keys['KeyA']) {
            // Rotate the forward vector to the left around the up vector
            this.forward = vec3.rotateX(vec3.create(), this.forward, this.up, dt * this.turnSpeed);
        }
        if (this.keys['KeyD']) {
            // Rotate the forward vector to the right around the up vector
            this.forward = vec3.rotateX(vec3.create(), this.forward, this.up, -dt * this.turnSpeed);
        }

        // Update the yaw angle
        this.yaw = Math.atan2(this.forward[2], this.forward[0]);

        // Update the position of the node
        this.node.translation = vec3.add(vec3.create(), this.node.translation, this.direction);

        // Update the orientation of the node
        const orientation = mat4.create();
        mat4.fromRotationTranslation(orientation, quat.fromEuler(quat.create(), 0, this.yaw, 0), this.node.translation);
        this.node.setOrientation(orientation);
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }
}
