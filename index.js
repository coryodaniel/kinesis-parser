'use strict'

let parser = {}
parser.filter = (record) => {
  return record.kinesis
}

parser.decode = (kinesis) => {
  try {
    const decodedData = new Buffer(kinesis.data, 'base64').toString('utf8')
    const decodedKinesis = Object.assign({}, kinesis, {"data": decodedData})
    return decodedKinesis
  } catch (err) {
    return null
  }
}

parser.filterMap = (collection, filter, map) => {
  let results = []

  collection.forEach(function(item) {
    const filtered = filter(item)
    if(filtered) {
      const mapped = map(item)
      results.push(mapped)
    }
  })

  return results
}

parser.parse = (records) => {
  return parser.filterMap(records, parser.filter, (record) => {
    return parser.decode(record.kinesis)
  })
}

parser.parseJSON = (records) => {
  let results = [];
  const parsedRecords = parser.parse(records)

  parsedRecords.forEach(function(kinesis) {
    try {
      const data = JSON.parse(kinesis.data)
      const parsedKinesis = Object.assign({}, kinesis, {"data": data})
      results.push(parsedKinesis)
    } catch (err) {}
  })
  
  return results
}

module.exports = {
  decode: parser.decode,
  filter: parser.filter,
  parse: parser.parse,
  parseJSON: parser.parseJSON
}
exports = module.exports
