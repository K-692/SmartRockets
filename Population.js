/**
 * Population Class - Manages the collective swarm of Rockets across generations.
 * Implements fitness normalization, roulette-wheel mating pool generation,
 * and reproduction (selection, crossover, mutation).
 * 
 * @param {number} x - Base spawn coordinate X.
 * @param {number} y - Base spawn coordinate Y.
 */
function Population(x, y) {
  this.rockets = [];
  this.matingpool = [];
  this.maxfit = 0;
  this.reached = 0;
  this.notreached = 0;
  this.x = x;
  this.y = y;

  // Initialize rockets for the initial generation
  for (let i = 0; i < popsize; i++) {
    this.rockets[i] = new Rocket(0, this.x, this.y);
  }

  /**
   * Advances the simulation for all rockets in the population by one frame.
   */
  this.run = function() {
    for (let i = 0; i < popsize; i++) {
      this.rockets[i].update();
      this.rockets[i].show();
    }
  };

  /**
   * Evaluates fitness for all rockets, normalizes fitness values relative to
   * the maximum fitness observed, and populates the roulette-wheel mating pool.
   */
  this.evaluate = function() {
    this.maxfit = 0;
    // Step 1: Calculate raw fitness and track highest fitness
    for (let i = 0; i < popsize; i++) {
      this.rockets[i].calcFitness();
      if (this.rockets[i].fitness > this.maxfit)
        this.maxfit = this.rockets[i].fitness;
    }

    // Step 2: Normalize fitness to range [0, 1]
    for (let i = 0; i < popsize; i++) {
      this.rockets[i].fitness /= this.maxfit;
    }

    // Step 3: Populate mating pool proportionally to normalized fitness (Monte Carlo / Roulette)
    this.matingpool = [];
    for (let i = 0; i < popsize; i++) {
      var n = this.rockets[i].fitness * 100;
      for (let j = 0; j < n; j++) {
        this.matingpool.push(this.rockets[i]);
      }
    }
  };

  /**
   * Breeds the next generation of rockets through parent selection from the
   * mating pool, single-point crossover, and stochastic mutation.
   */
  this.selection = function() {
    let newrockets = [];
    for (let i = 0; i < this.rockets.length; i++) {
      // Pick two random parents from the weighted mating pool
      let indexA = floor(random(this.matingpool.length));
      let indexB = floor(random(this.matingpool.length));
      let parentAdna = this.matingpool[indexA].dna;
      let parentBdna = this.matingpool[indexB].dna;

      // Recombine DNA via crossover and apply mutation
      let childdna = parentAdna.crossover(parentBdna);
      childdna.mutation();

      // Instantiate offspring rocket
      newrockets[i] = new Rocket(childdna, this.x, this.y);
    }

    this.rockets = newrockets;
  };
}
