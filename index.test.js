const Kinesis = require('./index')

const textRecords = [
  {"foo": "bar"},
  {
    "kinesis": {
      "data": new Buffer("Hello World").toString('base64')
    }
  }
]

describe('#filter', () => {
  it('Returns only kinesis records', () => {
    const results = textRecords.filter(Kinesis.filter)
    expect(results.length).toEqual(1)
  })
})

describe('#decode', () => {
  it('Decodes base64 messages', () => {
    const results = textRecords.filter(Kinesis.filter).map(Kinesis.decode)
    expect(results[0]).toEqual("Hello World")
  })
})

const jsonRecords = [
  {
    "kinesis": {
      "data": new Buffer(JSON.stringify({"msg": "Hello World"})).toString('base64'),
    }
  }
]

describe('#decodeJSON', () => {
  it('Decodes base64 messages and parses JSON', () => {
    const results = jsonRecords.map(Kinesis.decodeJSON)
    expect(results[0]).toEqual({"msg": "Hello World"})
  })
})

describe('#parse', () => {
  it('Parses and filters records in one pass', () => {
    const results = Kinesis.parse(textRecords)
    expect(results.length).toEqual(1)
    expect(results[0]).toEqual("Hello World")
  })
})

describe('#parseJSON', () => {
  it('Parses JSON and filters records in one pass', () => {
    const results = Kinesis.parseJSON(jsonRecords)
    expect(results.length).toEqual(1)
    expect(results[0]).toEqual({"msg": "Hello World"})
  })
})
