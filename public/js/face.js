'use strict';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

exports.generate = function () {
  let scene = new THREE.Scene();
  let controls;
  const ringTilt = Math.PI / 2;

  let ring;

  let camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 1, 1000);
  let renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  document.body.appendChild(renderer.domElement);

  let geometry = new THREE.SphereGeometry(75, 75, 75);

  let material = new THREE.MeshPhongMaterial({
    color: '#333',
    opacity: 1,
    shininess: 12,
    reflectivity: 10,
    specular: '#2bd8a3'
  });

  let sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = 0;
  sphere.position.y = 0;
  sphere.position.z = 0;
  scene.add(sphere);

  geometry = new THREE.SphereGeometry(79, 79, 79);

  material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: '#111',
    transparent: true,
    opacity: 0.1
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = 0;
  sphere.position.y = 0;
  sphere.position.z = 0;
  scene.add(sphere);

  geometry = new THREE.SphereGeometry(10, 10, 10);

  material = new THREE.MeshLambertMaterial({
    color: '#888'
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = -130;
  sphere.position.y = 10;
  scene.add(sphere);

  geometry = new THREE.RingGeometry(13, 15, 35);

  material = new THREE.MeshPhongMaterial({
    color: '#eee',
    opacity: 0.3,
    shininess: 6,
    reflectivity: 6
  });

  ring = new THREE.Mesh(geometry, material);
  ring.position.x = -130;
  ring.position.y = 10;
  ring.rotation.x = -ringTilt;
  scene.add(ring);

  geometry = new THREE.SphereGeometry(16, 16, 16);

  material = new THREE.MeshPhongMaterial({
    color: '#111',
    opacity: 0.8,
    shininess: 10,
    reflectivity: 5
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = 140;
  sphere.position.y = -25;
  sphere.position.z = 10;
  scene.add(sphere);

  geometry = new THREE.SphereGeometry(18, 18, 18);

  material = new THREE.MeshPhongMaterial({
    color: '#cc352a',
    opacity: 0.7,
    shininess: 5,
    reflectivity: 1
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = 230;
  sphere.position.y = 5;
  sphere.position.z = -60;
  scene.add(sphere);

  function generateRings(start, end) {
    geometry = new THREE.RingGeometry(start, end, 45);

    material = new THREE.MeshPhongMaterial({
      color: '#111',
      opacity: 0.5,
      shininess: 3,
      reflectivity: 6
    });

    ring = new THREE.Mesh(geometry, material);
    ring.position.x = 230;
    ring.position.y = 5;
    ring.position.z = -60;
    ring.rotation.x = -ringTilt;
    scene.add(ring);
  }

  generateRings(19, 21);
  generateRings(22, 24);
  generateRings(25, 32);
  generateRings(34, 50);

  let light = new THREE.HemisphereLight('#222', '#ff1e55', 0.3);
  scene.add(light);

  let directionalLight = new THREE.DirectionalLight('#0078e5', 0.9);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  directionalLight = new THREE.DirectionalLight('#3fa7a3', 0.6);
  directionalLight.position.set(1, 0, 1);
  scene.add(directionalLight);

  directionalLight = new THREE.DirectionalLight('#f051bb', 0.7);
  directionalLight.position.set(0, 1, -1);
  scene.add(directionalLight);

  directionalLight = new THREE.DirectionalLight('#3fa7a3', 0.7);
  directionalLight.position.set(-1, 1, 1);
  scene.add(directionalLight);

  camera.position.z = 245;
  camera.position.x = 60;
  camera.position.y = 20;

  controls = new OrbitControls(camera);
  controls.autoRotate = true;
  controls.enableZoom = false;
  controls.enableKeys = false;

  let render = function () {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);
  };

  camera.lookAt(scene.position);
  render();
  renderer.setSize(window.innerWidth, window.innerHeight);

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
};
