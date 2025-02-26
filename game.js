// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 0);
scene.add(directionalLight);

// Create ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x1a472a });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Create player
function createPlayer() {
    const playerGroup = new THREE.Group();
    
    // Body
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x2c5338 })  // Green shirt
    );
    body.position.y = 0.6;
    
    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xf5d0c1 })  // Skin color
    );
    head.position.y = 1.4;
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x2c5338 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 0.8, 0);
    leftArm.rotation.z = -Math.PI/6;
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 0.8, 0);
    rightArm.rotation.z = Math.PI/6;
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });  // Dark pants
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.1, 0);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.1, 0);
    
    playerGroup.add(body, head, leftArm, rightArm, leftLeg, rightLeg);
    playerGroup.position.y = 1;
    
    return playerGroup;
}

// Replace the existing player creation with the new detailed player
const player = createPlayer();
scene.add(player);

// Create a more interesting car
function createCar(color = 0xff0000, speed = 0.2) {
    const carGroup = new THREE.Group();
    
    // Car body - made more aerodynamic
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 4.5),
        new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.7,
            roughness: 0.3
        })
    );
    
    // Hood - sloped design
    const hood = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.4, 1.5),
        new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.7,
            roughness: 0.3
        })
    );
    hood.position.set(0, 0.2, -1.5);
    hood.rotation.x = -0.1;
    
    // Car roof - sleeker design
    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.7, 2),
        new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.7,
            roughness: 0.3
        })
    );
    roof.position.set(0, 0.85, -0.5);
    
    // Windows
    const windshield = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 0.8),
        new THREE.MeshStandardMaterial({ 
            color: 0x88ccff,
            transparent: true,
            opacity: 0.5,
            metalness: 0.9,
            roughness: 0.1
        })
    );
    windshield.position.set(0, 0.8, -1.4);
    windshield.rotation.x = Math.PI * 0.7;
    
    // Side windows
    const sideWindowGeometry = new THREE.PlaneGeometry(1.8, 0.6);
    const sideWindowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x88ccff,
        transparent: true,
        opacity: 0.5,
        metalness: 0.9,
        roughness: 0.1
    });
    
    const leftWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    leftWindow.position.set(-1.01, 0.8, -0.5);
    leftWindow.rotation.y = Math.PI * 0.5;
    
    const rightWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    rightWindow.position.set(1.01, 0.8, -0.5);
    rightWindow.rotation.y = -Math.PI * 0.5;
    
    // Wheels with custom rims
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // Create custom rim geometry
    const rimGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 8);
    const rimMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1
    });
    
    const wheelPositions = [
        [-1, -0.3, -1.5],
        [1, -0.3, -1.5],
        [-1, -0.3, 1.5],
        [1, -0.3, 1.5]
    ];
    
    wheelPositions.forEach(pos => {
        const wheelGroup = new THREE.Group();
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        
        wheel.rotation.z = Math.PI / 2;
        rim.rotation.x = Math.PI / 2;
        
        wheelGroup.add(wheel, rim);
        wheelGroup.position.set(...pos);
        carGroup.add(wheelGroup);
    });
    
    // Add headlights
    const headlightGeometry = new THREE.CircleGeometry(0.15, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 0.5
    });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.6, 0.3, -2.2);
    leftHeadlight.rotation.y = Math.PI;
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.6, 0.3, -2.2);
    rightHeadlight.rotation.y = Math.PI;
    
    // Add taillights
    const taillightGeometry = new THREE.CircleGeometry(0.1, 16);
    const taillightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });
    
    const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    leftTaillight.position.set(-0.6, 0.3, 2.2);
    
    const rightTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    rightTaillight.position.set(0.6, 0.3, 2.2);
    
    // Create and add BMW-style logo
    const logoGroup = new THREE.Group();
    
    // Create circular background for logo
    const logoBackground = new THREE.Mesh(
        new THREE.CircleGeometry(0.25, 32),
        new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1
        })
    );
    
    // Create outer ring
    const outerRing = new THREE.Mesh(
        new THREE.RingGeometry(0.23, 0.25, 32),
        new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 0.9,
            roughness: 0.1
        })
    );
    outerRing.position.z = 0.01;
    
    // Create the four colored sections
    const sectionGeometry = new THREE.CircleGeometry(0.23, 32, 0, Math.PI/2);
    
    // Blue sections
    const blueSection1 = new THREE.Mesh(
        sectionGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0x0066B1,
            metalness: 0.7,
            roughness: 0.3
        })
    );
    blueSection1.position.z = 0.005;
    
    const blueSection2 = new THREE.Mesh(
        sectionGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0x0066B1,
            metalness: 0.7,
            roughness: 0.3
        })
    );
    blueSection2.position.z = 0.005;
    blueSection2.rotation.z = Math.PI;
    
    // White sections
    const whiteSection1 = new THREE.Mesh(
        sectionGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.7,
            roughness: 0.3
        })
    );
    whiteSection1.position.z = 0.005;
    whiteSection1.rotation.z = Math.PI/2;
    
    const whiteSection2 = new THREE.Mesh(
        sectionGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.7,
            roughness: 0.3
        })
    );
    whiteSection2.position.z = 0.005;
    whiteSection2.rotation.z = -Math.PI/2;
    
    // Add letters "BMW"
    const textGeometry = new THREE.ShapeGeometry(
        new THREE.Shape()
            .moveTo(0, 0)
            .lineTo(0.15, 0)
            .lineTo(0.15, 0.05)
            .lineTo(0, 0.05)
            .lineTo(0, 0)
    );
    
    const bmwText = new THREE.Mesh(
        textGeometry,
        new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 0.9,
            roughness: 0.1
        })
    );
    bmwText.scale.set(0.5, 0.5, 0.5);
    bmwText.position.set(-0.1, 0.25, 0.01);
    
    // Add all logo components
    logoGroup.add(
        logoBackground,
        outerRing,
        blueSection1,
        blueSection2,
        whiteSection1,
        whiteSection2,
        bmwText
    );
    
    // Position the logo on the hood
    logoGroup.position.set(0, 0.4, -2.21);
    logoGroup.rotation.y = Math.PI;
    
    // Add grille
    const grille = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.3),
        new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            metalness: 0.9,
            roughness: 0.3
        })
    );
    grille.position.set(0, 0.3, -2.21);
    grille.rotation.y = Math.PI;
    
    // Add all parts to car group
    carGroup.add(
        body, 
        hood,
        roof, 
        windshield,
        leftWindow,
        rightWindow,
        leftHeadlight,
        rightHeadlight,
        leftTaillight,
        rightTaillight,
        logoGroup,
        grille
    );
    
    carGroup.position.set(5, 0.75, 0);
    carGroup.userData = { speed: speed };
    
    return carGroup;
}

