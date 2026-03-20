// App.js - Digital Gesture Planet

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera position
camera.position.z = 20;

// Particle system variables - PREMIUM COSMIC VERSION!
let backgroundStars, coreNebula, innerNebula, outerNebula, ringParticles1, ringParticles2;
const coreRadius = 2;
const innerNebulaRadius = 5;
const outerNebulaRadius = 9;
const ringRadius1 = 12;
const ringRadius2 = 17;
const backgroundStarCount = 30000;
const coreNebulaCount = 25000;
const innerNebulaCount = 20000;
const outerNebulaCount = 15000;
const ringParticleCount1 = 12000;
const ringParticleCount2 = 10000;

// Hand tracking variables
let hands;

// Initialize hands object
function initHands() {
    try {
        console.log('Initializing MediaPipe Hands');
        console.log('Hands class available:', typeof Hands !== 'undefined');
        
        if (typeof Hands === 'undefined') {
            console.error('Hands class not available - MediaPipe script not loaded');
            showError('Error: MediaPipe Hands script not loaded properly');
            return;
        }
        
        hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        console.log('MediaPipe Hands initialized successfully:', hands);
    } catch (error) {
        console.error('Error initializing MediaPipe Hands:', error);
        showError('Error initializing MediaPipe Hands: ' + error.message);
    }
}

let cameraUtils;
let videoElement;
let previousHandPosition = null;
let previousHandVelocity = { x: 0, y: 0 };
let cameraDistance = 20;
const minCameraDistance = 10;
const maxCameraDistance = 50;
let currentGesture = 'none';
let gestureTimer = 0;
let particlePulseEffect = 0;
let planetScale = 1.0;
let ring1Scale = 1.0;
let ring2Scale = 1.0;

// Initialize the application
function init() {
    console.log('Initializing application');
    createParticles();
    initHands();
    setupEventListeners();
    animate();
    console.log('Application initialized');
}

