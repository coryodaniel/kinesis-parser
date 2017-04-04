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
  // messages => ["Hello World"]
}
```


Parsing JSON messages

```js
const KinesisParser = require('kinesis-parser')

exports.handler = (event, context, callback) => {
  const messages = KinesisParser.parseJSON(event.Records)
  // messages => [{...},{...},...]
}
```
