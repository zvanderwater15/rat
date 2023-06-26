import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ratContainer = document.getElementById("creature");
let headerHeight = document.getElementById("title").offsetHeight;
let ratContainerWidth = ratContainer.offsetWidth;
let ratContainerHeight = window.innerHeight - (headerHeight * 2);

console.log(ratContainerHeight);
//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );

const camera = new THREE.PerspectiveCamera( 50, ratContainerWidth / ratContainerHeight, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 0.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( ratContainerWidth, ratContainerHeight );
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

ratContainer.appendChild( renderer.domElement );

const loader = new GLTFLoader();
const clock = new THREE.Clock();
let mixer;

loader.load( '/rat/rat.glb', function ( gltf ) {
    const model = gltf.scene;
	scene.add( model );
    mixer = new THREE.AnimationMixer( model );
    const animations = ["idle", "walk", "attack", "hit"];
    mixer.clipAction( gltf.animations[ 0 ] ).play();
    animate();
}, undefined, function ( error ) {
	console.error( error );
} );

window.onresize = function () {
    headerHeight = document.getElementById("title").offsetHeight;
    ratContainerWidth = ratContainer.offsetWidth;
    ratContainerHeight = window.innerHeight - (headerHeight * 2);
    camera.aspect = ratContainerWidth / ratContainerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( ratContainerWidth, ratContainerHeight );

};

function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    mixer.update( delta );
    controls.update();
    renderer.render(scene, camera);
}


// const geometry = new THREE.BoxGeometry( 1, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
// const cube = new THREE.Mesh( geometry, material);
// scene.add( cube );


