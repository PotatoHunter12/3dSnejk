import { Application } from '../Engine/Application.js';

import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { FirstPersonController } from '../Engine/FirstPersonController.js';

class App extends Application {

    async start() {
        this.loaderMap = new GLTFLoader();
        this.loaderSnake = new GLTFLoader();

        this.renderer = new Renderer(this.gl);

        await this.loaderSnake.load('../Assets/3d models/snake/head/snake_head.gltf');
        await this.loaderMap.load('../Assets/3d models/mapa/mapa.gltf');
        await this.loaderSnake.loadScene(this.loaderSnake.defaultScene);

        this.snek = await this.loaderSnake.loadNode("cube");
        this.scene = await this.loaderMap.loadScene(this.loaderMap.defaultScene);

        this.camera = await this.loaderSnake.loadNode('Camera');
        this.scene.addNode(this.snek);

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }
        
        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }
        
        this.renderer.prepareScene(this.scene);
        this.controller = new FirstPersonController(this.snek, canvas);
    }
    update(dt) {
        this.controller.update(dt);
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


