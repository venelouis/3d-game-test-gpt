import * as THREE from "three";

/*
==================================
CENA
==================================
*/

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

/*
==================================
LUZES
==================================
*/

const ambient = new THREE.AmbientLight(
  0xffffff,
  1
);

scene.add(ambient);

const sun = new THREE.DirectionalLight(
  0xffffff,
  2
);

sun.position.set(10, 20, 10);

sun.castShadow = true;

scene.add(sun);

/*
==================================
CHÃO
==================================
*/

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    color: 0x3fa34d
  })
);

floor.rotation.x = -Math.PI / 2;

floor.receiveShadow = true;

scene.add(floor);

/*
==================================
PERSONAGEM
==================================
*/

const player = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(
    0.4,
    1.2,
    8,
    16
  ),
  new THREE.MeshStandardMaterial({
    color: 0x2979ff
  })
);

body.castShadow = true;

player.add(body);

player.position.set(0, 1, 0);

scene.add(player);

/*
==================================
CÂMERA
==================================
*/

camera.position.set(0, 6, 8);

const cameraOffset =
  new THREE.Vector3(0, 6, 8);

/*
==================================
MOVIMENTO
==================================
*/

const keys = {};

window.addEventListener(
  "keydown",
  (e) => {
    keys[e.key.toLowerCase()] = true;
  }
);

window.addEventListener(
  "keyup",
  (e) => {
    keys[e.key.toLowerCase()] = false;
  }
);

const velocity =
  new THREE.Vector3();

const direction =
  new THREE.Vector3();

const maxSpeed = 0.15;

const acceleration = 0.015;

const damping = 0.90;

/*
==================================
MOEDAS
==================================
*/

const coins = [];

const scoreElement =
  document.getElementById("score");

let score = 0;

function createCoin() {
  const coin = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.4,
      0.4,
      0.15,
      32
    ),
    new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2
    })
  );

  coin.rotation.x = Math.PI / 2;

  coin.position.set(
    (Math.random() - 0.5) * 40,
    0.5,
    (Math.random() - 0.5) * 40
  );

  coin.castShadow = true;

  scene.add(coin);

  coins.push(coin);
}

for (let i = 0; i < 20; i++) {
  createCoin();
}

/*
==================================
ANIMAÇÃO
==================================
*/

function animate() {
  requestAnimationFrame(animate);

  direction.set(0, 0, 0);

  /*
  WASD
  */

  if (keys["w"])
    direction.z -= 1;

  if (keys["s"])
    direction.z += 1;

  if (keys["a"])
    direction.x -= 1;

  if (keys["d"])
    direction.x += 1;

  /*
  SETAS
  */

  if (keys["arrowup"])
    direction.z -= 1;

  if (keys["arrowdown"])
    direction.z += 1;

  if (keys["arrowleft"])
    direction.x -= 1;

  if (keys["arrowright"])
    direction.x += 1;

  /*
  MOVIMENTO
  */

  if (direction.length() > 0) {

    direction.normalize();

    velocity.x +=
      direction.x * acceleration;

    velocity.z +=
      direction.z * acceleration;

    const angle = Math.atan2(
      direction.x,
      direction.z
    );

    player.rotation.y = angle;
  }

  velocity.multiplyScalar(damping);

  velocity.clampLength(
    0,
    maxSpeed
  );

  player.position.add(velocity);

  /*
  CÂMERA SUAVE
  */

  const desiredCameraPos =
    player.position
      .clone()
      .add(cameraOffset);

  camera.position.lerp(
    desiredCameraPos,
    0.08
  );

  camera.lookAt(player.position);

  /*
  ANIMAÇÃO DAS MOEDAS
  */

  coins.forEach((coin, index) => {

    coin.rotation.z += 0.05;

    const distance =
      player.position.distanceTo(
        coin.position
      );

    if (distance < 1) {

      scene.remove(coin);

      coins.splice(index, 1);

      score++;

      scoreElement.textContent =
        score;

      createCoin();
    }
  });

  renderer.render(
    scene,
    camera
  );
}

animate();

/*
==================================
RESIZE
==================================
*/

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);