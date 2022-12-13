var scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var loader = new THREE.GLTFLoader();

loader.load('Assets/3d models/snek_head.gltf', function (gltf) {

	scene.add(gltf.scene);
	
	const model = gltf.scene.getObjectByName("Cube002");
	gltf.scene.traverse((object) => {
		// Do something with each object, such as logging its name
		console.log(object.name);
	});
	
	scene.traverse((object) => {
		// Do something with each object, such as logging its name
		console.log(object.name);
	});
	renderer.render(scene, gltf.cameras[0]);

});


