import { Application } from '../Engine/Application.js';

import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { FirstPersonController } from '../Engine/FirstPersonController.js';
import { vec3, quat } from '../lib/gl-matrix-module.js';

class App extends Application {

    async start() {
        this.loaderMap = new GLTFLoader();
        this.loaderSnake = new GLTFLoader();
        this.renderer = new Renderer(this.gl);
        this.planets = [];

        //Load the map
        await this.loaderMap.load('../Assets/3d models/mapa/mapa.gltf');
        this.scene = await this.loaderMap.loadScene(this.loaderMap.defaultScene);
        this.camera = await this.loaderMap.loadNode('Camera');

        await this.loaderMap.load('../Assets/3d models/planeti/planet_moder.gltf');
        this.planets.push(await this.loaderMap.loadNode("moder"));

        await this.loaderMap.load('../Assets/3d models/planeti/planet_vijolcen.gltf');
        this.planets.push(await this.loaderMap.loadNode("vijolcen"));

        await this.loaderMap.load('../Assets/3d models/planeti/planet_zelen.gltf');
        this.planets.push(await this.loaderMap.loadNode("zelen"));
        
        await this.loaderMap.load('../Assets/3d models/planeti/planet_roza.gltf');
        this.planets.push(await this.loaderMap.loadNode("roza"));

        await this.loaderMap.load('../Assets/3d models/asteroidi/asteorid.gltf');
        this. asteroid = await this.loaderMap.loadNode("asteroid")
        for (let i = 0; i < 100; i++) {
            this.as = this.asteroid.clone();
            this.as.translation = this.randomVec(350);
            this.scene.addNode(this.as);
            
        }

        //Load the snake
        await this.loaderSnake.load('../Assets/3d models/snake/gltf-ji/snake_head.gltf');
        this.head = await this.loaderSnake.loadNode("Head");
        this.tail = await this.loaderSnake.loadNode("Head");
        this.camera = await this.loaderSnake.loadNode('Camera');

        await this.loaderSnake.load('../Assets/3d models/snake/gltf-ji/snek_body.gltf');
        this.body = await this.loaderSnake.loadNode("Body");

        await this.loaderSnake.load('../Assets/3d models/snake/gltf-ji/snake_tail.gltf');
        this.tail = await this.loaderSnake.loadNode("Tail");
        for (let i = 0; i < 10; i++) {
            this.planets.push(this.planets[0].clone());
            this.planets.push(this.planets[1].clone());
            this.planets.push(this.planets[2].clone());
            this.planets.push(this.planets[3].clone());
            
        }
        this.scene.addNode(this.head);
        this.scene.addNode(this.tail);
        this.planets.forEach(planet => {
            planet.translation = this.randomVec(350);
            planet.scale = this.randomScale(35);
            this.scene.addNode(planet);
        });


        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.renderer.prepareScene(this.scene);
        this.controller = new FirstPersonController(this.head,this.body,this.tail, canvas);
    }
    update(dt) {
        this.controller.update(dt);
        this.planets.forEach(planet => {
            if (this.collided(planet)) {
              this.scene.removeNode(planet);
              console.log("yeet",planet);
            }
        });
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.camera.camera.aspect = width / height;
        this.camera.camera.updateProjectionMatrix();
    }
    randomVec(n){
        return [this.rng(n),this.rng(n),this.rng(n)];
    }
    randomScale(n){
        const s = this.rng(n);
        return [s,s,s];
    }
    rng(n){
        return Math.floor(Math.random()*n-n/2);
    }
    collided(object) {
        const d = vec3.distance(vec3.create(), this.head.translation, object.translation);
        return d < object.scale[0]/2;
      }
      

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();


