// Import libraries from node_modules instead of CDN
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// import 'phosphor-icons'; // For web font, use @import in CSS

// 3D Scene Setup
let scene, camera, renderer, heroShape;
let floatingObjects = [];
let mouseX = 0, mouseY = 0;
let scrollY = 0;

function init3D() {
    // Main 3D Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('main-3d'), 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create main hero shape - Torus Knot
    const geometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00bcd4,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    heroShape = new THREE.Mesh(geometry, material);
    heroShape.position.set(0, 0, -10);
    scene.add(heroShape);

    // Add gradient effect to hero shape
    const gradientGeometry = new THREE.TorusKnotGeometry(3.1, 1.1, 100, 16);
    const gradientMaterial = new THREE.MeshBasicMaterial({
        color: 0xe91e63,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const gradientShape = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientShape.position.set(0, 0, -10);
    scene.add(gradientShape);

    camera.position.z = 5;

    // Floating 3D Scene
    const floatingScene = new THREE.Scene();
    const floatingCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const floatingRenderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('floating-3d'), 
        antialias: true, 
        alpha: true 
    });
    floatingRenderer.setSize(window.innerWidth, window.innerHeight);
    floatingRenderer.setClearColor(0x000000, 0);

    // Create floating objects
    const shapes = [
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.SphereGeometry(0.3, 8, 6),
        new THREE.ConeGeometry(0.3, 0.6, 6),
        new THREE.OctahedronGeometry(0.4),
    ];

    const colors = [0x00bcd4, 0xe91e63, 0xff9800, 0x4caf50, 0x9c27b0, 0xf44336];

    for (let i = 0; i < 15; i++) {
        const geometry = shapes[Math.floor(Math.random() * shapes.length)];
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            wireframe: Math.random() > 0.5,
            transparent: true,
            opacity: 0.4
        });
        
        const object = new THREE.Mesh(geometry, material);
        object.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        object.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        floatingObjects.push({
            mesh: object,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.01 + 0.005
        });
        
        floatingScene.add(object);
    }

    floatingCamera.position.z = 20;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Animate hero shape based on scroll
        if (heroShape) {
            const scrollProgress = Math.min(window.scrollY / (window.innerHeight * 2), 1);
            heroShape.rotation.x = scrollProgress * Math.PI * 2;
            heroShape.rotation.y = scrollProgress * Math.PI * 1.5;
            
            // Move shape as user scrolls
            heroShape.position.x = scrollProgress * 8;
            heroShape.position.y = -scrollProgress * 4;
            heroShape.position.z = -10 + scrollProgress * 5;
            
            // Scale down as we scroll
            const scale = 1 - scrollProgress * 0.3;
            heroShape.scale.set(scale, scale, scale);
        }

        // Animate floating objects
        floatingObjects.forEach(obj => {
            obj.mesh.rotation.x += obj.rotationSpeed.x;
            obj.mesh.rotation.y += obj.rotationSpeed.y;
            obj.mesh.rotation.z += obj.rotationSpeed.z;
            
            obj.mesh.position.y += Math.sin(Date.now() * obj.floatSpeed) * 0.01;
            
            // Mouse interaction
            const mouseInfluence = 0.0001;
            obj.mesh.rotation.x += mouseY * mouseInfluence;
            obj.mesh.rotation.y += mouseX * mouseInfluence;
        });

        renderer.render(scene, camera);
        floatingRenderer.render(floatingScene, floatingCamera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        floatingCamera.aspect = window.innerWidth / window.innerHeight;
        floatingCamera.updateProjectionMatrix();
        floatingRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Mouse movement tracking
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Scroll tracking
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    
    // Smooth scrolling for navigation
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = dot.getAttribute('data-target');
            const section = document.getElementById(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active nav dot on scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navDots.forEach(dot => dot.classList.remove('active'));
                const activeDot = document.querySelector(`[data-target="${entry.target.id}"]`);
                if (activeDot) {
                    activeDot.classList.add('active');
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // GSAP ScrollTrigger animations
    gsap.registerPlugin(ScrollTrigger);

    // Animate team cards
    gsap.from('.glass-effect', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
        }
    });

    // Animate project cards
    gsap.from('.project-card', {
        duration: 1,
        scale: 0.8,
        opacity: 0,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%',
        }
    });

    // Animate contact form
    gsap.from('#contact form', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
        }
    });
});

// Form submission handling
document.querySelector('form').addEventListener('submit', function(e) {
    const button = this.querySelector('button[type="submit"]');
    button.innerHTML = '<i class="ph ph-spinner mr-2 animate-spin"></i>Sending...';
    button.disabled = true;
}); 
