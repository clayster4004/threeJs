// Code adapted from Chris Courses on youtube
// Video Tutorial reference -> https://www.youtube.com/watch?v=sPereCgQnWQ
// Source code github reference -> https://github.com/chriscourses/threejs-game

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function playGame() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Set an initial camera position
  camera.position.set(0, 12, 12);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Append renderer to a dedicated container instead of document.body
  const container = document.getElementById("game-container");
  if (container) {
    container.appendChild(renderer.domElement);
  }

  const controls = new OrbitControls(camera, renderer.domElement);

  // Define the Box class
  class Box extends THREE.Mesh {
    constructor({
      width,
      height,
      depth,
      color = '#00ff00',
      velocity = { x: 0, y: 0, z: 0 },
      position = { x: 0, y: 0, z: 0 },
      zAcceleration = false
    }) {
      super(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({ color })
      );
      this.height = height;
      this.width = width;
      this.depth = depth;
      this.color = color;

      this.position.set(position.x, position.y, position.z);

      this.right = this.position.x + this.width / 2;
      this.left = this.position.x - this.width / 2;

      this.bottom = this.position.y - this.height / 2;
      this.top = this.position.y + this.height / 2;

      this.front = this.position.z + this.depth / 2;
      this.back = this.position.z - this.depth / 2;

      this.velocity = velocity;
      this.gravity = -0.005;
      this.zAcceleration = zAcceleration;
    }

    updateSides() {
      this.right = this.position.x + this.width / 2;
      this.left = this.position.x - this.width / 2;
      this.bottom = this.position.y - this.height / 2;
      this.top = this.position.y + this.height / 2;
      this.front = this.position.z + this.depth / 2;
      this.back = this.position.z - this.depth / 2;
    }

    update(ground) {
      this.updateSides();

      if (this.zAcceleration) this.velocity.z += 0.0005;

      this.position.x += this.velocity.x;
      this.position.z += this.velocity.z;

      this.applyGravity(ground);
    }

    applyGravity(ground) {
      this.velocity.y += this.gravity;
      if (boxCollision({ box1: this, box2: ground })) {
        const friction = 0.5;
        this.velocity.y *= friction;
        this.velocity.y = -this.velocity.y;
      } else {
        this.position.y += this.velocity.y;
      }
    }
  }

  function boxCollision({ box1, box2 }) {
    const zCollision =
      box1.right >= box2.left && box1.left <= box2.right;
    const xCollision =
      box1.front >= box2.back && box1.back <= box2.front;
    const yCollision =
      box1.bottom + box1.velocity.y <= box2.top &&
      box1.top >= box2.bottom;

    return zCollision && xCollision && yCollision;
  }

  // Create the main cube controlled by the player
  const cube = new Box({
    width: 1,
    height: 1,
    depth: 1,
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    }
  });
  cube.castShadow = true;
  scene.add(cube);

  // Create the ground
  const ground = new Box({
    width: 15,
    height: 0.5,
    depth: 50,
    color: '#0369a1',
    position: { x: 0, y: -2, z: 0 }
  });
  ground.receiveShadow = true;
  scene.add(ground);

  // Lighting setup
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.y = 3;
  light.position.z = 1;
  light.castShadow = true;
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Adjust camera position for rendering
  camera.position.z = 5;

  // Handle keyboard input
  const keys = {
    a: { pressed: false },
    d: { pressed: false },
    s: { pressed: false },
    w: { pressed: false }
  };

  window.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyA':
        keys.a.pressed = true;
        break;
      case 'KeyD':
        keys.d.pressed = true;
        break;
      case 'KeyS':
        keys.s.pressed = true;
        break;
      case 'KeyW':
        keys.w.pressed = true;
        break;
      case 'Space':
        cube.velocity.y = 0.1;
        break;
    }
  });

  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyA':
        keys.a.pressed = false;
        break;
      case 'KeyD':
        keys.d.pressed = false;
        break;
      case 'KeyS':
        keys.s.pressed = false;
        break;
      case 'KeyW':
        keys.w.pressed = false;
        break;
    }
  });

  // Array to hold enemy boxes
  const enemies = [];
  let frames = 0;
  let spawnRate = 210;

  function animate() {
    const animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // Update player cube movement based on keys
    cube.velocity.x = 0;
    cube.velocity.z = 0;
    if (keys.a.pressed) cube.velocity.x = -0.05;
    else if (keys.d.pressed) cube.velocity.x = 0.05;
    if (keys.s.pressed) cube.velocity.z = 0.05;
    else if (keys.w.pressed) cube.velocity.z = -0.05;
    cube.update(ground);

    // Update enemy movement and handle collision with player cube
    enemies.forEach((enemy) => {
      enemy.update(ground);
      if (boxCollision({ box1: cube, box2: enemy })) {
        cancelAnimationFrame(animationId);
      }
    });

    // Spawn new enemies over time
    if (frames % spawnRate === 0) {
      if (spawnRate > 30) spawnRate -= 10;
      const enemy = new Box({
        width: 1,
        height: 1,
        depth: 1,
        position: {
          x: (Math.random() - 0.5) * 15,
          y: 0,
          z: -20
        },
        velocity: {
          x: 0,
          y: 0,
          z: 0.005
        },
        color: 'red',
        zAcceleration: true
      });
      enemy.castShadow = true;
      scene.add(enemy);
      enemies.push(enemy);
    }
    frames++;
  }
  animate();
}