// Replace car creation with new function
const car = createCar();
scene.add(car);

// Create a funky house
function createHouse(x, z) {
    const house = new THREE.Group();
    
    // Make the main building larger
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4, 8), // Doubled size
        new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 0.2,
            roughness: 0.8
        })
    );
    
    // Interior walls
    const interiorWalls = [
        // Kitchen wall
        new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 4, 4),
            new THREE.MeshStandardMaterial({ color: 0xe8e8e8 })
        ),
        // Bedroom wall
        new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 0.2),
            new THREE.MeshStandardMaterial({ color: 0xe8e8e8 })
        )
    ];
    
    interiorWalls[0].position.set(-2, 0, 0);
    interiorWalls[1].position.set(0, 0, -2);
    interiorWalls.forEach(wall => house.add(wall));

    // Add furniture
    const furniture = new THREE.Group();
    
    // Kitchen area
    const kitchen = new THREE.Group();
    
    // Counter
    const counter = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    counter.position.set(-3, 0.5, 1);
    
    // Stove
    const stove = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.9, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    stove.position.set(-3, 0.45, 2);
    
    // Fridge
    const fridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    fridge.position.set(-3, 1, 3);
    
    kitchen.add(counter, stove, fridge);
    
    // Living area
    const livingArea = new THREE.Group();
    
    // Couch
    const couch = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x666666 })
    );
    couch.position.set(1, 0.4, 1);
    
    // TV
    const tv = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.8, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    tv.position.set(1, 1.5, 3);
    
    livingArea.add(couch, tv);
    
    // Bedroom area
    const bedroom = new THREE.Group();
    
    // Bed
    const bed = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x4169e1 })
    );
    bed.position.set(2, 0.25, -3);
    
    // Pillow
    const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.1, 0.6),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    pillow.position.set(2.7, 0.55, -3);
    
    bedroom.add(bed, pillow);
    
    furniture.add(kitchen, livingArea, bedroom);
    house.add(furniture);
    
    // Larger roof
    const roofLayers = 3;
    for(let i = 0; i < roofLayers; i++) {
        const roofGeometry = new THREE.ConeGeometry(6 - (i * 0.5), 1.5, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            metalness: 0.3,
            roughness: 0.7
        });
        const roofLayer = new THREE.Mesh(roofGeometry, roofMaterial);
        roofLayer.position.y = 3 + (i * 0.8);
        roofLayer.rotation.y = (i * Math.PI / 4);
        house.add(roofLayer);
    }
    
    house.add(walls);
    house.position.set(x, 2, z);
    
    // Add interaction zones
    house.userData.interactionZones = {
        bed: {
            position: new THREE.Vector3(x + 2, 2, z - 3),
            action: 'sleep',
            range: 2
        },
        stove: {
            position: new THREE.Vector3(x - 3, 2, z + 2),
            action: 'cook',
            range: 2
        }
    };
    
    house.add(walls);
    house.position.set(x, 1.5, z);
    return house;
}

// Add player's house
const playerHouse = createHouse(-10, -10);
scene.add(playerHouse);

// Camera position
camera.position.set(0, 5, 10);
camera.lookAt(player.position);

// Game state
let isInCar = false;
const moveSpeed = 0.1;  // Increase for faster movement
const carSpeed = 0.2;   // Increase for faster driving
const keys = {};

// Add after the game state variables
const mouse = {
    x: 0,
    y: 0,
    isLocked: false
};

// Add camera rotation variables
let cameraRotation = 0;
const mouseSensitivity = 0.002;

// Add to the game state variables
let isInHouse = false;

// Add a new game state variable
let isInteracting = false; // Will be true when in shop menu or other UI interactions

// Add collision detection function
function checkCollisions(object, obstacles) {
    const objectBox = new THREE.Box3().setFromObject(object);
    
    for(const obstacle of obstacles) {
        const obstacleBox = new THREE.Box3().setFromObject(obstacle);
        if(objectBox.intersectsBox(obstacleBox)) {
            return true;
        }
    }
    return false;
}

// Create array to store collidable objects
const collidableObjects = [playerHouse];

// Add game state variables for shopping
const playerInventory = {
    money: 1000,
    items: []
};

// Add shop items
const shopInventory = {
    'Food Shop': [
        { name: 'Apple', price: 5, health: 10 },
        { name: 'Sandwich', price: 10, health: 25 },
        { name: 'Pizza', price: 20, health: 50 }
    ],
    'Clothing Shop': [
        { name: 'Hat', price: 50, style: 'head' },
        { name: 'Jacket', price: 100, style: 'body' },
        { name: 'Shoes', price: 75, style: 'feet' }
    ],
    'Electronics Shop': [
        { name: 'Phone', price: 500, utility: 'communication' },
        { name: 'Laptop', price: 800, utility: 'work' },
        { name: 'Camera', price: 300, utility: 'photography' }
    ],
    'Car Dealership': [
        { name: 'Sports Car', price: 25000, speed: 0.3, color: 0xff0000 },
        { name: 'SUV', price: 20000, speed: 0.25, color: 0x0000ff },
        { name: 'Luxury Sedan', price: 30000, speed: 0.28, color: 0x000000 }
    ],
    'Shoe Store': [
        { name: 'Sneakers', price: 80, wholesale: 40 },
        { name: 'Running Shoes', price: 120, wholesale: 60 },
        { name: 'Dress Shoes', price: 150, wholesale: 75 }
    ]
};

