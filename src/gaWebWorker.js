import GA from './ga'

export const start = async event => {
  console.log('onmessage')
  if (event && event.data) {
    const data = event.data
    if (data) {
      const ga = new GA(data)
      ga.setPopulation()
      const s = await ga.start()
      console.log(s)
      const b = ga.getBest()
      console.log(b)
      return {
        best: b,
        data: s,
      }
    }
  }
}
