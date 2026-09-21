/**
 * Main Simulation Driver & Controller for Smart Rockets using Genetic Algorithm.
 * Orchestrates p5.js canvas rendering, user controls, generational lifecycle,
 * and HUD telemetry.
 */

let rocket;
let popsize = 101;
let oldpop = popsize;
let lifespan = 250;
let population;
let dna;
let count = 0;
let target;
let generation = 0;
let x = 0;
let obstacles = [];
let reached = 0;
let notreached = popsize;
let fast = false;
let maxforce = 1;
let slider;

/**
 * Initial p5.js setup: creates canvas, spawns initial rocket population,
 * target vector, and binds interactive UI controls.
 */
function setup() {
  createCanvas(600, 600);
  population = new Population(width / 2, height - 50);
  dna = new DNA();
  createDOM();
  target = createVector(width / 2, 50);
}

/**
 * Main animation frame draw loop:
 * - Clears canvas and renders HUD boundaries
 * - Updates physics and displays swarm
 * - Checks obstacle collisions
 * - Advances generational cycle when lifespan elapses
 */
function draw() {
  background(231);
  showDetails();
  
  // Render partition lines demarcating spawn zones
  line(0, 200, width, 200);
  line(0, 400, width, 400);
  
  // Advance simulation for rocket population
  population.run();
  
  // Render barriers and check crash conditions
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].show();
    obstacles[i].checkCrash();
  }

  count++;

  // Generational turnover when lifespan is reached
  if (count == lifespan) {
    popsize = slider.value();
    
    // Count successful vs failed rockets in current generation
    for (let i = 0; i < population.rockets.length; i++) {
      if (population.rockets[i].completed) population.reached++;
      if (!population.rockets[i].completed) population.notreached++;
    }
    reached = population.reached;
    notreached = population.notreached;
    
    // If population slider changed, reset genetic data
    if (oldpop != popsize) {
      resetSketch();
    }
    oldpop = popsize;
    
    // Configure speed mode parameters
    if (fast) {
      lifespan = 100;
      maxforce = 3;
    }
    if (!fast) {
      lifespan = 250;
      maxforce = 1;
    }
    
    // Reset counters and execute GA operators
    population.reached = population.notreached = 0;
    population.evaluate();
    population.selection();
    generation++;
    count = 0;
  }

  push();
  ellipse(target.x, target.y, 25);
  ellipse(population.x, population.y, 25);
  
  // Limit max obstacles to prevent total blockade
  if (obstacles.length > 15) {
    alert("you can't add anymore because it may entirely block the path");
    obstacles.pop();
  }
  pop();
}

/**
 * Resets the entire simulation: re-randomizes start and target positions
 * within designated spawn areas and resets generation count.
 */
function resetSketch() {
  lifespan = 250;
  maxforce = 1;
  population = new Population(random(50, width - 50), random(420, 580));
  dna = new DNA();
  generation = 0;
  obstacles = [];
  fast = false;
  maxforce = 1;
  lifespan = 250;
  target = createVector(random(50, width - 50), random(20, 180));
}

/**
 * Adds a new random rectangular barrier within the obstacle spawn zone.
 */
function addObs() {
  obstacles.push(new Obstacle(population));
}

/**
 * Removes the most recently added obstacle.
 */
function removeObs() {
  obstacles.pop();
}

/**
 * Renders real-time HUD metrics and zone annotations on the canvas.
 */
function showDetails() {
  push();
  textStyle(BOLD);
  textSize(16);
  textAlign(CENTER);
  text("TARGET", target.x, target.y + 30);
  text("START", population.x, population.y + 30);
  
  // Telemetry metrics
  fill(130);
  textSize(12);
  textAlign(LEFT);
  text("GENERATION - " + (generation + 1), 20, 30);
  text("TOTAL ROCKETS - " + popsize, 20, 45);
  text("ROCKETS REACHED - " + reached, 20, 60);
  text("ROCKETS NOT REACHED - " + notreached, 20, 75);
  text("MUTATION RATE - 1%", 20, 90);
  
  // Zone labels
  text("End Point Spawn Area", 20, 180);
  text("Obstacle Spawn Area", 20, 380);
  text("Start Point Spawn Area", 20, 580);
  
  // Convergence / Evolution milestone indicator
  textSize(18);
  textAlign(CENTER);
  if (reached >= 0.2 * popsize) {
    text(
      "POPULATION HAS EVOLVED TO \n REACH DESTINATION IN THIS ENVIRONMENT",
      width / 2,
      height / 2
    );
  }

  // 2x mode badge
  if (fast) {
    textAlign(RIGHT);
    textSize(12);
    text("2X\n (Please Reset sketch for\n normal speed)", width - 20, 20);
  }
  pop();
}

/**
 * Activates 2x acceleration mode.
 */
function run2x() {
  fast = true;
}

/**
 * Constructs interactive DOM controls below the canvas:
 * - Reset button
 * - Add/Remove Obstacle buttons
 * - 2x speed acceleration button
 * - Swarm size population slider
 */
function createDOM() {
  let reset = createButton("Reset");
  let addObstacle = createButton("Add Obstacle");
  let removeObstacle = createButton("Remove Obstacle");
  let faster = createButton("2x");
  let divi = createSpan("Number of Rockets");
  divi.position(500, 630);
  slider = createSlider(1, 300, 100, 5);
  slider.position(500, 650);
  slider.size(100, 50);
  faster.mousePressed(run2x);
  faster.position(380, 650);
  faster.size(100, 50);
  addObstacle.mousePressed(addObs);
  addObstacle.position(20, 650);
  addObstacle.size(100, 50);
  removeObstacle.mousePressed(removeObs);
  removeObstacle.position(140, 650);
  removeObstacle.size(100, 50);
  reset.mousePressed(resetSketch);
  reset.position(260, 650);
  reset.size(100, 50);
}