// Add business management variables
const playerBusiness = {
    inventory: [],
    storefront: null,
    dailyProfit: 0,
    lastRestockTime: Date.now()
};

// Add UI for shopping and inventory
const shopUI = document.createElement('div');
shopUI.style.display = 'none';
shopUI.style.position = 'absolute';
shopUI.style.top = '50%';
shopUI.style.left = '50%';
shopUI.style.transform = 'translate(-50%, -50%)';
shopUI.style.background = 'rgba(0, 0, 0, 0.8)';
shopUI.style.color = 'white';
shopUI.style.padding = '20px';
shopUI.style.borderRadius = '10px';
document.body.appendChild(shopUI);

// Add player stats UI
const statsUI = document.createElement('div');
statsUI.style.position = 'absolute';
statsUI.style.top = '10px';
statsUI.style.right = '10px';
statsUI.style.background = 'rgba(0, 0, 0, 0.6)';
statsUI.style.color = 'white';
statsUI.style.padding = '10px';
statsUI.style.borderRadius = '5px';
document.body.appendChild(statsUI);

// Update stats display
function updateStatsDisplay() {
    statsUI.innerHTML = `
        Money: $${playerInventory.money}<br>
        Items: ${playerInventory.items.length}
    `;
}
updateStatsDisplay();

// Add interaction markers
function addInteractionMarker(position, text) {
    const markerDiv = document.createElement('div');
    markerDiv.style.position = 'absolute';
    markerDiv.style.color = 'white';
    markerDiv.style.background = 'rgba(0, 0, 0, 0.8)';  // Darker background
    markerDiv.style.padding = '10px';
    markerDiv.style.borderRadius = '5px';
    markerDiv.style.display = 'none';
    markerDiv.style.fontSize = '16px';  // Larger text
    markerDiv.style.fontWeight = 'bold';  // Bold text
    markerDiv.style.zIndex = '1000';  // Ensure it's above other elements
    markerDiv.textContent = text;
    document.body.appendChild(markerDiv);
    
    return {
        element: markerDiv,
        position: position
    };
}

// Add markers for house and shops
const markers = [
    addInteractionMarker(playerHouse.position, 'Press E to enter house'),
    // Add markers for each shop...
];

// Handle keyboard controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isInteracting) {
            closeShop();
            closeShopManagement();
            isInteracting = false;
            renderer.domElement.requestPointerLock();
        }
    }
    
    // Only set key state if not interacting with UI
    if (!isInteracting) {
        keys[e.key] = true;
    }
    
    if (e.key === 'e' || e.key === 'E') {
        let interactionHandled = false;
        
        // Check for player's shoe shop interaction
        scene.traverse((object) => {
            if (!interactionHandled && 
                object.userData && 
                object.userData.type === 'Player Shoe Shop' && 
                player.position.distanceTo(object.position) < 5) {
                console.log('Managing shoe shop');
                managePlayerShop();
                interactionHandled = true;
            }
        });
        
        // Check for other shop interactions
        if (!interactionHandled) {
            scene.traverse((object) => {
                if (!interactionHandled && 
                    object.userData && 
                    object.userData.type && 
                    player.position.distanceTo(object.position) < 5) {
                    console.log('Entering shop:', object.userData.type);
                    isInteracting = true;
                    showShopMenu(object.userData.type);
                    interactionHandled = true;
                }
            });
        }
        
        // House entry/exit
        if (!interactionHandled && !isInCar) {
            const distanceToHouse = player.position.distanceTo(playerHouse.position);
            if (distanceToHouse < 5) {
                console.log('Entering/Exiting house');
                isInHouse = !isInHouse;
                if (isInHouse) {
                    player.position.set(
                        playerHouse.position.x,
                        player.position.y,
                        playerHouse.position.z
                    );
                    camera.position.y = 3;
                } else {
                    // Exit house
                    player.position.set(
                        playerHouse.position.x + 3,
                        player.position.y,
                        playerHouse.position.z + 3
                    );
                    camera.position.y = 5;
                }
            }
        }
        
        // House interactions
        if (isInHouse) {
            const houseData = playerHouse.userData.interactionZones;
            Object.entries(houseData).forEach(([zone, data]) => {
                const distance = player.position.distanceTo(data.position);
                if (distance < data.range) {
                    switch(data.action) {
                        case 'sleep':
                            sleep();
                            break;
                        case 'cook':
                            cookFood();
                            break;
                    }
                }
            });
        }
        
        // Car entry/exit
        if (!interactionHandled && !isInHouse) {
            const distanceToCar = player.position.distanceTo(car.position);
            if (distanceToCar < 5) {
                console.log('Entering/Exiting car');
                isInCar = !isInCar;
                if (isInCar) {
                    player.visible = false;
                } else {
                    player.visible = true;
                    player.position.set(
                        car.position.x + 2,
                        player.position.y,
                        car.position.z
                    );
                }
            }
        }
    }
});

window.addEventListener('keyup', (e) => {
    // Always allow key up events to prevent stuck keys
    keys[e.key] = false;
});

// Mouse pointer lock controls
renderer.domElement.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    mouse.isLocked = document.pointerLockElement === renderer.domElement;
});

