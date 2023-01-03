import { Application } from '../Engine/Application.js';

import { GLTFLoader } from '../GLTF/GLTFLoader.js';
import { Renderer } from './renderer.js';

class App extends Application {

    async start() {
        this.loader = new GLTFLoader();
        await this.loader.load('../Assets/3d models/GLTFs/snek_head.gltf');

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');
        this.camera.camera = this.camera.children[0].camera;

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.camera.camera.aspect = width / height;
        this.camera.camera.updateProjectionMatrix();
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();

