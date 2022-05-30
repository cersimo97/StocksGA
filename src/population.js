import Chromosome from './chromosome.js'

class Population {
  constructor(popSize, mutationRate, history) {
    this.popSize = popSize
    this.mutationRate = mutationRate
    this.chromosomes = []
    this.generation = 0
    this.bestFitness = 0
    this.avgFitness = 0
    this.bestChromosome = null
    this.history = history
  }

  // Generate a random population of chromosomes
  generate() {
    for (let i = 0; i < this.popSize; i++) {
      let c = new Chromosome(null, this.history)
      c.generate()
      this.chromosomes.push(c)
    }
  }

  // Calculate the fitness of each chromosome in the population
  calculateFitness() {
    let totalFitness = this.chromosomes
      .map(chromosome => chromosome.calculateFitness())
      .reduce((a, b) => a + b, 0)
    // this.chromosomes.forEach(chromosome => {
    //   chromosome.fitness = chromosome.fitness / totalFitness
    // })
    this.avgFitness = totalFitness / this.popSize
  }

  // Sort the chromosomes by fitness
  sortChromosomes() {
    let sortedChromosomes = this.chromosomes.sort(
      (a, b) => b.fitness - a.fitness
    )
    if (sortedChromosomes[0].fitness < sortedChromosomes[1].fitness) {
      throw new Error('Population is not sorted')
    }
    // let negativeChromosomes = sortedChromosomes.findIndex(
    //   chromosome => chromosome.fitness < 0
    // )
    // this.chromosomes = sortedChromosomes
    //   .slice(negativeChromosomes)
    //   .concat(
    //     sortedChromosomes
    //       .slice(0, negativeChromosomes)
    //       .reduce((acc, curr) => [curr, ...acc], [])
    //   )
    this.bestChromosome = this.chromosomes[0]
    this.bestFitness = this.chromosomes[0].fitness
  }

  // Pick a random chromosome from the population
  pickIndividual() {
    let index = Math.floor(Math.random() * this.popSize)
    return this.chromosomes[index]
  }

  // Create a new population of chromosomes
  generateNewPopulation() {
    let newPopulation = [...this.chromosomes.slice(0, 10)]
    for (let i = 0; i < this.popSize - 10; i++) {
      let parentA = this.pickIndividual()
      let parentB = this.pickIndividual()
      let child = parentA.crossover(parentB)
      newPopulation.push(child)
    }
    this.chromosomes = newPopulation
  }

  // Mutate a random chromosome in the population
  mutate() {
    for (let i = 0; i < this.popSize * 0.02; i++) {
      if (Math.random() < this.mutationRate) {
        this.chromosomes[i].mutate()
      }
    }
  }
}

export default Population