document.addEventListener('mousemove', (e) => {
    if (mouse.isLocked) {
        mouse.x = e.movementX;
        cameraRotation -= e.movementX * mouseSensitivity;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const previousPosition = {
        player: player.position.clone(),
        car: car.position.clone()
    };
    
    // Player movement
    if (!isInCar) {
        const moveAngle = cameraRotation;
        if (keys['w'] || keys['W']) {
            // Forward
            player.position.x -= Math.sin(moveAngle) * moveSpeed;
            player.position.z -= Math.cos(moveAngle) * moveSpeed;
            // Animate legs while walking
            animateWalk();
        }
        if (keys['s'] || keys['S']) {
            // Backward
            player.position.x += Math.sin(moveAngle) * moveSpeed;
            player.position.z += Math.cos(moveAngle) * moveSpeed;
            animateWalk();
        }
        if (keys['a'] || keys['A']) {
            // Strafe left
            player.position.x -= Math.sin(moveAngle + Math.PI/2) * moveSpeed;
            player.position.z -= Math.cos(moveAngle + Math.PI/2) * moveSpeed;
            animateWalk();
        }
        if (keys['d'] || keys['D']) {
            // Strafe right
            player.position.x += Math.sin(moveAngle + Math.PI/2) * moveSpeed;
            player.position.z += Math.cos(moveAngle + Math.PI/2) * moveSpeed;
            animateWalk();
        }
        
        // Rotate player to face movement direction
        player.rotation.y = cameraRotation;
        
        // Adjust camera based on whether player is in house
        const cameraDistance = isInHouse ? 5 : 10;
        camera.position.x = player.position.x + Math.sin(cameraRotation) * cameraDistance;
        camera.position.z = player.position.z + Math.cos(cameraRotation) * cameraDistance;
        camera.position.y = isInHouse ? 3 : 5;
        camera.lookAt(player.position);
        
        // Check collisions after movement
        if(!isInHouse && checkCollisions(player, collidableObjects)) {
            player.position.copy(previousPosition.player);
        }
    }
    // Car movement
    else {
        const moveAngle = cameraRotation;
        if (keys['ArrowUp']) {
            car.position.x -= Math.sin(moveAngle) * carSpeed;
            car.position.z -= Math.cos(moveAngle) * carSpeed;
            car.rotation.y = moveAngle;
        }
        if (keys['ArrowDown']) {
            car.position.x += Math.sin(moveAngle) * carSpeed;
            car.position.z += Math.cos(moveAngle) * carSpeed;
            car.rotation.y = moveAngle + Math.PI;
        }
        if (keys['ArrowLeft']) {
            cameraRotation += 0.03;
        }
        if (keys['ArrowRight']) {
            cameraRotation -= 0.03;
        }
        
        // Update player position to match car
        player.position.copy(car.position);
        
        // Update camera position for car
        const cameraDistance = 10;
        camera.position.x = car.position.x + Math.sin(cameraRotation) * cameraDistance;
        camera.position.z = car.position.z + Math.cos(cameraRotation) * cameraDistance;
        camera.position.y = 5;
        camera.lookAt(car.position);
        
        // Check collisions after movement
        if(checkCollisions(car, collidableObjects)) {
            car.position.copy(previousPosition.car);
        }
    }
    
    // Update markers
    markers.forEach(marker => {
        const screenPosition = marker.position.clone().project(camera);
        const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-screenPosition.y * 0.5 + 0.5) * window.innerHeight;
        
        if(screenPosition.z < 1 && 
           player.position.distanceTo(marker.position) < 5) {
            marker.element.style.display = 'block';
            marker.element.style.left = x + 'px';
            marker.element.style.top = y + 'px';
        } else {
            marker.element.style.display = 'none';
        }
    });
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add some decorative elements around the house
function addDecorations() {
    // Add trees
    const treePositions = [
        [-8, -8], [-12, -12], [-12, -8], [-8, -12]
    ];
    
    treePositions.forEach(pos => {
        const tree = new THREE.Group();
        
        // Tree trunk
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 2, 8),
            new THREE.MeshStandardMaterial({ color: 0x4a2810 })
        );
        
        // Tree leaves (multiple layers)
        for(let i = 0; i < 3; i++) {
            const leaves = new THREE.Mesh(
                new THREE.ConeGeometry(1 - (i * 0.2), 1.5, 8),
                new THREE.MeshStandardMaterial({ color: 0x228B22 })
            );
            leaves.position.y = 1.5 + (i * 0.8);
            tree.add(leaves);
        }
        
        tree.add(trunk);
        tree.position.set(pos[0], 1, pos[1]);
        scene.add(tree);
        collidableObjects.push(tree);
    });
}

addDecorations();

function createShop(x, z, color = 0x99ccff, type = 'Food Shop') {
    const shop = new THREE.Group();
    
    // Shop main structure
    const building = new THREE.Mesh(
        new THREE.BoxGeometry(5, 4, 5),
        new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.3,
            roughness: 0.7 
        })
    );
    
    // Shop awning
    const awning = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.2, 1.5),
        new THREE.MeshStandardMaterial({ color: 0xff4444 })
    );
    awning.position.set(0, 2, 2.5);
    
    // Shop window
    const shopWindow = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 2),
        new THREE.MeshStandardMaterial({ 
            color: 0x87CEEB,
            metalness: 0.9,
            roughness: 0.1
        })
    );
    shopWindow.position.set(0, 1, 2.51);
    
    // Shop door
    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 2),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    door.position.set(1.5, 1, 2.51);
    
    shop.add(building, awning, shopWindow, door);
    
    // Rotate shop to face the road
    if (x > 0 && z > 0) { // First quadrant
        shop.rotation.y = -Math.PI; // Face west
    } else if (x < 0 && z > 0) { // Second quadrant
        shop.rotation.y = -Math.PI/2; // Face south
    } else if (x < 0 && z < 0) { // Third quadrant
        shop.rotation.y = 0; // Face east
    } else { // Fourth quadrant
        shop.rotation.y = Math.PI/2; // Face north
    }
    
    shop.position.set(x, 2, z);
    
    // Add shop type and interaction
    shop.userData = { type: type };
    
    // Create marker for this shop
    const marker = addInteractionMarker(
        new THREE.Vector3(x, 2, z), 
        `Press E to enter ${type}`
    );
    markers.push(marker);
    
    return shop;
}

