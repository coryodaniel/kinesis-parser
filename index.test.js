const Kinesis = require('./index')

const helloWorldTextBuffer = new Buffer("Hello World").toString('base64')
const helloWorldJSONBuffer = new Buffer(JSON.stringify({"msg": "Hello World"})).toString('base64')
const jsonRecords = [{
  "kinesis": {
    "data": helloWorldJSONBuffer,
  }
}]
const textRecords = [
  { "not-a-kinesis-record": "bar" },
  { "kinesis": { "data": helloWorldTextBuffer } }
]
const mixedRecords = [
  { "kinesis": { "data": helloWorldTextBuffer } },
  { "kinesis": { "data": helloWorldJSONBuffer } }
]

describe('#filter', () => {
  it('Returns only kinesis records', () => {
    const results = textRecords.filter(Kinesis.filter)
    expect(results.length).toEqual(1)
  })
})

describe('#decode', () => {
  it('Decodes base64 messages', () => {
    const results = textRecords.filter(Kinesis.filter).map((record) => Kinesis.decode(record.kinesis))
    expect(results[0]).toEqual({"data": "Hello World"})
  })
})

describe('#parse', () => {
  it('Parses and filters records in one pass', () => {
    const results = Kinesis.parse(textRecords)
    expect(results.length).toEqual(1)
    expect(results[0]).toEqual({"data": "Hello World"})
  })

  it('Returns mixed types from a kinesis record', () => {
    const results = Kinesis.parse(mixedRecords)
    expect(results.length).toEqual(2)
    expect(results[0]).toEqual({"data": "Hello World"})
    expect(results[1]).toEqual({"data": "{\"msg\":\"Hello World\"}"})
  })
})

describe('#parseJSON', () => {
  it('Parses JSON', () => {
    const results = Kinesis.parseJSON(jsonRecords)
    expect(results[0]).toEqual({"data": {"msg": "Hello World"}})
  })

  it("Filters out records that can't be parsed to JSON", () => {
    const results = Kinesis.parseJSON(mixedRecords)
    expect(results.length).toEqual(1)
    expect(results[0]).toEqual({"data": {"msg": "Hello World"}})
  })
})
