import Gene, { getPossilbeActions } from './gene'

class Chromosome {
  constructor(genes = null, history = null) {
    this.genes = genes || []
    this.fitness = 0
    if (history) this.history = history
    if (genes) {
      this.validate()
    }
    this.track = this.genes.filter(g => g.action !== 'i')
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
      let r = Math.floor(Math.random() * pa.length)
      let choosen = pa[r]
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
    if (this.earnings > 0) this.fitness *= 20
    this.fitness /= this.genes.filter(g => g.action !== 'i').length * 20
    // this.genes.filter(g => g.action !== 'i').length / this.genes.length +
    // 1 / (1 + this.fitness) ** 2
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
