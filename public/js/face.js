'use strict';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

exports.generate = function () {
  let scene = new THREE.Scene();
  let controls;

  let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  let renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  document.body.appendChild(renderer.domElement);

  let geometry = new THREE.SphereGeometry(75, 75, 75);

  let material = new THREE.MeshPhongMaterial({
    color: '#111',
    opacity: 0.8,
    shininess: 15,
    reflectivity: 20,
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
    opacity: 0.3
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = 0;
  sphere.position.y = 0;
  sphere.position.z = 0;
  scene.add(sphere);

  geometry = new THREE.SphereGeometry(7, 7, 7);

  material = new THREE.MeshPhongMaterial({
    color: '#7ae5bb',
    opacity: 0.8,
    shininess: 10,
    reflectivity: 5
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = -130;
  sphere.position.y = 10;
  scene.add(sphere);

  geometry = new THREE.SphereGeometry(10, 10, 10);

  material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: '#111',
    opacity: 0.2
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = -130;
  sphere.position.y = 10;
  scene.add(sphere);

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

  let directionalLight = new THREE.DirectionalLight('#0078e5', 0.9);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  directionalLight = new THREE.DirectionalLight('#3fa7a3', 0.9);
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