// Create particle systems - PREMIUM COSMIC NEBULA VERSION!
function createParticles() {
    // 1. Background Stars - deep space
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(backgroundStarCount * 3);
    const bgColors = new Float32Array(backgroundStarCount * 3);
    
    for (let i = 0; i < backgroundStarCount; i++) {
        const radius = 50 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        bgPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        bgPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        bgPositions[i * 3 + 2] = radius * Math.cos(phi);
        
        const brightness = 0.3 + Math.random() * 0.7;
        bgColors[i * 3] = brightness;
        bgColors[i * 3 + 1] = brightness;
        bgColors[i * 3 + 2] = brightness;
    }
    
    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));
    
    const bgMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    backgroundStars = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(backgroundStars);
    
    // 2. Core Nebula - bright white/blue core
    const coreGeometry = new THREE.BufferGeometry();
    const corePositions = new Float32Array(coreNebulaCount * 3);
    const coreColors = new Float32Array(coreNebulaCount * 3);
    
    for (let i = 0; i < coreNebulaCount; i++) {
        const radius = coreRadius * Math.pow(Math.random(), 0.5);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        corePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        corePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        corePositions[i * 3 + 2] = radius * Math.cos(phi);
        
        const colorType = Math.random();
        if (colorType < 0.6) {
            coreColors[i * 3] = 0.9 + Math.random() * 0.1;
            coreColors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
            coreColors[i * 3 + 2] = 1.0;
        } else {
            coreColors[i * 3] = 0.7 + Math.random() * 0.3;
            coreColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            coreColors[i * 3 + 2] = 1.0;
        }
    }
    
    coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));
    
    const coreMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1.0,
        sizeAttenuation: true
    });
    
    coreNebula = new THREE.Points(coreGeometry, coreMaterial);
    scene.add(coreNebula);
    
    // 3. Inner Nebula - cyan/blue
    const innerGeometry = new THREE.BufferGeometry();
    const innerPositions = new Float32Array(innerNebulaCount * 3);
    const innerColors = new Float32Array(innerNebulaCount * 3);
    
    for (let i = 0; i < innerNebulaCount; i++) {
        const radius = coreRadius + (innerNebulaRadius - coreRadius) * Math.pow(Math.random(), 0.7);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        innerPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        innerPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        innerPositions[i * 3 + 2] = radius * Math.cos(phi);
        
        const colorType = Math.random();
        if (colorType < 0.5) {
            innerColors[i * 3] = 0.0 + Math.random() * 0.2;
            innerColors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
            innerColors[i * 3 + 2] = 1.0;
        } else {
            innerColors[i * 3] = 0.2 + Math.random() * 0.3;
            innerColors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
            innerColors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
        }
    }
    
    innerGeometry.setAttribute('position', new THREE.BufferAttribute(innerPositions, 3));
    innerGeometry.setAttribute('color', new THREE.BufferAttribute(innerColors, 3));
    
    const innerMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true
    });
    
    innerNebula = new THREE.Points(innerGeometry, innerMaterial);
    scene.add(innerNebula);
    
    // 4. Outer Nebula - light blue/gold
    const outerGeometry = new THREE.BufferGeometry();
    const outerPositions = new Float32Array(outerNebulaCount * 3);
    const outerColors = new Float32Array(outerNebulaCount * 3);
    
    for (let i = 0; i < outerNebulaCount; i++) {
        const radius = innerNebulaRadius + (outerNebulaRadius - innerNebulaRadius) * Math.pow(Math.random(), 0.6);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        outerPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        outerPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        outerPositions[i * 3 + 2] = radius * Math.cos(phi);
        
        const colorType = Math.random();
        if (colorType < 0.4) {
            outerColors[i * 3] = 0.4 + Math.random() * 0.3;
            outerColors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
            outerColors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        } else if (colorType < 0.7) {
            outerColors[i * 3] = 1.0;
            outerColors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
            outerColors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
        } else {
            outerColors[i * 3] = 0.7 + Math.random() * 0.3;
            outerColors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
            outerColors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
        }
    }
    
    outerGeometry.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
    outerGeometry.setAttribute('color', new THREE.BufferAttribute(outerColors, 3));
    
    const outerMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });
    
    outerNebula = new THREE.Points(outerGeometry, outerMaterial);
    scene.add(outerNebula);
    
    // 5. First Ring - icy white/cyan
    const ringGeometry1 = new THREE.BufferGeometry();
    const ringPositions1 = new Float32Array(ringParticleCount1 * 3);
    const ringColors1 = new Float32Array(ringParticleCount1 * 3);
    
    for (let i = 0; i < ringParticleCount1; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = ringRadius1 + (Math.random() - 0.5) * 4;
        
        ringPositions1[i * 3] = radius * Math.cos(angle);
        ringPositions1[i * 3 + 1] = (Math.random() - 0.5) * 2;
        ringPositions1[i * 3 + 2] = radius * Math.sin(angle);
        
        const colorType = Math.random();
        if (colorType < 0.5) {
            ringColors1[i * 3] = 0.8 + Math.random() * 0.2;
            ringColors1[i * 3 + 1] = 0.9 + Math.random() * 0.1;
            ringColors1[i * 3 + 2] = 1.0;
        } else {
            ringColors1[i * 3] = 0.0 + Math.random() * 0.2;
            ringColors1[i * 3 + 1] = 0.7 + Math.random() * 0.3;
            ringColors1[i * 3 + 2] = 1.0;
        }
    }
    
    ringGeometry1.setAttribute('position', new THREE.BufferAttribute(ringPositions1, 3));
    ringGeometry1.setAttribute('color', new THREE.BufferAttribute(ringColors1, 3));
    
    const ringMaterial1 = new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });
    
    ringParticles1 = new THREE.Points(ringGeometry1, ringMaterial1);
    scene.add(ringParticles1);
    
    // 6. Second Ring - golden/white
    const ringGeometry2 = new THREE.BufferGeometry();
    const ringPositions2 = new Float32Array(ringParticleCount2 * 3);
    const ringColors2 = new Float32Array(ringParticleCount2 * 3);
    
    for (let i = 0; i < ringParticleCount2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = ringRadius2 + (Math.random() - 0.5) * 4;
        
        ringPositions2[i * 3] = radius * Math.cos(angle);
        ringPositions2[i * 3 + 1] = (Math.random() - 0.5) * 2;
        ringPositions2[i * 3 + 2] = radius * Math.sin(angle);
        
        const colorType = Math.random();
        if (colorType < 0.5) {
            ringColors2[i * 3] = 1.0;
            ringColors2[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            ringColors2[i * 3 + 2] = 0.3 + Math.random() * 0.3;
        } else {
            ringColors2[i * 3] = 0.85 + Math.random() * 0.15;
            ringColors2[i * 3 + 1] = 0.85 + Math.random() * 0.15;
            ringColors2[i * 3 + 2] = 0.85 + Math.random() * 0.15;
        }
    }
    
    ringGeometry2.setAttribute('position', new THREE.BufferAttribute(ringPositions2, 3));
    ringGeometry2.setAttribute('color', new THREE.BufferAttribute(ringColors2, 3));
    
    const ringMaterial2 = new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });
    
    ringParticles2 = new THREE.Points(ringGeometry2, ringMaterial2);
    scene.add(ringParticles2);
}

