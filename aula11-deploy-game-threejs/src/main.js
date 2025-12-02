
import {AmbientLight, Color, LoadingManager, Mesh, MeshStandardMaterial, PerspectiveCamera, PointLight, Scene, Sphere, SphereGeometry, Vector3, WebGLRenderer} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { createSkyBox } from './skybox'


const  QTD_ENEMIES  = 10;
const HIT_RADIUS = .125
let TOTAL_SHOTS = 1000

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new Scene()
scene.background = new Color(0x000000)

const camera = new PerspectiveCamera(
  40, //campo de visao vertical 
  window.innerWidth / window.innerHeight, //aspecto da imagem (Largura/Altura)
  0.1, //Plano proximo
  1000 //Plano distante
);
camera.position.set(0, .25, 2) //posicao da camera set(x,y,z)

const skyBox = await createSkyBox('bluesky', 500)
skyBox.position.y = .25
scene.add(skyBox)


const light = new AmbientLight(0xffffff, 20);
scene.add(light);

const plight = new PointLight(0xffffff, 250, 50,.5);
plight.position.set(0, 25, 10);
scene.add(plight);

const jetPath = 'models/f15c/'
const mtlFile = 'f15c.mtl'
const objFile = 'f15c.obj'

const manager = new LoadingManager();
const mtlLoader = new MTLLoader(manager);
const objLoader = new OBJLoader();

mtlLoader.setPath(jetPath)
objLoader.setPath(jetPath)

objLoader.setMaterials(await mtlLoader.loadAsync(mtlFile))
const jet = await objLoader.loadAsync(objFile)
const jetJoystick = { x: null, y: null }

jet.scale.setScalar(.5)
jet.position.y = -.2
jet.shots = new Array()
scene.add(jet)

const enemyMtlFile = 'f15c_e.mtl'
const enemyMtlLoader = new MTLLoader(manager);
const enemyObjLoader = new OBJLoader();

enemyMtlLoader.setPath(jetPath)
enemyObjLoader.setPath(jetPath)
enemyObjLoader.setMaterials(await enemyMtlLoader.loadAsync(enemyMtlFile))

const enemy = await enemyObjLoader.loadAsync(objFile)
enemy.scale.setScalar(.5)
enemy.position.y = .4
enemy.rotateY(3.14)

scene.add(enemy);

const enemies = createEnemies(QTD_ENEMIES)

enemy.position.z = -1000;

const sphere_geometry = new SphereGeometry(HIT_RADIUS / 2, 64, 32);
const sphereColor = new MeshStandardMaterial({ color: 0xffff00 });
const sphere = new Mesh(sphere_geometry, sphereColor);

const hitSphere = new Sphere(new Vector3(0, 0, 0), HIT_RADIUS)


const gameLoop=()=>{
  skyBox.rotation.y += .001
  skyBox.position.z += .001
  enemies.forEach((e)=>moveEnemy(e))
  moveJet()
  updateShots()
  renderer.render(scene, camera)
	requestAnimationFrame(gameLoop)
}

function createEnemies(qtdEnemies) {
  let distance = 5
  let horizontalLimit = 5
  return Array.from({ length: qtdEnemies }).map(() => {
    enemy.position.z = -(Math.random() * distance + distance)
    enemy.position.x = (Math.random() * (Math.random() > .5 ? 1 : -1));
    enemy.position.x *= horizontalLimit
    let enemyClone = {
      model: enemy.clone(),
      dead: false
    }
    scene.add(enemyClone.model)
    return enemyClone
  })
}

function updateJoystick(event) {
  if (!event.buttons) {
    jetJoystick.x = event.clientX
    jetJoystick.y = event.clientY
  } else {
    jetJoystick.x = null
    jetJoystick.y = null
  }
  const {x,y} = jetJoystick
  console.log(x,y)  
}

function moveJet() {
  if (jet
    && jetJoystick.x
    && jetJoystick.y) {

    let wh = window.innerHeight
    let ww = window.innerWidth

    jet.rotation.x += (jetJoystick.y - wh / 2) / wh / 100
    
    if (Math.abs(jet.position.x) > 1) {
      jet.position.x = jet.position.x / Math.abs(jet.position.x)
    } else {
      jet.rotation.z -= (jetJoystick.x - ww / 2) / ww / 10
    }

    if (Math.abs(jet.rotation.z) != 0) {
      jet.position.x += (jetJoystick.x - ww / 2) / ww / 10
      jet.rotation.y = jet.rotation.z / 2.5
    }

    if (Math.abs(jet.rotation.y) > .5)
      jet.rotation.y = .5 * (jet.rotation.y / Math.abs(jet.rotation.y))
  }
}

function moveEnemy(enemy) {
  let velocity = .16
  let distance = enemy.model.position.z
  if (!enemy.dead) {
    if (distance > 30) {
      enemy.model.position.z = -(Math.random() * 100 + 100)
      enemy.model.position.x = Math.random() * (Math.random() > .5 ? 5 : -5);
    } else if (distance > -40) {
      velocity += .48
    } else if (distance > -30) {
      velocity += .32
    } else if (distance > -10) {
      velocity += .24
    }
    enemy.model.position.z += velocity
  }
}

function shooting() {
  if (TOTAL_SHOTS > 0) {
    if (jet.shots.length > 50)
      return 0
    TOTAL_SHOTS--
    const shot = {
      rx: jet.rotation.z,
      ry: jet.rotation.x,
      model: sphere.clone(),
      hit: hitSphere.clone(),
    }
    shot.hit.radius = HIT_RADIUS / 2
    shot.model.material.transparent = true
    shot.model.material.opacity = .5
    shot.model.material.emissive = new Color(0xffff00)
    shot.model.material.roughness = .5
    shot.model.material.metalness = 1
    shot.model.position.set(...jet.position)
    shot.hit.center.copy(shot.model.position)
    scene.add(shot.model)
    jet.shots.push(shot)
  } else {
    console.warn("ACABOU A MUNIÇÃO!!!")
  }
}

function updateShots() {
  if (jet.shots.length == 0) return 0
  jet.shots.forEach((shot) => {
    shot.model.position.z -= 1
    shot.model.position.x += -shot.rx / 2
    shot.model.position.y += shot.ry / 5
    shot.hit.center.copy(shot.model.position)
  })

  jet.shots = jet.shots.filter((shot) => {
    if (shot.model.position.z < -150) {
      scene.remove(shot.model)
      return false
    }
    return true
  })
}



window.addEventListener('mousemove', updateJoystick);
window.addEventListener('click', shooting);
window.addEventListener('keydown', e =>{
  return ((e.key == ' ' || e.key == 'Enter') && shooting())
});

gameLoop()