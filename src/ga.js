import Population from './population.js'

class GA {
  constructor(history) {
    this.population = new Population(100, 0.3, history)
    this.currentGeneration = 0
    this.fitnessHistory = []
  }

  setPopulation() {
    this.population.generate()
  }

  getBest() {
    return this.population.bestChromosome
  }

  calcFitness() {
    this.population.calculateFitness()
  }

  start() {
    return new Promise((resolve, reject) => {
      while (this.currentGeneration < 1000) {
        this.population.calculateFitness()
        this.population.sortChromosomes()
        this.fitnessHistory.push({
          gen: this.currentGeneration,
          fitness: this.population.avgFitness,
          bestFitness: this.population.bestFitness,
        })
        this.population.generateNewPopulation()
        this.population.mutate()
        this.currentGeneration++
      }
      resolve({
        population: this.population,
        fitnessHistory: this.fitnessHistory,
      })
    })
  }
}

export default GA