function createAmusementPark(x, z) {
    const park = new THREE.Group();
    
    // Ferris wheel
    const wheel = new THREE.Group();
    const wheelRadius = 5;
    const wheelRim = new THREE.Mesh(
        new THREE.TorusGeometry(wheelRadius, 0.3, 16, 50),
        new THREE.MeshStandardMaterial({ color: 0xff4444 })
    );
    wheelRim.rotation.x = Math.PI / 2;
    
    // Add cabins to the wheel
    for(let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        cabin.position.set(
            Math.cos(angle) * wheelRadius,
            Math.sin(angle) * wheelRadius,
            0
        );
        wheel.add(cabin);
    }
    wheel.add(wheelRim);
    wheel.position.set(0, wheelRadius + 2, 0);
    
    // Support structure
    const support1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, wheelRadius * 2),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    const support2 = support1.clone();
    support1.position.set(-3, wheelRadius, 0);
    support2.position.set(3, wheelRadius, 0);
    
    park.add(wheel, support1, support2);
    park.position.set(x, 0, z);
    return park;
}

function createCityArea() {
    // Create shopping district with specific shop types
    const shops = [
        { x: 20, z: 20, color: 0x99ccff, type: 'Food Shop' },
        { x: 27, z: 20, color: 0xffcc99, type: 'Clothing Shop' },
        { x: 20, z: 27, color: 0x99ff99, type: 'Electronics Shop' },
        { x: 27, z: 27, color: 0xff99cc, type: 'Food Shop' }
    ];
    
    shops.forEach(shopData => {
        const shop = createShop(shopData.x, shopData.z, shopData.color, shopData.type);
        scene.add(shop);
        collidableObjects.push(shop);
    });
    
    // Create residential area
    const houses = [
        { x: -20, z: 20 },
        { x: -27, z: 20 },
        { x: -20, z: 27 },
        { x: -27, z: 27 }
    ];
    
    houses.forEach(houseData => {
        const house = createHouse(houseData.x, houseData.z);
        scene.add(house);
        collidableObjects.push(house);
    });
    
    // Create amusement area
    const amusementPark = createAmusementPark(0, 30);
    scene.add(amusementPark);
    collidableObjects.push(amusementPark);
    
    // Add roads
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    
    // Main roads
    const mainRoad1 = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 5),
        roadMaterial
    );
    mainRoad1.rotation.x = -Math.PI / 2;
    mainRoad1.position.set(0, 0.01, 0);
    
    const mainRoad2 = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 50),
        roadMaterial
    );
    mainRoad2.rotation.x = -Math.PI / 2;
    mainRoad2.position.set(0, 0.01, 0);
    
    scene.add(mainRoad1, mainRoad2);
    
    // Add street lamps
    const lampPositions = [
        { x: 10, z: 10 }, { x: -10, z: 10 },
        { x: 10, z: -10 }, { x: -10, z: -10 },
        { x: 0, z: 15 }, { x: 0, z: -15 },
        { x: 15, z: 0 }, { x: -15, z: 0 }
    ];
    
    lampPositions.forEach(pos => {
        const lamp = new THREE.Group();
        
        // Pole
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 4),
            new THREE.MeshStandardMaterial({ color: 0x666666 })
        );
        
        // Light fixture
        const fixture = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.2, 0.5),
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        fixture.position.y = 2;
        
        // Reduced light intensity from 1 to 0.5
        const light = new THREE.PointLight(0xffffcc, 0.5, 8);
        light.position.y = 2;
        
        lamp.add(pole, fixture, light);
        lamp.position.set(pos.x, 0, pos.z);
        scene.add(lamp);
        collidableObjects.push(lamp);
    });
    
    // Add shops near the house
    const shopPositions = [
        { type: 'Clothing Shop', x: -13, z: -10 },    // Left of house
        { type: 'Electronics Shop', x: -10, z: -13 }  // Behind house
    ];

    shopPositions.forEach(({ type, x, z }) => {
        const shop = new THREE.Group();
        
        // Shop building
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshStandardMaterial({ 
                color: type === 'Clothing Shop' ? 0xf4a460 : 0x87ceeb 
            })
        );
        
        // Shop sign
        const sign = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.5, 0.2),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        );
        sign.position.set(0, 2.5, 2.1);
        
        shop.add(building, sign);
        shop.position.set(x, 2, z);
        shop.userData.type = type;
        
        scene.add(shop);
        collidableObjects.push(shop);
        markers.push(addInteractionMarker(
            new THREE.Vector3(x, 2, z),
            `Press E to enter ${type}`
        ));
    });
    
    // Add car dealership opposite to the house (-10, -10), rotated 180 degrees
    const carDealership = createCarDealership(10, 10);
    carDealership.rotation.y = Math.PI; // Rotate 180 degrees
    scene.add(carDealership);
    collidableObjects.push(carDealership);
    markers.push(addInteractionMarker(
        new THREE.Vector3(10, 2, 10),
        'Press E to enter Car Dealership'
    ));
    
    // Add player's shoe shop opposite to house
    const playerShoeShop = createPlayerShoeShop(10, -10); // Opposite corner from house
    scene.add(playerShoeShop);
    collidableObjects.push(playerShoeShop);
    markers.push(addInteractionMarker(
        new THREE.Vector3(10, 2, -10),
        'Press E to manage your Shoe Shop'
    ));

    // Add residential neighborhood
    const residentialArea = createResidentialArea(-30, -30, 5); // 5 houses in the neighborhood
    scene.add(residentialArea);
    
    // Add park area
    const park = createParkArea(30, -30);
    scene.add(park);
}

// Call the function to create the city
createCityArea();

// Add animation for the Ferris wheel
let wheelRotation = 0;
const originalAnimate = animate;
animate = function() {
    // Rotate all Ferris wheels in the scene
    scene.traverse((object) => {
        if(object instanceof THREE.Group) {
            const wheel = object.children.find(child => 
                child instanceof THREE.Group && 
                child.children.some(c => c instanceof THREE.Mesh && 
                c.geometry instanceof THREE.TorusGeometry)
            );
            if(wheel) {
                wheel.rotation.z = wheelRotation;
            }
        }
    });
    wheelRotation += 0.005;
    
    originalAnimate();
};

