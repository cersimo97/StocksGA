const fs = require('fs')
const parser = require('csv-parser')

const rs = fs.createReadStream('./PST.csv')
const ws = fs.createWriteStream('PST.json')
const results = []
rs.pipe(parser())
  .on('data', d => {
    results.push(d)
  })
  .on('end', () => ws.end(JSON.stringify(results, null, 2)))
