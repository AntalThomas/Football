import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//Screen Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xd3d3d3)
//Outside Oval


//Oval
const shape = new THREE.Shape()
shape.absellipse(0, 0, 6, 3.5, 0, Math.PI * 2)
const ovalGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.7 })
const ovalMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, })
const mesh = new THREE.Mesh(ovalGeometry, ovalMaterial)
mesh.rotation.x = Math.PI / 2
mesh.receiveShadow = true
scene.add(mesh)

//Football
const geometry = new THREE.CapsuleGeometry(0.1, 0.1, 4, 8)
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const computerMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 })
const playerFootball = new THREE.Mesh(geometry, playerMaterial)
const computerFootball = new THREE.Mesh(geometry, computerMaterial)
playerFootball.position.set(0.1, 0.55, 0)
computerFootball.position.set(-0.1, 0.55, 0)
scene.add(playerFootball, computerFootball)

//Ceate Post
const createPost = (x, y, z, geometry, material) => {
  const post = new THREE.Mesh(geometry, material)
  post.position.set(x, y, z)
  post.castShadow = true
  return post
}

//Goal & Point Posts
const goalGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 10)
const pointGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 10)
const postMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })

const goalPost1 = createPost(5.1, 1,  0.5, goalGeometry, postMaterial)
const goalPost2 = createPost(5.1, 1, -0.5, goalGeometry, postMaterial)
const goalPost3 = createPost(-5.1, 1, -0.5, goalGeometry, postMaterial)
const goalPost4 = createPost(-5.1, 1,  0.5, goalGeometry, postMaterial)

const pointPost1 = createPost(5.1, 1,  1.5, pointGeometry, postMaterial)
const pointPost2 = createPost(5.1, 1, -1.5, pointGeometry, postMaterial)
const pointPost3 = createPost(-5.1, 1, -1.5, pointGeometry, postMaterial)
const pointPost4 = createPost(-5.1, 1,  1.5, pointGeometry, postMaterial)

scene.add(
  goalPost1,
  goalPost2,
  goalPost3,
  goalPost4,
  pointPost1,
  pointPost2,
  pointPost3,
  pointPost4
)

//Light
const light = new THREE.DirectionalLight(0xffffff, 10)
light.position.set(-4, 5, 10)
light.castShadow = true
light.shadow.camera.left = -10
light.shadow.camera.right = 10
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
scene.add(light)

// add 3 extra lights to simulate light posts
// you will need to turn down the intensity of the light and the shadow

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
camera.position.y = 4
camera.position.x = -2
scene.add(camera)

//Visualize Light
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper)

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enablePan = false
controls.enableZoom = false

//Resize
window.addEventListener('resize', () => {
  //Update Sizes
  sizes.height = window.innerHeight
  sizes.width = window.innerWidth
  //Update Camera
  camera.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width, sizes.height)
  camera.updateProjectionMatrix()
})

const loop = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

const kickGoal = () => {
  // Clicking the button multiple times will not work
  if (playerFootball.position.x != 0.1) return
  if (computerFootball.position.x != -0.1) return

  var highestPoint = false
  const randomZPlayer = (Math.random() * 0.014) - 0.007
  const randomZComputer = (Math.random() * 0.012) - 0.006

  const animate = () => {
    // Playerball
    if (playerFootball.position.x < 11) {
      if (playerFootball.position.y <= 2.5 && !highestPoint) {
        playerFootball.position.y += 0.02
        playerFootball.position.x += 0.03
        playerFootball.position.z += randomZPlayer

        playerFootball.rotation.z += 0.1
        requestAnimationFrame(animate)
      } else if (playerFootball.position.y > 0.55) {
        playerFootball.position.y -= 0.015
        playerFootball.position.x += 0.02
        playerFootball.position.z += randomZPlayer
        
        playerFootball.rotation.z += 0.05

        highestPoint = true
        requestAnimationFrame(animate)
      } else {
        if (playerFootball.position.z > -0.34 && playerFootball.position.z < 0.34) {
          const playerTotal = document.querySelector('.playerTotal')
          const playerGoals = document.querySelector('.playerGoals')

          playerTotal.innerHTML = parseInt(playerTotal.innerHTML) + 6
          playerGoals.innerHTML = parseInt(playerGoals.innerHTML) + 1
        } else if (playerFootball.position.z <= -0.34 || playerFootball.position.z >= -1.34) {
          const playerTotal = document.querySelector('.playerTotal')
          const playerBehinds = document.querySelector('.playerBehinds')
          
          playerTotal.innerHTML = parseInt(playerTotal.innerHTML) + 1
          playerBehinds.innerHTML = parseInt(playerBehinds.innerHTML) + 1
        }

        playerFootball.position.set(0.1, 0.55, 0)
        playerFootball.rotation.set(0, 0, 0)
      }
    }

  }
  const animateComputer = () => {

    // Computer
    if (computerFootball.position.x < 11) {
      if (computerFootball.position.y <= 2.5 && !highestPoint) {
        computerFootball.position.y += 0.02
        computerFootball.position.x -= 0.03
        computerFootball.position.z += randomZComputer

        computerFootball.rotation.z += 0.1
        requestAnimationFrame(animateComputer)
      } else if (computerFootball.position.y > 0.55) {
        computerFootball.position.y -= 0.015
        computerFootball.position.x -= 0.02
        computerFootball.position.z += randomZComputer
        
        computerFootball.rotation.z += 0.05

        highestPoint = true
        requestAnimationFrame(animateComputer)
      } else {
        if (computerFootball.position.z > -0.34 && computerFootball.position.z < 0.34) {
          const computerTotal = document.querySelector('.computerTotal')
          const computerGoals = document.querySelector('.computerGoals')

          computerTotal.innerHTML = parseInt(computerTotal.innerHTML) + 6
          computerGoals.innerHTML = parseInt(computerGoals.innerHTML) + 1
        } else if (computerFootball.position.z <= -0.34 || computerFootball.position.z >= -1.34) {
          const computerTotal = document.querySelector('.computerTotal')
          const computerBehinds = document.querySelector('.computerBehinds')
          
          computerTotal.innerHTML = parseInt(computerTotal.innerHTML) + 1
          computerBehinds.innerHTML = parseInt(computerBehinds.innerHTML) + 1
        }

        computerFootball.position.set(-0.1, 0.55, 0)
        computerFootball.rotation.set(0, 0, 0)
      }
    }

  }
  animate()
  animateComputer()
}

const moveLeft = () => {
  if (playerFootball.position.x == 0) return
  playerFootball.position.z -= 0.03
}

const moveRight = () => {
  if (playerFootball.position.x == 0) return
  playerFootball.position.z += 0.03
}

window.kickGoal = kickGoal
window.moveLeft = moveLeft
window.moveRight = moveRight