// Setup event listeners
function setupEventListeners() {
    const startButton = document.getElementById('start-button');
    console.log('Start button element:', startButton);
    if (startButton) {
        startButton.addEventListener('click', startCamera);
        console.log('Start button click event added');
    } else {
        console.error('Start button not found');
        showError('Start button not found');
    }
}

// Start camera with user interaction
function startCamera() {
    console.log('Start camera button clicked');
    try {
        document.getElementById('start-button-container').style.display = 'none';
        console.log('Navigator object:', navigator);
        console.log('MediaDevices available:', navigator.mediaDevices);
        
        // Test if getUserMedia is available
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia available, requesting camera access...');
            
            // Request camera access directly
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
                .then(stream => {
                    console.log('Camera access granted, stream:', stream);
                    
                    // Initialize hands object before setting up tracking
                    initHands();
                    
                    // Wait a moment for hands to initialize
                    setTimeout(() => {
                        setupVideoAndTracking(stream);
                    }, 100);
                })
                .catch(error => {
                    console.error('Camera access error:', error);
                    showError('Error accessing camera: ' + error.message + ' (Error code: ' + error.name + ')');
                });
        } else {
            console.error('getUserMedia not available');
            showError('getUserMedia is not available in your browser');
        }
    } catch (error) {
        console.error('Error in startCamera:', error);
        showError('Error starting camera: ' + error.message);
    }
}

// Setup video and hand tracking
function setupVideoAndTracking(stream) {
    console.log('Setting up video and tracking');
    
    // Create video element
    videoElement = document.createElement('video');
    videoElement.style.position = 'absolute';
    videoElement.style.width = '0';
    videoElement.style.height = '0';
    videoElement.style.opacity = '0';
    document.body.appendChild(videoElement);
    
    // Set video source
    videoElement.srcObject = stream;
    videoElement.play();
    
    // Check if hands object is initialized
    if (!hands) {
        console.error('Hands object not initialized');
        showError('Error: Hands object not initialized');
        return;
    }
    
    // Setup MediaPipe Hands - optimized for office distance
    try {
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 0,
            minDetectionConfidence: 0.3,
            minTrackingConfidence: 0.3
        });
        console.log('Hands options set successfully');
        
        hands.onResults(onResults);
        console.log('Hands onResults callback set');
        
        // Setup camera utilities after video is playing
        videoElement.onloadedmetadata = () => {
            console.log('Video metadata loaded, setting up camera utilities');
            setupCameraUtils();
        };
    } catch (error) {
        console.error('Error setting up hands:', error);
        showError('Error setting up hand tracking: ' + error.message);
    }
}

