import * as THREE from "three";

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

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2);

light.position.set(5, 10, 5);

scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.8);

scene.add(ambient);

const floorGeometry = new THREE.PlaneGeometry(100, 100);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x228b22
});

const floor = new THREE.Mesh(
  floorGeometry,
  floorMaterial
);

floor.rotation.x = -Math.PI / 2;

scene.add(floor);

const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0x0066ff
  })
);

player.position.y = 0.5;

scene.add(player);

camera.position.set(0, 5, 8);

let score = 0;

const scoreEl = document.getElementById("score");

const coins = [];

function createCoin() {
  const coin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffd700
    })
  );

  coin.rotation.x = Math.PI / 2;

  coin.position.set(
    (Math.random() - 0.5) * 40,
    0.5,
    (Math.random() - 0.5) * 40
  );

  scene.add(coin);

  coins.push(coin);
}

for (let i = 0; i < 20; i++) {
  createCoin();
}

const keys = {};

window.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

function animate() {
  requestAnimationFrame(animate);

  const speed = 0.15;

  if (keys["w"]) player.position.z -= speed;
  if (keys["s"]) player.position.z += speed;
  if (keys["a"]) player.position.x -= speed;
  if (keys["d"]) player.position.x += speed;

  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 8;

  camera.lookAt(player.position);

  coins.forEach((coin, index) => {
    coin.rotation.z += 0.05;

    const dist = player.position.distanceTo(
      coin.position
    );

    if (dist < 1.2) {
      scene.remove(coin);
      coins.splice(index, 1);

      score++;

      scoreEl.textContent = score;

      createCoin();
    }
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});