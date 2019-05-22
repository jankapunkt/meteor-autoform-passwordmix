import { Tracker } from 'meteor/tracker'
import SimpleSchema from 'simpl-schema'

SimpleSchema.extendOptions([ 'autoform' ])

export const Schema = {
  create (obj, { tracker = Tracker } = {}) {
    return new SimpleSchema(obj, { tracker })
  },
  toSchemaDef ({ words, min, max, regExp, whitespace, jump, show, separator }) {
    const seps = (words - 1) * (separator ? 1 : 0)
    return {
      password: {
        min: words * min + seps,
        max: words * max + seps,
        type: String,
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
