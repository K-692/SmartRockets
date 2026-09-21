/**
 * DNA Class - Genotype representation for the Smart Rocket.
 * Each chromosome is an array of 2D force vectors (genes) corresponding to
 * discrete time-steps over the rocket's simulation lifespan.
 * 
 * @param {p5.Vector[]} [genes] - Optional preexisting array of force vectors.
 */
function DNA(genes) {
  if (genes) {
    this.genes = genes;
    for (let i = 0; i < lifespan; i++) {
      this.genes[i].setMag(maxforce);
    }
  } else {
    // Initialize random genes with bounded magnitude
    this.genes = [];
    for (let i = 0; i < lifespan; i++) {
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(maxforce);
    }
  }

  /**
   * Performs single-point crossover with a partner DNA.
   * A random split midpoint is chosen; genes before the midpoint come from partner,
   * while genes after the midpoint come from this parent.
   * 
   * @param {DNA} partner - The mate DNA to crossover with.
   * @returns {DNA} Offspring DNA combining both genetic sequences.
   */
  this.crossover = function (partner) {
    let newgenes = [];
    let mid = floor(random(this.genes.length));
    for (let i = 0; i < this.genes.length; i++) {
      if (i < mid) {
        newgenes[i] = partner.genes[i];
      } else {
        newgenes[i] = this.genes[i];
      }
    }
    return new DNA(newgenes);
  };

  /**
   * Applies stochastic mutation to individual genes.
   * With a 1% probability (0.01), a gene is replaced with a completely random 2D vector,
   * preserving diversity in the genetic search space.
   */
  this.mutation = function () {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.01) {
        // Mutation rate of 1%: inject random exploration vector
        this.genes[i] = p5.Vector.random2D();
      }
    }
  };
}
