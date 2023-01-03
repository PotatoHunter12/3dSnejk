// import { Renderer } from './renderer.js';
// import { Application } from '../Engine/Application.js';

// var scene = new THREE.Scene();

// const renderer = new Renderer();
// // renderer.setSize( window.innerWidth, window.innerHeight );
// // document.body.appendChild( renderer.domElement );

// var loader = new THREE.GLTFLoader();

// loader.load('Assets/3d models/snek_head.gltf', function (gltf) {

// 	scene.add(gltf.scene);
	
// 	const model = gltf.scene.getObjectByName("Cube002");
// 	gltf.scene.traverse((object) => {
// 		// Do something with each object, such as logging its name
// 		console.log(object.name);
// 	});
	
// 	scene.traverse((object) => {
// 		// Do something with each object, such as logging its name
// 		console.log(object.name);
// 	});
// 	renderer.render(scene, gltf.cameras[0]);

//});
import { Application } from '../Engine/Application.js';

import { GLTFLoader } from '../GLTF/GLTFLoader.js';
import { Renderer } from './renderer.js';

class App extends Application {

    async start() {
        this.loader = new GLTFLoader();
        await this.loader.load('../Assets/3d models/GLTFs/snek_head.gltf');

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');

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

