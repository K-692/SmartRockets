/**
 * Rocket Class - Physical entity (Phenotype) representing an autonomous navigating agent.
 * Simulates 2D kinematics, checks boundary and obstacle collisions, detects target
 * arrival, and computes individual fitness score.
 * 
 * @param {DNA} [dna] - The genetic sequence guiding the rocket's propulsion forces.
 * @param {number} x - Initial X spawn coordinate.
 * @param {number} y - Initial Y spawn coordinate.
 */
function Rocket(dna, x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.completed = false;
  this.crashed = false;
  this.fitness = 0;
  
  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  count = 0;

  /**
   * Applies an external directional force vector to the rocket's acceleration.
   * @param {p5.Vector} force - Force to apply.
   */
  this.applyForce = function (force) {
    this.acc.add(force);
  };

  /**
   * Updates physical state per frame:
   * 1. Applies current gene force.
   * 2. Checks target arrival and boundaries.
   * 3. Penalizes crashes or rewards successful completion.
   * 4. Integrates acceleration into velocity and position (Euler integration).
   */
  this.update = function () {
    this.applyForce(this.dna.genes[count]); // Each frame gets its respective gene vector

    this.isCompleted();
    this.borderCheck();
    if (this.crashed) {
      this.fitness /= 10; // Collision penalty: severely reduces reproduction probability
    }

    if (this.completed) {
      this.fitness *= 10; // Success reward: 10x multiplier for reaching the target
    }

    if (!this.completed && !this.crashed) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0); // Reset acceleration for next frame
    }
  };

  /**
   * Renders the rocket body oriented along its current velocity vector.
   */
  this.show = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rectMode(CENTER);
    rotate(this.vel.heading());
    rect(0, 0, 25, 5);
    pop();
  };

  /**
   * Computes individual fitness inversely proportional to final distance to target.
   * Closer proximity yields higher fitness.
   */
  this.calcFitness = function () {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = map(d, 0, width, width, 0);
  };

  /**
   * Detects if the rocket has reached within target radius (20px).
   */
  this.isCompleted = function () {
    var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    if (d < 20) this.completed = true;
  };

  /**
   * Checks Axis-Aligned Bounding Box (AABB) collision against a rectangular obstacle.
   * @param {number} x - Obstacle top-left X.
   * @param {number} y - Obstacle top-left Y.
   * @param {number} w - Obstacle width.
   * @param {number} h - Obstacle height.
   */
  this.isCrashed = function (x, y, w, h) {
    if (
      this.pos.x < x + w &&
      this.pos.y < y + h &&
      this.pos.x > x &&
      this.pos.y > y
    )
      this.crashed = true;
  };

  /**
   * Checks if rocket has ventured outside canvas perimeter.
   */
  this.borderCheck = function () {
    if (
      this.pos.x > width ||
      this.pos.x < 0 ||
      this.pos.y > height ||
      this.pos.y < 0
    )
      this.crashed = true;
  };
}
