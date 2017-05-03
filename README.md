# Kinesis Parser

Small library for reading Kinesis `event.Records` in Lambda.


## Installing

```bash
npm install kinesis-parser --save
```

Parsing plain text messages

```js
const KinesisParser = require('kinesis-parser')

exports.handler = (event, context, callback) => {
  const messages = KinesisParser.parse(event.Records)
  // filters non-kinesis records and base64 decodes kinesis.data in one pass
  // messages => [{data": "Hello World"}]
}
```


Parsing JSON messages

```js
const KinesisParser = require('kinesis-parser')

exports.handler = (event, context, callback) => {
  const messages = KinesisParser.parseJSON(event.Records)
  // filters non-kinesis records and base64 decodes kinesis.data in one pass
  // parses JSON and discards records that do not parse
  // messages => [{data": {"msg":"Hello World"}},{...},...]
}
```
