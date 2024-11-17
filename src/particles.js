// Get the canvas and create the engine
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Declare particleSystem at the top level so it's accessible everywhere
let particleSystem;
let camera;

// At the top with other global variables
let currentColor = 0;
const interpolationSpeed = 0.01;



async function initScene() {
    // Wait for initial data
    while (pm1_0 === null) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Now create the scene
    const scene = await createScene();

    // Start render loop
    engine.runRenderLoop(function () {
        updateParticleColors();
        scene.render();
    });
}

async function createScene() {
    var scene = new BABYLON.Scene(engine);

    // Setup environment
    scene.clearColor = new BABYLON.Color3(0, 0, 0); // Set background to black
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 2, 8), scene);
    camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1.058, 14.186, new BABYLON.Vector3(0, 0, 0), scene); //sets initial camera position
    camera.attachControl(canvas, true);

    console.log(`Alpha: ${camera.alpha}`);
    console.log(`Beta: ${camera.beta}`);
    console.log(`Radius: ${camera.radius}`);

    //Sphere around emitter
    var sphere = BABYLON.MeshBuilder.CreateCylinder("sphere", { height: 1, diameter: 2 }, scene);
    sphere.material = new BABYLON.StandardMaterial("mat", scene);
    sphere.material.wireframe = true;
    sphere.material.alpha = 0;

    // Create a particle system (remove 'var' since we declared it above)
    particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("./src/textures/flare.png", scene, false, false, null, function () {
        console.log("Texture loaded successfully");
    }, function (err) {
        console.error("Failed to load texture:", err);
    });

    // Where the particles come from
    particleSystem.emitter = BABYLON.Vector3.Zero(); // the starting location

    // Colors of all particles (RGBA)
    //new particles colors range from color1 to color2
    //colorDead is the color of the particles when they disappear
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    console.log(`pm1.0: ${pm1_0}`);

    // particleSystem.color1 = new BABYLON.Color4(pm1_0, pm1_0, pm1_0, 1.0);
    // particleSystem.color2 = new BABYLON.Color4(pm1_0, pm1_0, pm1_0, 1.0);
    // particleSystem.colorDead = new BABYLON.Color4(0.2, 0.0, 0.0, 0.0); // Transparent dark red

    console.log(particleSystem.color1)
    console.log(particleSystem.color1)

    //particleSystem.color1 = new BABYLON.Color4(.6, 0.2, 0.0, 1.0);    // Bright red
    //particleSystem.color2 = new BABYLON.Color4(0.5, 0.0, 0.0, 1.0);    // Dark red
    //particleSystem.colorDead = new BABYLON.Color4(0.2, 0.0, 0.0, 0.0); // Transparent dark red

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Emission rate
    particleSystem.emitRate = 1000;

    /******* Emission Space ********/
    particleSystem.createCylinderEmitter(1, 1, 0, 0);

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();

    return scene;
}

// // Call the createScene function
// const scene = createScene();

// Call the init function instead of createScene directly
initScene();

// Create a function to update particle colors
function updateParticleColors() {
    // Smoothly interpolate towards target color
    currentColor += (pm1_0 - currentColor) * interpolationSpeed;

    particleSystem.color1 = new BABYLON.Color4(currentColor, currentColor, currentColor, 1.0);
    particleSystem.color2 = new BABYLON.Color4(currentColor, currentColor, currentColor, 1.0);
}

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});