import Gene, { getPossilbeActions } from './gene'

class Chromosome {
  constructor(genes = null, history = null) {
    this.genes = genes || []
    this.fitness = 0
    if (history) this.history = history
    if (genes) {
      this.validate()
    }
    this.track = []
  }

  validate() {
    let first = this.genes.findIndex(g => g.action === 'b')
    let lastAction = 'b'
    this.genes.slice(first + 1).forEach(g => {
      if (g.action === lastAction) {
        g.action = 'i'
      } else if (g.action !== 'i' && g.action !== lastAction) {
        lastAction = g.action
      }
    })
    this.track = this.genes.filter(g => g.action !== 'i')
  }

  generate() {
    function chooseNext(pa) {
      let r = Math.random()
      let max = 0
      let choosen = null
      let entries = Object.entries(pa)
      let i = 0
      while (i < entries.length && max < 1 && max < r) {
        if (entries[i][1] >= max && entries[i][1] <= r) {
          max = entries[i][1]
          choosen = entries[i][0]
        }
        i++
      }
      return choosen
    }
    let newGenes = []
    let prevActions = getPossilbeActions()

    for (let i = 0; i < this.history.length; i++) {
      let nextAction = chooseNext(prevActions)
      newGenes.push(new Gene(this.history[i], nextAction))
      prevActions = getPossilbeActions(nextAction, prevActions)
    }
    this.genes = newGenes
  }

  // Calculate the fitness of the chromosome
  calculateFitness() {
    this.fitness = this.genes.reduce(
      (acc, curr) =>
        acc +
        (curr.action === 's'
          ? +curr.instance.y
          : curr.action === 'b'
          ? +curr.instance.y * -1
          : 0),
      0
    )
    this.earnings = this.fitness
    if (this.earnings < 0) this.fitness = 0
    this.fitness = ((1 + this.fitness) ** -1) ** 2
    return this.fitness
  }

  // Crossover the chromosome with another
  crossover(other) {
    let partA = this.genes.slice(0, Math.floor(this.genes.length / 2))
    let partB = other.genes.slice(Math.floor(other.genes.length / 2))
    return new Chromosome(partA.concat(partB), this.history)
  }

  // Mutate the chromosome
  mutate() {
    this.generate()
    this.validate()
  }
}

export default Chromosome
