// Import libraries from node_modules instead of CDN
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// import Typed from 'typed.js'; // Uncomment if you use Typed.js
// import 'phosphor-icons'; // For React/JS usage, see docs. For CSS, use @import in CSS.

// Wait for everything to load
window.addEventListener('load', function() {
  // Matrix Background
  const matrixCanvas = document.getElementById('matrix-canvas');
  const matrixCtx = matrixCanvas.getContext('2d');
  
  function resizeMatrix() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = document.body.scrollHeight;
  }
  resizeMatrix();
  
  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
  const fontSize = 14;
  const columns = Math.floor(matrixCanvas.width / fontSize);
  const drops = Array(columns).fill(1);
  
  function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    matrixCtx.fillStyle = '#00bcd4';
    matrixCtx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      
      matrixCtx.fillText(char, x, y);
      
      if (y > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();
  
  // Three.js Mechanical System
  const threeCanvas = document.getElementById('three-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.position.z = 15;
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x00bcd4, 1);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0xe91e63, 0.8, 100);
  pointLight.position.set(-10, -10, 10);
  scene.add(pointLight);
  
  // Create Hologram Materials with Neon Edges
  const gearMaterial = new THREE.MeshStandardMaterial({
    color: 0x00bcd4,
    transparent: true,
    opacity: 0.15,
    emissive: 0x00bcd4,
    emissiveIntensity: 0.3,
    wireframe: false
  });
  
  const gearEdgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 1,
    wireframe: true
  });
  
  const cogMaterial = new THREE.MeshStandardMaterial({
    color: 0xe91e63,
    transparent: true,
    opacity: 0.15,
    emissive: 0xe91e63,
    emissiveIntensity: 0.3,
    wireframe: false
  });
  
  const cogEdgeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0080,
    transparent: true,
    opacity: 1,
    wireframe: true
  });
  
  // Main Central Gear with Hologram Effect
  const mainGearGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 16);
  const mainGear = new THREE.Mesh(mainGearGeometry, gearMaterial);
  const mainGearEdges = new THREE.Mesh(mainGearGeometry, gearEdgeMaterial);
  mainGear.position.set(0, 0, 0);
  mainGearEdges.position.set(0, 0, 0);
  scene.add(mainGear);
  scene.add(mainGearEdges);
  
  // Surrounding Gears with Hologram Effect
  const gears = [];
  const gearEdges = [];
  for (let i = 0; i < 6; i++) {
    const gearGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 12);
    const gear = new THREE.Mesh(gearGeometry, cogMaterial);
    const gearEdge = new THREE.Mesh(gearGeometry, cogEdgeMaterial);
    
    const angle = (i / 6) * Math.PI * 2;
    const posX = Math.cos(angle) * 6;
    const posY = Math.sin(angle) * 6;
    const posZ = Math.sin(i) * 2;
    
    gear.position.set(posX, posY, posZ);
    gearEdge.position.set(posX, posY, posZ);
    gear.rotation.x = Math.PI / 2;
    gearEdge.rotation.x = Math.PI / 2;
    
    gears.push(gear);
    gearEdges.push(gearEdge);
    scene.add(gear);
    scene.add(gearEdge);
  }
  
  // Floating Crystals with Hologram Effect
  const crystals = [];
  const crystalEdges = [];
  for (let i = 0; i < 12; i++) {
    const crystalGeometry = new THREE.OctahedronGeometry(0.5);
    const crystal = new THREE.Mesh(
      crystalGeometry,
      new THREE.MeshStandardMaterial({
        color: [0xff9800, 0x4caf50, 0x9c27b0][i % 3],
        transparent: true,
        opacity: 0.2,
        emissive: [0xff9800, 0x4caf50, 0x9c27b0][i % 3],
        emissiveIntensity: 0.4
      })
    );
    const crystalEdge = new THREE.Mesh(
      crystalGeometry,
      new THREE.MeshBasicMaterial({
        color: [0xffaa00, 0x66ff66, 0xdd44dd][i % 3],
        transparent: true,
        opacity: 1,
        wireframe: true
      })
    );
    
    const posX = (Math.random() - 0.5) * 20;
    const posY = (Math.random() - 0.5) * 20;
    const posZ = (Math.random() - 0.5) * 20;
    
    crystal.position.set(posX, posY, posZ);
    crystalEdge.position.set(posX, posY, posZ);
    
    crystals.push(crystal);
    crystalEdges.push(crystalEdge);
    scene.add(crystal);
    scene.add(crystalEdge);
  }
  
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate main gear and its edges
    mainGear.rotation.z += 0.01;
    mainGearEdges.rotation.z += 0.01;
    
    // Counter-rotate surrounding gears and their edges
    gears.forEach((gear, index) => {
      const gearEdge = gearEdges[index];
      
      gear.rotation.z -= 0.02;
      gear.rotation.y += 0.005;
      gearEdge.rotation.z -= 0.02;
      gearEdge.rotation.y += 0.005;
      
      // Floating motion
      const newZ = Math.sin(Date.now() * 0.001 + index) * 2;
      gear.position.z = newZ;
      gearEdge.position.z = newZ;
    });
    
    // Animate crystals and their edges
    crystals.forEach((crystal, index) => {
      const crystalEdge = crystalEdges[index];
      
      crystal.rotation.x += 0.01;
      crystal.rotation.y += 0.02;
      crystalEdge.rotation.x += 0.01;
      crystalEdge.rotation.y += 0.02;
      
      const newY = crystal.position.y + Math.sin(Date.now() * 0.002 + index) * 0.02;
      crystal.position.y = newY;
      crystalEdge.position.y = newY;
    });
    
    renderer.render(scene, camera);
  }
  animate();
  
  // Scroll-triggered Animations
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const progress = self.progress;
      
      // Rotate entire scene based on scroll
      scene.rotation.y = progress * Math.PI * 2;
      
      // Move camera
      camera.position.x = Math.sin(progress * Math.PI * 2) * 5;
      camera.position.y = Math.cos(progress * Math.PI * 2) * 5;
      camera.lookAt(0, 0, 0);
      
      // Update scroll progress bar
      document.getElementById('scroll-progress').style.transform = `scaleX(${progress})`;
    }
  });
  
  // Micro-interactions
  document.querySelectorAll('.hover-glow').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { scale: 1.05, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { scale: 1, duration: 0.3 });
    });
  });
  
  // Enter Portfolio Button
  document.getElementById('enter-btn').addEventListener('click', () => {
    gsap.to('body', {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Replace with your main portfolio page
        window.location.href = 'main.html';
      }
    });
  });
  
  // Auto-scroll to bottom detection
  let lastScrollY = window.scrollY;
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    
    // If at bottom, auto-redirect after 2 seconds
    if (scrolled >= maxScroll - 50) {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.getElementById('enter-btn').click();
      }, 2000);
    } else {
      if (scrollTimeout) clearTimeout(scrollTimeout);
    }
    
    lastScrollY = scrolled;
  });
  
  // Responsive handling
  window.addEventListener('resize', () => {
    resizeMatrix();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});