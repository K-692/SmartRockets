/**
 * Obstacle Class - Environmental barrier with randomized dimensions and color.
 * Confined within the obstacle spawn zone (Y: 180 to 380).
 */
class Obstacle {
  /**
   * Initializes a random rectangular barrier.
   * @param {Population} population - Reference to the rocket population to test collisions against.
   */
  constructor(population) {
    this.pos = {
      x: random(50, width - 50),
      y: random(180, 380), // Restricted within designated obstacle spawn perimeter
    };
    this.prop = { h: random(30, 70), w: random(30, 70) };
    this.population = population;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  /**
   * Renders the colored rectangular barrier on canvas.
   */
  show() {
    push();
    fill(this.r, this.g, this.b);
    rect(this.pos.x, this.pos.y, this.prop.w, this.prop.h);
    pop();
  }

  /**
   * Checks collision between this obstacle and every active rocket in the population.
   */
  checkCrash() {
    for (let i = 0; i < this.population.rockets.length; i++) {
      this.population.rockets[i].isCrashed(
        this.pos.x,
        this.pos.y,
        this.prop.w,
        this.prop.h
      );
    }
  }
}
