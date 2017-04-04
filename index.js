module.exports.filter = (record) => {
  return record.kinesis
}

module.exports.decode = (record, transform) => {
  try {
    const encodedPayload = record.kinesis.data
    const buffer = new Buffer(encodedPayload, 'base64').toString('utf8')

    if (transform) {
      return transform(buffer)
    } else {
      return buffer
    }
  } catch (err) {
    return null
  }
}

module.exports.decodeJSON = (record) => {
  return module.exports.decode(record, JSON.parse)
}

module.exports.parseJSON = (records) => {
  return module.exports.parse(records, JSON.parse)
}

module.exports.parse = (records, transform) => {
  let results = []

  records.forEach(function(record) {
    const isKinesisRecord = module.exports.filter(record)
    if(isKinesisRecord) {
      const decoded = module.exports.decode(record, transform)
      if(decoded){ results.push(decoded) }
    }
  });

  return results
}

exports = module.exports
