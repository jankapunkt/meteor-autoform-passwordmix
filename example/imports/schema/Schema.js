import { Tracker } from 'meteor/tracker'
import SimpleSchema from 'simpl-schema'

SimpleSchema.extendOptions([ 'autoform' ])

export const Schema = {
  create (obj, { tracker = Tracker } = {}) {
    return new SimpleSchema(obj, { tracker })
  },
  toSchemaDef ({ words, min, max, regExp, whitespace, jump, show, separator, value }) {
    const seps = (words - 1) * (separator ? 1 : 0)
    return {
      password: {
        type: String,
        defaultValue: value,
        min: words * min + seps,
        max: words * max + seps,
        autoform: {
          type: 'passwordmix',
          words,
          min,
          max,
          regExp,
          whitespace,
          jump,
          show,
          separator
        }
      }
    }
  }
}
