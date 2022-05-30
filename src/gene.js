const ACTIONS = ['b', 's', 'i']

export function getPossilbeActions(lastAction, prevActions) {
  if (!lastAction) return ['b', 'i']
  switch (lastAction) {
    case 'b':
      return ['s', 'i']
    case 's':
      return ['b', 'i']
    default:
      return prevActions
  }
}

class Gene {
  constructor(instance, action = null) {
    this.instance = instance
    if (action) {
      this.action = action
    } else {
      this.action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    }
  }

  mutate() {
    this.action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
  }
}

export default Gene
