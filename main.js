import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 0.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.getElementById("creature").appendChild( renderer.domElement );

const loader = new GLTFLoader();
const clock = new THREE.Clock();
let mixer;

loader.load( '/rat/rat.glb', function ( gltf ) {
    const model = gltf.scene;
	scene.add( model );
    // idle, walk, attack hit
    console.log(gltf.animations);
    mixer = new THREE.AnimationMixer( model );
    mixer.clipAction( gltf.animations[ 0 ] ).play();
}, undefined, function ( error ) {

	console.error( error );

} );

function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    mixer.update( delta );
    renderer.render(scene, camera);
}
animate();

// const geometry = new THREE.BoxGeometry( 1, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
// const cube = new THREE.Mesh( geometry, material);
// scene.add( cube );


