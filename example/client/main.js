import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import popper from 'popper.js'

import { Schema } from '../imports/schema/Schema'
import { formIsValid } from '../imports/form/formutil'

import './main.css'
import './main.html'

global.Popper = popper
global.AutoForm.setDefaultTemplate('bootstrap4')

const defaultConfig = {
  words: 3,
  min: 4,
  max: 20,
  regExp: '[a-z0-9A-Z]+',
  separator: '-',
  whitespace: true,
  jump: true,
  show: true,
  paste: true,
}

const configFormSchema = Schema.create({
  words: {
    type: Number,
    min: 1,
    defaultValue: defaultConfig.words
  },
  min: {
    type: Number,
    min: 1,
    defaultValue: defaultConfig.min
  },
  max: {
    type: Number,
    min: 1,
    defaultValue: defaultConfig.max
  },
  separator: {
    type: String,
    optional: true,
    defaultValue: defaultConfig.separator
  },
  regExp: {
    type: String,
    optional: true,
    defaultValue: defaultConfig.regExp
  },
  whitespace: {
    type: Boolean,
    optional: true,
    defaultValue: defaultConfig.whitespace
  },
  jump: {
    type: Boolean,
    optional: true,
    defaultValue: defaultConfig.jump
  },
  show: {
    type: Boolean,
    optional: true,
    defaultValue: defaultConfig.show
  },
  paste: {
    type: Boolean,
    optional: true,
    defaultValue: defaultConfig.paste
  },
  value: {
    type: String,
    optional: true,
    autoform: Object.assign({}, defaultConfig, {
      type: 'passwordmix'
    })
  }
})
Template.body.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
  instance.state.set('configDoc', defaultConfig)
})

Template.body.helpers({
  configFormSchema () {
    return configFormSchema
  },
  wordsFormSchema () {
    const configDoc = Template.instance().state.get('configDoc')
    const schemaDoc = Schema.toSchemaDef(configDoc)
    return Schema.create(schemaDoc)
  },
  passwordDoc () {
    const passwordDoc = Template.instance().state.get('passwordDoc')
    return passwordDoc && passwordDoc.password
  },
  confirmDoc () {
    const passwordDoc = Template.instance().state.get('passwordDoc')
    return passwordDoc && passwordDoc.confirm
  }
})

Template.body.events({
  'submit #configForm' (event, templateInstance) {
    event.preventDefault()

    const configDoc = formIsValid('configForm', configFormSchema)
    if (!configDoc) return

    templateInstance.state.set('configDoc', configDoc)
  },
  'submit #wordsForm' (event, templateInstance) {
    event.preventDefault()

    const configDoc = templateInstance.state.get('configDoc')
    const schemaDoc = Schema.toSchemaDef(configDoc)
    const passwordSchema = Schema.create(schemaDoc)

    const passwordDoc = formIsValid('wordsForm', passwordSchema)
    if (!passwordDoc) return

    templateInstance.state.set('passwordDoc', passwordDoc)
  }
})
