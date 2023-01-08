import { Application } from '../Engine/Application.js';

import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { FirstPersonController } from '../Engine/FirstPersonController.js';
import { vec3 } from '../lib/gl-matrix-module.js';

class App extends Application {

    async start() {
        this.loaderMap = new GLTFLoader();
        this.loaderSnake = new GLTFLoader();
        this.renderer = new Renderer(this.gl);
        this.planets = [];

        this.scaleLimit = 50;
        this.mapLimit = 350;
        this.numAsteorids = 10;
        this.numPlanets = 10;

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
        this. asteorid = await this.loaderMap.loadNode("asteroid")
        for (let i = 0; i < this.numAsteorids; i++) {
            this.as = this.asteorid.clone();
            this.as.translation = this.randomVec(this.mapLimit);
            this.scene.addNode(this.as);
            
        }

        await this.loaderMap.load('../Assets/3d models/satelit/satelit.gltf');
        this.sat = await this.loaderMap.loadNode("satelit");
        for (let i = 0; i < 5; i++) {
            this.st = this.sat.clone();
            this.st.translation = this.randomVec(this.mapLimit);
            this.scene.addNode(this.st);
            
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
        for (let i = 0; i < this.numPlanets; i++) {
            this.planets.push(this.planets[0].clone());
            this.planets.push(this.planets[1].clone());
            this.planets.push(this.planets[2].clone());
            this.planets.push(this.planets[3].clone());
            
        }
        this.scene.addNode(this.head);
        this.scene.addNode(this.tail);
        this.planets.forEach(planet => {
            planet.translation = this.randomVec(this.mapLimit);
            planet.scale = this.randomScale(this.scaleLimit);
            this.scene.addNode(planet);
        });


        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        //Render scene
        this.renderer.prepareScene(this.scene);
        this.controller = new FirstPersonController(this.head,this.body,this.tail, canvas);
    }
    update(dt) {
        this.controller.update(dt);

        //Eat planets that collide with the snakes head
        this.planets.forEach(planet => {
            if (this.collided(planet)) {
                console.log(planet.scale[0]);
                //If the planet is too big, end game
                if(planet.scale[0] > 10){
                    window.location = "../Web/game_over.html";
                }
                else{
                    this.scene.removeNode(planet);
                    const i = this.planets.indexOf(planet);
                    const rep = planet.clone();

                    if (i >= 0) {
                        this.planets.splice(i, 1);
                    }
                    
                    //Planets become smaller because the snake is bigger
                    this.planets.forEach(p => {
                        p.scale = vec3.scale(vec3.create(),p.scale,0.8);
                        //Replace planets that are too small
                        if (p.scale[0] < 1){
                            const rep2 = p.clone();
                            rep2.translation = this.randomVec(this.mapLimit);
                            rep2.scale = this.randomScale(this.scaleLimit);
                            this.scene.addNode(rep2);
                            const j = this.planets.indexOf(planet);
                            if (j >= 0) {
                                this.planets.splice(j, 1);
                            }
                            this.planets.push(rep2);
                            console.log("too smol");
                        }
                    });
                    //replace the eaten planet
                    rep.translation = this.randomVec(this.mapLimit);
                    rep.scale = this.randomScale(this.scaleLimit);
                    this.scene.addNode(rep);
                    this.planets.push(rep);

                    console.log("yeet",planet);
                }
               
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
        return [Math.floor(Math.random()*n-n/2),Math.floor(Math.random()*n-n/2),Math.floor(Math.random()*n-n/2)];
    }
    randomScale(n){
        const s = Math.floor(Math.random()*n);;
        return [s,s,s];
    }
    collided(object) {
        return this.distance(object.translation,this.head.translation) < object.scale[0] + 1;
    }
    distance(a,b){
        const x = b[0] - a[0];
        const y = b[1] - a[1];
        const z = b[2] - a[2];

        return Math.sqrt(x*x+y*y+z*z);
    }
      

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();


