/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 */

const { Transform, Readable } = require('stream')

class SampleReadStream extends Readable {
  constructor (source, options = {}) {
    super(options)
    this._source = []
    this._source_keys = []
    this._format_source(source)
  }

  _format_source (source) {
    const as_string = Buffer.from(source).toString().trim()
    const as_array = as_string.split('\n')
    this._source_keys = as_array[0].split(',')
    this._source = as_array.slice(1)
  }

  _read () {
    for (const line in this._source) {
      const as_array = this._source[line].split(',')
      const chunk = JSON.stringify({
        [this._source_keys[0]]: as_array[0],
        [this._source_keys[1]]: as_array[1]
      })
      this.push(chunk)
    }
    this.push(null)
  }
}

class SampleTransformStream extends Transform {
  constructor (ContactController, tenant_id, options = {}) {
    super(options)
    this._contact_controller = ContactController
    this.tenant_id = tenant_id
  }

  async _transform (chunk, encoding, callback) {
    const as_string = Buffer.from(chunk).toString()
    const as_object = JSON.parse(as_string)
    const record = await this._contact_controller.create_record({
      ...as_object,
      tenant_id: this.tenant_id
    })
    this.push(JSON.stringify(record))
    callback()
  }
}

module.exports = { SampleTransformStream, SampleReadStream }
