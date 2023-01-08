import { Application } from '../Engine/Application.js';

import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { FirstPersonController } from '../Engine/FirstPersonController.js';

class App extends Application {

    async start() {
        this.loaderMap = new GLTFLoader();
        this.loaderSnake = new GLTFLoader();
        this.renderer = new Renderer(this.gl);

        //Load the map
        await this.loaderMap.load('../Assets/3d models/mapa/mapa.gltf');
        this.scene = await this.loaderMap.loadScene(this.loaderMap.defaultScene);

        //Load the snake
        await this.loaderSnake.load('../Assets/3d models/snake/gltf-ji/snake_head.gltf');
        await this.loaderSnake.loadScene(this.loaderSnake.defaultScene);
        this.snake = await this.loaderSnake.loadNode("Head");
        this.tail = await this.loaderSnake.loadNode("Head");
        this.camera = await this.loaderMap.loadNode('Camera');

        await this.loaderSnake.load('../Assets/3d models/snake/gltf-ji/snek_body.gltf');
        await this.loaderSnake.loadScene(this.loaderSnake.defaultScene);
        this.body = await this.loaderSnake.loadNode("Body");

        await this.loaderSnake.load('../Assets/3d models/snake/gltf-ji/snake_tail.gltf');
        await this.loaderSnake.loadScene(this.loaderSnake.defaultScene);
        this.tail = await this.loaderSnake.loadNode("Tail");


        this.scene.addNode(this.snake);
        //this.scene.addNode(this.body);
        this.scene.addNode(this.tail);

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.renderer.prepareScene(this.scene);
        this.controller = new FirstPersonController(this.snake,this.tail, canvas);
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