// Setup camera utilities
function setupCameraUtils() {
    try {
        console.log('Setting up camera utilities');
        console.log('Camera class available:', typeof Camera !== 'undefined');
        
        if (typeof Camera === 'undefined') {
            console.error('Camera class not available - camera_utils script not loaded');
            showError('Error: Camera utilities script not loaded properly');
            return;
        }
        
        // Setup camera
        cameraUtils = new Camera(videoElement, {
            onFrame: async () => {
                console.log('Frame captured, sending to MediaPipe...');
                try {
                    await hands.send({ image: videoElement });
                    console.log('Frame sent to MediaPipe successfully');
                } catch (error) {
                    console.error('Error processing frame:', error);
                    showError('Error processing frame: ' + error.message);
                }
            },
            width: 640,
            height: 480
        });
        
        console.log('Camera utilities created:', cameraUtils);
        
        // Start camera with error handling
        cameraUtils.start().then(() => {
            console.log('Camera utilities started successfully');
        }).catch(error => {
            console.error('Error starting camera utilities:', error);
            showError('Error starting camera utilities: ' + error.message);
        });
    } catch (error) {
        console.error('Error setting up camera utilities:', error);
        showError('Error setting up camera utilities: ' + error.message);
    }
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    console.error(message);
}

// Count extended fingers
function countExtendedFingers(hand) {
    const fingerTips = [8, 12, 16, 20];
    const fingerBases = [5, 9, 13, 17];
    let extendedFingers = 0;
    
    for (let i = 0; i < fingerTips.length; i++) {
        const tip = hand[fingerTips[i]];
        const base = hand[fingerBases[i]];
        const distance = Math.sqrt(
            Math.pow(tip.x - base.x, 2) +
            Math.pow(tip.y - base.y, 2) +
            Math.pow(tip.z - base.z, 2)
        );
        if (distance > 0.08) extendedFingers++;
    }
    
    return extendedFingers;
}

// Update gesture display
function updateGestureDisplay() {
    const gestureElement = document.getElementById('current-gesture');
    if (!gestureElement) return;
    
    const gestureNames = {
        '1finger': '👉 1根手指',
        '2fingers': '✌️ 2根手指',
        '3fingers': '🤟 3根手指',
        '4fingers': '🖖 4根手指',
        'open': '🖐️ 5指张开',
        'fist': '✊ 握拳',
        'none': '等待手势...'
    };
    
    gestureElement.textContent = gestureNames[currentGesture] || '等待手势...';
    
    const gestureColors = {
        '1finger': '#ff6b6b',
        '2fingers': '#ffd93d',
        '3fingers': '#6bcb77',
        '4fingers': '#4d96ff',
        'open': '#ff8800',
        'fist': '#ff4444',
        'none': '#888888'
    };
    
    gestureElement.style.color = gestureColors[currentGesture] || '#888888';
}