animate();

// Update the showShopMenu function
function showShopMenu(shopType) {
    isInteracting = true;
    const items = shopInventory[shopType];
    shopUI.style.display = 'block';
    
    if (shopType === 'Car Dealership') {
        shopUI.innerHTML = `
            <h2 style="color: white; text-align: center;">Car Dealership</h2>
            <div style="max-height: 300px; overflow-y: auto;">
                ${items.map(item => `
                    <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${item.name}</strong><br>
                                Speed: ${item.speed * 100}mph<br>
                                Price: $${item.price}
                            </div>
                            <button onclick="buyItem('Car Dealership', '${item.name}')" 
                                    style="padding: 10px 20px; background: #4CAF50; border: none; color: white; border-radius: 5px;">
                                Purchase
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="closeShop()" 
                    style="width: 100%; margin-top: 10px; padding: 10px; background: #f44336;">
                Exit Dealership
            </button>
        `;
    } else {
        // Original shop menu for other shops
        shopUI.innerHTML = `
            <h2 style="color: white; text-align: center;">${shopType}</h2>
            <div style="max-height: 300px; overflow-y: auto;">
                ${items.map(item => `
                    <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1);">
                        ${item.name} - $${item.price}
                        <button onclick="buyItem('${shopType}', '${item.name}')" 
                                style="float: right; padding: 5px 10px;">
                            Buy
                        </button>
                    </div>
                `).join('')}
            </div>
            <button onclick="closeShop()" 
                    style="width: 100%; margin-top: 10px; padding: 10px;">
                Close (Esc)
            </button>
        `;
    }
}

// Update the buyItem function
function buyItem(shopType, itemName) {
    const item = shopInventory[shopType].find(i => i.name === itemName);
    if(item && playerInventory.money >= item.price) {
        playerInventory.money -= item.price;
        
        if (shopType === 'Car Dealership') {
            // Create a new car with the purchased properties
            const newCar = createCar(item.color, item.speed);
            // Place car in front of dealership
            const dealership = scene.children.find(obj => 
                obj.userData && obj.userData.type === 'Car Dealership'
            );
            if (dealership) {
                newCar.position.set(
                    dealership.position.x,
                    0.75,
                    dealership.position.z + 6 // Place in front of dealership
                );
            }
            scene.add(newCar);
            showNotification(`Bought ${itemName}! Your new car is outside.`);
        } else {
            playerInventory.items.push(item);
            showNotification(`Bought ${itemName}!`);
        }
        
        updateStatsDisplay();
    } else {
        showNotification("Not enough money!");
    }
}

// Add notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'absolute';
    notification.style.top = '20%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.background = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

// Update closeShop function
function closeShop() {
    shopUI.style.display = 'none';
    isInteracting = false; // Reset interaction state
    // Re-enable pointer lock after closing shop
    renderer.domElement.requestPointerLock();
}

// Make these functions global
window.buyItem = buyItem;
window.closeShop = closeShop;

// Add this walking animation function
function animateWalk() {
    // Get leg meshes from player group
    const leftLeg = player.children.find(child => child.position.x === -0.2);
    const rightLeg = player.children.find(child => child.position.x === 0.2);
    
    if (leftLeg && rightLeg) {
        // Simple leg swing animation
        const walkSpeed = 10;
        const walkAmount = 0.2;
        const time = Date.now() * 0.005;
        
        leftLeg.rotation.x = Math.sin(time * walkSpeed) * walkAmount;
        rightLeg.rotation.x = -Math.sin(time * walkSpeed) * walkAmount;
    }
}

// Add these functions for house interactions
function sleep() {
    if (!playerInventory.items.some(item => item.name === 'Bed')) {
        showNotification("You need to buy a bed first!");
        return;
    }
    showNotification("Getting some rest...");
    // Add any sleep mechanics here
}

function cookFood() {
    const foodItems = playerInventory.items.filter(item => 
        item.health && !item.cooked);
    
    if (foodItems.length === 0) {
        showNotification("No food to cook!");
        return;
    }
    
    const food = foodItems[0];
    food.cooked = true;
    food.health *= 1.5; // Cooked food provides more health
    showNotification(`Cooked ${food.name}!`);
}

// Create car dealership building
function createCarDealership(x, z) {
    const dealership = new THREE.Group();
    
    // Main showroom
    const showroom = new THREE.Mesh(
        new THREE.BoxGeometry(12, 4, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.5
        })
    );
    
    // Glass windows
    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(11.8, 3, 7.8),
        new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3
        })
    );
    glass.position.y = 0.2;
    
    // Add entrance
    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 3),
        new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.5
        })
    );
    door.position.set(0, 1.5, 4.01); // Front of building
    
    // Add dealership sign
    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    sign.position.set(0, 4.5, 0);
    
    // Add interior details
    const desk = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    desk.position.set(-4, 0.5, 0);
    
    dealership.add(showroom, glass, door, sign, desk);
    dealership.position.set(x, 2, z);
    
    // Add type and interaction data
    dealership.userData = { 
        type: 'Car Dealership',
        isInterior: false // Track if player is inside
    };
    
    return dealership;
}

// Create a new function for player's shoe shop
function createPlayerShoeShop(x, z) {
    const store = new THREE.Group();
    
    // Main building
    const building = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4, 8),
        new THREE.MeshStandardMaterial({ color: 0xe8c39e }) // Warm color
    );
    
    // Store front with large windows
    const storefront = new THREE.Mesh(
        new THREE.BoxGeometry(7.9, 3, 0.2),
        new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.4
        })
    );
    storefront.position.z = 4;
    
    // Door
    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 2.5),
        new THREE.MeshStandardMaterial({
            color: 0x8b4513
        })
    );
    door.position.set(0, 1.25, 4.01);
    
    // Shop sign
    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(6, 1, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x4a90e2 })
    );
    sign.position.set(0, 3.5, 3.75);
    
    // Display shelves
    const shelves = new THREE.Group();
    const shelfPositions = [[-2, 0, 2], [0, 0, 2], [2, 0, 2]];
    shelfPositions.forEach(pos => {
        const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
        shelf.position.set(...pos);
        shelves.add(shelf);
    });
    
    // Add all components
    store.add(building, storefront, door, sign, shelves);
    store.position.set(x, 2, z);
    
    // Add type and interaction data
    store.userData = { 
        type: 'Player Shoe Shop',
        isOpen: false,
        dailyEarnings: 0,
        lastUpdate: Date.now()
    };
    
    return store;
}

// Update managePlayerShop function
function managePlayerShop() {
    const shopUI = document.createElement('div');
    shopUI.style.position = 'absolute';
    shopUI.style.top = '50%';
    shopUI.style.left = '50%';
    shopUI.style.transform = 'translate(-50%, -50%)';
    shopUI.style.background = 'rgba(0, 0, 0, 0.9)';
    shopUI.style.color = 'white';
    shopUI.style.padding = '20px';
    shopUI.style.borderRadius = '10px';
    shopUI.style.minWidth = '400px';
    shopUI.id = 'shoe-shop-ui';
    
    const shop = scene.children.find(obj => 
        obj.userData && obj.userData.type === 'Player Shoe Shop'
    );
    
    const isOpen = shop.userData.isOpen;
    const earnings = shop.userData.dailyEarnings || 0;
    
    shopUI.innerHTML = `
        <h2>Your Shoe Shop Management</h2>
        <div style="margin: 15px 0;">
            <div>Status: ${isOpen ? '<span style="color: #4CAF50">Open</span>' : '<span style="color: #f44336">Closed</span>'}</div>
            <div>Today's Earnings: $${earnings}</div>
        </div>
        <div style="margin: 15px 0;">
            <h3>Inventory:</h3>
            ${playerBusiness.inventory.map(item => `
                <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1);">
                    <span>${item.name} - Stock: ${item.stock || 0}</span>
                    <span>Price: $${item.price}</span>
                </div>
            `).join('')}
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="toggleShopOpen()" 
                    style="flex: 1; padding: 10px; background: ${isOpen ? '#f44336' : '#4CAF50'};">
                ${isOpen ? 'Close Shop' : 'Open Shop'}
            </button>
            <button onclick="restockShop()"
                    style="flex: 1; padding: 10px; background: #2196F3;">
                Restock
            </button>
        </div>
        <button onclick="closeShopManagement()" 
                style="width: 100%; margin-top: 10px; padding: 10px; background: #666666;">
            Exit (Esc)
        </button>
    `;
    
    document.body.appendChild(shopUI);
    isInteracting = true;
}

// Update toggleShopOpen function
function toggleShopOpen() {
    const shop = scene.children.find(obj => 
        obj.userData && obj.userData.type === 'Player Shoe Shop'
    );
    shop.userData.isOpen = !shop.userData.isOpen;
    
    if (shop.userData.isOpen) {
        startGeneratingIncome();
        showNotification("Shop is now open!");
    } else {
        showNotification("Shop is now closed!");
    }
    
    managePlayerShop(); // Refresh UI
}

function startGeneratingIncome() {
    // Generate income every minute if shop is open
    setInterval(() => {
        const shop = scene.children.find(obj => 
            obj.userData && obj.userData.type === 'Player Shoe Shop'
        );
        
        if (shop && shop.userData.isOpen) {
            const inventory = playerBusiness.inventory;
            let income = 0;
            
            inventory.forEach(item => {
                if (item.stock > 0) {
                    const salesAmount = Math.floor(Math.random() * 3); // 0-2 sales per minute
                    const actualSales = Math.min(salesAmount, item.stock);
                    income += actualSales * (item.price - item.wholesale);
                    item.stock -= actualSales;
                }
            });
            
            shop.userData.dailyEarnings = (shop.userData.dailyEarnings || 0) + income;
            playerInventory.money += income;
            updateStatsDisplay();
        }
    }, 60000); // Every minute
}

// Update closeShopManagement function
function closeShopManagement() {
    const shopUIs = document.querySelectorAll('div');
    shopUIs.forEach(ui => {
        if (ui.innerHTML && ui.innerHTML.includes('Your Shoe Shop Management')) {
            document.body.removeChild(ui);
        }
    });
    
    isInteracting = false;
    renderer.domElement.requestPointerLock();
}

// Make shop functions global
window.toggleShopOpen = toggleShopOpen;
window.closeShopManagement = closeShopManagement;

// Add restockShop function that was missing
function restockShop() {
    const items = shopInventory['Shoe Store'];
    items.forEach(item => {
        if (playerInventory.money >= item.wholesale * 10) {
            playerInventory.money -= item.wholesale * 10;
            const inventoryItem = playerBusiness.inventory.find(i => i.name === item.name);
            if (inventoryItem) {
                inventoryItem.stock = (inventoryItem.stock || 0) + 10;
            } else {
                playerBusiness.inventory.push({
                    ...item,
                    stock: 10
                });
            }
            updateStatsDisplay();
        }
    });
    showNotification("Restocked inventory!");
    managePlayerShop(); // Refresh UI
}

// Make restockShop function global
window.restockShop = restockShop;

// Create residential neighborhood
function createResidentialArea(startX, startZ, houseCount) {
    const neighborhood = new THREE.Group();
    
    // Create streets
    const streetMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const mainStreet = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 6),
        streetMaterial
    );
    mainStreet.rotation.x = -Math.PI / 2;
    mainStreet.position.y = 0.01;
    
    // Add sidewalks
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const sidewalk1 = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 1),
        sidewalkMaterial
    );
    sidewalk1.rotation.x = -Math.PI / 2;
    sidewalk1.position.set(0, 0.02, 3.5);
    
    const sidewalk2 = sidewalk1.clone();
    sidewalk2.position.z = -3.5;
    
    neighborhood.add(mainStreet, sidewalk1, sidewalk2);
    
    // Add houses along the street
    for (let i = 0; i < houseCount; i++) {
        const offset = (i - Math.floor(houseCount/2)) * 8;
        const houseStyle = Math.floor(Math.random() * 3); // 3 different house styles
        const house = createHouseVariant(startX + offset, startZ - 8, houseStyle);
        neighborhood.add(house);
        collidableObjects.push(house);
        
        // Add yard decorations
        addYardDecorations(house.position.x, house.position.z, neighborhood);
    }
    
    return neighborhood;
}

// Create different house styles
function createHouseVariant(x, z, style) {
    const house = new THREE.Group();
    
    let wallsGeometry, wallsColor, roofGeometry, roofColor;
    
    switch(style) {
        case 0: // Modern style
            wallsGeometry = new THREE.BoxGeometry(6, 4, 6);
            wallsColor = 0xffffff;
            roofGeometry = new THREE.BoxGeometry(7, 0.5, 7);
            roofColor = 0x333333;
            break;
        case 1: // Colonial style
            wallsGeometry = new THREE.BoxGeometry(6, 5, 6);
            wallsColor = 0xf4d03f;
            roofGeometry = new THREE.ConeGeometry(5, 3, 4);
            roofColor = 0x8b4513;
            break;
        case 2: // Cottage style
            wallsGeometry = new THREE.BoxGeometry(5, 3.5, 5);
            wallsColor = 0xe8c39e;
            roofGeometry = new THREE.ConeGeometry(4, 2.5, 8);
            roofColor = 0x2c3e50;
            break;
    }
    
    const walls = new THREE.Mesh(
        wallsGeometry,
        new THREE.MeshStandardMaterial({ color: wallsColor })
    );
    
    const roof = new THREE.Mesh(
        roofGeometry,
        new THREE.MeshStandardMaterial({ color: roofColor })
    );
    roof.position.y = walls.geometry.parameters.height / 2 + roofGeometry.parameters.height / 2;
    
    house.add(walls, roof);
    house.position.set(x, 2, z);
    
    return house;
}

// Add yard decorations
function addYardDecorations(x, z, parent) {
    // Add trees
    const treePositions = [
        [x - 2, z + 2],
        [x + 2, z + 2]
    ];
    
    treePositions.forEach(pos => {
        const tree = createTree(pos[0], pos[1], 0.8 + Math.random() * 0.4);
        parent.add(tree);
    });
    
    // Add mailbox
    const mailbox = new THREE.Group();
    const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    box.position.y = 0.5;
    mailbox.add(post, box);
    mailbox.position.set(x - 2, 0.5, z + 3.5);
    parent.add(mailbox);
}

// Create park area
function createParkArea(x, z) {
    const park = new THREE.Group();
    
    // Create grass
    const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({ color: 0x90EE90 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0.01;
    
    // Add walking paths
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C });
    const mainPath = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 30),
        pathMaterial
    );
    mainPath.rotation.x = -Math.PI / 2;
    mainPath.position.y = 0.02;
    
    const crossPath = mainPath.clone();
    crossPath.rotation.z = Math.PI / 2;
    
    park.add(grass, mainPath, crossPath);
    
    // Add benches
    const benchPositions = [
        [5, 5], [-5, 5], [5, -5], [-5, -5]
    ];
    
    benchPositions.forEach(pos => {
        const bench = createBench();
        bench.position.set(pos[0], 0, pos[1]);
        park.add(bench);
    });
    
    // Add trees randomly
    for(let i = 0; i < 15; i++) {
        const treeX = (Math.random() - 0.5) * 25;
        const treeZ = (Math.random() - 0.5) * 25;
        const tree = createTree(treeX, treeZ, 0.8 + Math.random() * 0.4);
        park.add(tree);
    }
    
    park.position.set(x, 0, z);
    return park;
}

// Create bench
function createBench() {
    const bench = new THREE.Group();
    
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.1, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    seat.position.y = 0.4;
    
    const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    backrest.position.set(0, 0.6, -0.2);
    backrest.rotation.x = Math.PI * 0.1;
    
    const legs = new THREE.Group();
    [-0.8, 0.8].forEach(x => {
        const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.4, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        leg.position.set(x, 0.2, 0);
        legs.add(leg);
    });
    
    bench.add(seat, backrest, legs);
    return bench;
}

// Create tree helper function
function createTree(x, z, scale = 1) {
    const tree = new THREE.Group();
    
    // Trunk
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 2 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a2810 })
    );
    trunk.position.y = scale;
    
    // Leaves (multiple layers)
    for(let i = 0; i < 3; i++) {
        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(1 * scale - (i * 0.2), 1.5 * scale, 8),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        leaves.position.y = 1.5 * scale + (i * 0.8 * scale);
        tree.add(leaves);
    }
    
    tree.add(trunk);
    tree.position.set(x, 0, z);
    return tree;
}

// Create shopping plaza
function createShoppingPlaza(x, z) {
    const plaza = new THREE.Group();
    
    // Create grass
    const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({ color: 0x90EE90 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0.01;
    
    // Add benches
    const benchPositions = [
        [5, 5], [-5, 5], [5, -5], [-5, -5]
    ];
    
    benchPositions.forEach(pos => {
        const bench = createBench();
        bench.position.set(pos[0], 0, pos[1]);
        plaza.add(bench);
    });
    
    // Add trees randomly
    for(let i = 0; i < 15; i++) {
        const treeX = (Math.random() - 0.5) * 25;
        const treeZ = (Math.random() - 0.5) * 25;
        const tree = createTree(treeX, treeZ, 0.8 + Math.random() * 0.4);
        plaza.add(tree);
    }
    
    plaza.position.set(x, 0, z);
    return plaza;
} 