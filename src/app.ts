import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

let CAR_SPEED = 0.2;

// scene
const scene = new THREE.Scene();
// object
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({});
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);
// camera
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	100
);
camera.position.set(20, 40, 40);

// light
// const light = new THREE.PointLight(new THREE.Color(0xffffff));
// light.position.y = 30;
// scene.add(light);
const light2 = new THREE.DirectionalLight(new THREE.Color(0xffffff));
light2.position.set(20, 20, 20);
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.1;
light2.shadow.camera.far = 200;
light2.shadow.camera.right = 20;
light2.shadow.camera.left = -20;
light2.shadow.camera.top = 20;
light2.shadow.camera.bottom = -20;
scene.add(light2);

// const helper = new THREE.CameraHelper(light2.shadow.camera);
// scene.add(helper);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// helpers
new OrbitControls(camera, renderer.domElement);

// geometries

// const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), boxMaterial);
// sphere.position.x = 10;
// sphere.castShadow = true;
// scene.add(sphere);
// const plane = new THREE.Mesh(
// 	new THREE.PlaneGeometry(5, 3, 10, 10),
// 	boxMaterial
// );
// plane.position.z = 10;
// plane.rotateX(-Math.PI / 2);
// scene.add(plane);

// const donut = new THREE.Mesh(new THREE.TorusGeometry(2), boxMaterial);
// donut.position.set(10, 0, 10);
// scene.add(donut);
// const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(2), boxMaterial);
// knot.position.set(10, 10, 10);
// scene.add(knot);

// // const shadowPlane = new THREE.Mesh(
// // 	new THREE.PlaneGeometry(100, 100),
// // 	new THREE.MeshPhongMaterial({ color: 0xffffff })
// // );
// // shadowPlane.rotateX(-Math.PI / 2);
// // shadowPlane.position.y = -4;
// // shadowPlane.receiveShadow = true;
// // scene.add(shadowPlane);

// const planeGeometry = new THREE.PlaneGeometry(100, 20);
// const plane2 = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial());
// plane2.rotateX(-Math.PI / 2);
// plane2.position.y = -3;
// plane2.receiveShadow = true;
// scene.add(plane2);

// GAME CODE
const track = new THREE.Mesh(new THREE.PlaneGeometry(10, 60), boxMaterial);
track.rotateX(-Math.PI / 2);
track.receiveShadow = true;
scene.add(track);

const car = new THREE.Mesh(
	new THREE.BoxGeometry(3, 2, 5),
	new THREE.MeshLambertMaterial({ color: 'red' })
);
car.position.set(2.5, 1, 20);
car.castShadow = true;
scene.add(car);

const enemyCars: THREE.Mesh[] = [];
const intervals: NodeJS.Timer[] = [];
let score = 0;
function increaseScore() {
	score++;
	document.getElementById('score')!.innerText = String(score);
	CAR_SPEED = 0.2 + Math.floor(score / 10) / 10;
}

function startEnemyCar() {
	const enemyCar = new THREE.Mesh(
		new THREE.BoxGeometry(3, 2, 5),
		new THREE.MeshLambertMaterial({ color: 'green' })
	);
	enemyCar.position.set(Math.random() > 0.5 ? 2.5 : -2.5, 1, -35);
	enemyCar.castShadow = true;
	scene.add(enemyCar);
	enemyCars.push(enemyCar);
	const interval = setInterval(() => {
		if (enemyCar.position.z > 35) {
			enemyCar.position.z = -35;
			enemyCar.position.x = Math.random() > 0.5 ? 2.5 : -2.5;
			increaseScore();
			return;
		}
		enemyCar.position.z += CAR_SPEED;
	}, 10);
	intervals.push(interval);
}
startEnemyCar();
setTimeout(startEnemyCar, 1000);
setTimeout(startEnemyCar, 2000);
setTimeout(startEnemyCar, 3000);

document.addEventListener('keydown', (e) => {
	let position;
	if (e.key === 'a') {
		position = -2.5;
	} else if (e.key === 'd') {
		position = 2.5;
	}

	new TWEEN.Tween(car.position).to({ x: position }, 100).start();
});

function render() {
	renderer.render(scene, camera);
}

function animate() {
	const carBox = new THREE.Box3().setFromObject(car);

	render();
	TWEEN.update();
	const frame = requestAnimationFrame(animate);
	for (let enemy of enemyCars) {
		const enemyBox = new THREE.Box3().setFromObject(enemy);
		const isColliding = carBox.intersectsBox(enemyBox);
		if (isColliding) {
			alert('you lost');
			cancelAnimationFrame(frame);
			intervals.forEach(clearInterval);
		}
	}
}
animate();