// Handle hand tracking results - SUPER GESTURE VERSION!
function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const hand = results.multiHandLandmarks[0];
        const palmCenter = hand[0];
        
        const handX = (palmCenter.x - 0.5) * 2;
        const handY = -(palmCenter.y - 0.5) * 2;
        const handZ = (0.5 - palmCenter.z) * 2;
        
        const isFist = isHandFist(hand);
        const isOpenHand = isHandOpen(hand);
        const extendedFingers = countExtendedFingers(hand);
        
        if (previousHandPosition) {
            const deltaX = handX - previousHandPosition.x;
            const deltaY = handY - previousHandPosition.y;
            const velocityX = deltaX * 30;
            const velocityY = deltaY * 30;
            
            previousHandVelocity = { x: velocityX, y: velocityY };
            
            // Basic rotation
            coreNebula.rotation.y += deltaX * 12.0;
            coreNebula.rotation.x += deltaY * 8.0;
            innerNebula.rotation.y += deltaX * 10.0;
            innerNebula.rotation.x += deltaY * 7.0;
            outerNebula.rotation.y += deltaX * 8.0;
            outerNebula.rotation.x += deltaY * 6.0;
            ringParticles1.rotation.y += deltaX * 9.0;
            ringParticles1.rotation.x += deltaY * 6.0;
            ringParticles2.rotation.y += deltaX * 7.0;
            ringParticles2.rotation.x += deltaY * 5.0;
            
            // 1 finger gesture - SWIPE LEFT/RIGHT
            if (extendedFingers === 1) {
                currentGesture = '1finger';
                particlePulseEffect = Math.min(1.0, particlePulseEffect + 0.1);
                planetScale = 1.0 + Math.abs(velocityX) * 0.05;
                
                if (velocityX > 0.5) {
                    ring1Scale = 1.0 + Math.abs(velocityX) * 0.1;
                } else if (velocityX < -0.5) {
                    ring2Scale = 1.0 + Math.abs(velocityX) * 0.1;
                }
            }
            // 2 fingers gesture - SWIPE UP/DOWN
            else if (extendedFingers === 2) {
                currentGesture = '2fingers';
                particlePulseEffect = Math.min(1.0, particlePulseEffect + 0.15);
                
                if (velocityY > 0.5) {
                    planetScale = 1.0 + Math.abs(velocityY) * 0.08;
                    ring1Scale = 1.0 + Math.abs(velocityY) * 0.05;
                    ring2Scale = 1.0 + Math.abs(velocityY) * 0.03;
                } else if (velocityY < -0.5) {
                    planetScale = 1.0 - Math.abs(velocityY) * 0.04;
                    ring1Scale = 1.0 - Math.abs(velocityY) * 0.03;
                    ring2Scale = 1.0 - Math.abs(velocityY) * 0.02;
                }
            }
            // 3 fingers gesture - SHAKE!
            else if (extendedFingers === 3) {
                currentGesture = '3fingers';
                particlePulseEffect = Math.min(1.0, particlePulseEffect + 0.2);
                coreNebula.rotation.z += Math.sin(Date.now() * 0.01) * 0.1;
                innerNebula.rotation.z += Math.sin(Date.now() * 0.012) * 0.08;
                outerNebula.rotation.z += Math.sin(Date.now() * 0.014) * 0.06;
            }
            // 4 fingers gesture - WAVE!
            else if (extendedFingers === 4) {
                currentGesture = '4fingers';
                particlePulseEffect = Math.min(1.0, particlePulseEffect + 0.25);
                ringParticles1.rotation.z += Math.sin(Date.now() * 0.015) * 0.08;
                ringParticles2.rotation.z -= Math.sin(Date.now() * 0.012) * 0.06;
            }
            // Open hand (5 fingers) - ZOOM IN
            else if (isOpenHand) {
                currentGesture = 'open';
                if (handZ > previousHandPosition.z) {
                    const speed = Math.abs(handZ - previousHandPosition.z) * 80;
                    cameraDistance = Math.max(minCameraDistance, cameraDistance - speed);
                }
            }
            // Fist - ZOOM OUT
            else if (isFist) {
                currentGesture = 'fist';
                if (handZ < previousHandPosition.z) {
                    const speed = Math.abs(handZ - previousHandPosition.z) * 80;
                    cameraDistance = Math.min(maxCameraDistance, cameraDistance + speed);
                }
            }
            else {
                currentGesture = 'none';
            }
        }
        
        updateGestureDisplay();
        previousHandPosition = { x: handX, y: handY, z: handZ };
    } else {
        currentGesture = 'none';
        updateGestureDisplay();
    }
}

