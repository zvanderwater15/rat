import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ratContainer = document.getElementById("creature");
let headerHeight = document.getElementById("title").offsetHeight;
let ratContainerWidth = ratContainer.offsetWidth;
let ratContainerHeight = window.innerHeight - (headerHeight * 2);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor( 0x000000, 0 ); // the default
renderer.setSize( ratContainerWidth, ratContainerHeight );
renderer.outputColorSpace = THREE.SRGBColorSpace;

//scene
const scene = new THREE.Scene();
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );

const camera = new THREE.PerspectiveCamera( 50, ratContainerWidth / ratContainerHeight, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 0.5;


const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

ratContainer.appendChild( renderer.domElement );

const loader = new GLTFLoader();
const clock = new THREE.Clock();
let mixers = [];

/*
animations = ["idle", "walk", "attack", "hit"]
*/
function ratLoader(scene, mixers, scale, position, animationIndex) {
    loader.load( '/rat/rat/rat.glb', function ( gltf ) {
        const model = gltf.scene;
        model.position.setY(position);
        scene.add( model );
        const mixer = new THREE.AnimationMixer( model );
        model.scale.set(scale, scale, scale);     
        mixer.clipAction( gltf.animations[ animationIndex ] ).play();
        mixer.timeScale = 4/5 ;
        mixers.push(mixer);
        console.log("yeah we loading")
        animate();
    }, undefined, function ( error ) {
        console.error( error );
    } );   
}

ratLoader(scene, mixers, 1, 0, 0);
ratLoader(scene, mixers, 0.25, 0.38, 2);
ratLoader(scene, mixers, 0.05, 0.48, 3);

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
    for (let mixer of mixers) {
        mixer.update( delta );
    }
    controls.update();
    renderer.render(scene, camera);
}




