const ACTIONS = ['b', 's', 'i']

export function getPossilbeActions(lastAction, prevActions) {
  if (!lastAction) return { b: 0.9, i: 0 }
  switch (lastAction) {
    case 'b':
      return { s: 0.9, i: 0 }
    case 's':
      return { b: 0.9, i: 0 }
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