// Check if hand is a fist - optimized for office distance
function isHandFist(hand) {
    const fingers = [
        [8, 5], // Index finger tip to base
        [12, 9], // Middle finger tip to base
        [16, 13], // Ring finger tip to base
        [20, 17] // Pinky tip to base
    ];
    
    let closedFingers = 0;
    for (const [tip, base] of fingers) {
        const tipPos = hand[tip];
        const basePos = hand[base];
        const distance = Math.sqrt(
            Math.pow(tipPos.x - basePos.x, 2) +
            Math.pow(tipPos.y - basePos.y, 2) +
            Math.pow(tipPos.z - basePos.z, 2)
        );
        if (distance < 0.18) closedFingers++;
    }
    
    return closedFingers >= 2;
}

// Check if hand is open - optimized for office distance
function isHandOpen(hand) {
    const fingers = [
        [8, 5], // Index finger tip to base
        [12, 9], // Middle finger tip to base
        [16, 13], // Ring finger tip to base
        [20, 17] // Pinky tip to base
    ];
    
    let openFingers = 0;
    for (const [tip, base] of fingers) {
        const tipPos = hand[tip];
        const basePos = hand[base];
        const distance = Math.sqrt(
            Math.pow(tipPos.x - basePos.x, 2) +
            Math.pow(tipPos.y - basePos.y, 2) +
            Math.pow(tipPos.z - basePos.z, 2)
        );
        if (distance > 0.05) openFingers++;
    }
    
    return openFingers >= 2;
}

// Animation loop - PREMIUM COSMIC VERSION!
function animate() {
    requestAnimationFrame(animate);
    
    // Update camera position
    camera.position.z = cameraDistance;
    camera.lookAt(0, 0, 0);
    
    // Decay effects when no gesture
    particlePulseEffect = Math.max(0, particlePulseEffect - 0.02);
    planetScale = planetScale + (1.0 - planetScale) * 0.1;
    ring1Scale = ring1Scale + (1.0 - ring1Scale) * 0.1;
    ring2Scale = ring2Scale + (1.0 - ring2Scale) * 0.1;
    
    // Apply scale effects to all nebula layers
    coreNebula.scale.set(planetScale, planetScale, planetScale);
    innerNebula.scale.set(planetScale, planetScale, planetScale);
    outerNebula.scale.set(planetScale, planetScale, planetScale);
    ringParticles1.scale.set(ring1Scale, ring1Scale, ring1Scale);
    ringParticles2.scale.set(ring2Scale, ring2Scale, ring2Scale);
    
    // Apply particle pulse effect
    if (particlePulseEffect > 0) {
        const corePulse = 0.15 + particlePulseEffect * 0.1;
        const innerPulse = 0.1 + particlePulseEffect * 0.08;
        const outerPulse = 0.08 + particlePulseEffect * 0.06;
        const ringPulse = 0.07 + particlePulseEffect * 0.05;
        
        coreNebula.material.size = corePulse;
        innerNebula.material.size = innerPulse;
        outerNebula.material.size = outerPulse;
        ringParticles1.material.size = ringPulse;
        ringParticles2.material.size = ringPulse;
    } else {
        coreNebula.material.size = 0.15;
        innerNebula.material.size = 0.1;
        outerNebula.material.size = 0.08;
        ringParticles1.material.size = 0.07;
        ringParticles2.material.size = 0.07;
    }
    
    // Base rotation for all layers
    coreNebula.rotation.x += 0.01;
    coreNebula.rotation.z += 0.005;
    innerNebula.rotation.x += 0.008;
    innerNebula.rotation.z += 0.004;
    innerNebula.rotation.y += 0.002;
    outerNebula.rotation.x += 0.006;
    outerNebula.rotation.z += 0.003;
    outerNebula.rotation.y += 0.003;
    ringParticles1.rotation.x += 0.005;
    ringParticles1.rotation.z += 0.002;
    ringParticles2.rotation.x += 0.004;
    ringParticles2.rotation.z += 0.0015;
    
    // Slow rotation for background stars
    backgroundStars.rotation.y += 0.0002;
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the application
init();