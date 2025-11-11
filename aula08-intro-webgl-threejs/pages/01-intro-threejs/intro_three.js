import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer()

const container = document.querySelector('.container3d')
const {width,height} = container.getBoundingClientRect()
console.dir(container.getBoundingClientRect())

renderer.setSize(width, height)
container.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

let aspecto = 1
const camera = new THREE.PerspectiveCamera(
	75, //campo de visao vertical
	aspecto, //aspecto da imagem (Largura/Altura)
	0.1, //Plano proximo
	110//Plano distante
);
camera.position.z = 50

const geometry = new THREE.BoxGeometry(20, 20, 20)
const cor = {color:0x00ff00};
const material = new THREE.MeshBasicMaterial(cor)
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// cube.position.z = -50;
// cube.position.x = 50;
// cube.position.y = 50;

// cube.rotation.x += .5
// 	cube.rotation.y += .5
// 	cube.rotation.z += .5
// renderer.render(scene, camera)


cube.rotation.x += .5
cube.rotation.y += .5
cube.rotation.z += .5

// renderer.render(scene, camera)

const velRotate = .01;

const animate=()=>{
   //inputs (controls)
	cube.rotation.x += velRotate
	cube.rotation.y += velRotate
	cube.rotation.z += velRotate
	renderer.render(scene, camera)
	// camera.position.z += .5
	requestAnimationFrame(animate)
}

animate()










