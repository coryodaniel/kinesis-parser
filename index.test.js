const Kinesis = require('./index')



const helloWorldTextBuffer = new Buffer("Hello World").toString('base64')
const helloWorldJSONBuffer = new Buffer(JSON.stringify({"msg": "Hello World"})).toString('base64')
const jsonRecords = [{ "kinesis": { "data": helloWorldJSONBuffer } }]
const textRecords = [
  { "foo": "bar" },
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
    const results = textRecords.filter(Kinesis.filter).map(Kinesis.decode)
    expect(results[0]).toEqual("Hello World")
  })
})

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

  it("Filters out records that can't be parsed to JSON", () => {
    const results = Kinesis.parseJSON(jsonRecords)
    expect(results.length).toEqual(1)
    expect(results[0]).toEqual({"msg": "Hello World"})
  })
})
