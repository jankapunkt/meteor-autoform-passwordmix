/* global AutoForm */
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

AutoForm.addInputType('passwordmix', {
  template: 'afPasswordmix',
  valueOut () {
    return this.val()
  },
  valueIn (initialValue) {
    return initialValue
  }
})

Template.afPasswordmix.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()

  instance.autorun(() => {
    const data = Template.currentData()
    const { atts } = data
    const { words } = atts
    const { jump } = atts
    const { whitespace } = atts
    const { regExp } = atts
    const { separator } = atts
    const { inputClass } = atts
    const invalid = atts.class && atts.class.indexOf('invalid') > -1
    const inputAtts = {
      maxlength: atts.max,
      size: atts.max || atts.min,
      type: atts.show ? 'text' : 'password',
      class: `form-control afPasswordmix-inputField ${inputClass}`
    }
    const state = {
      separator
    }
    const iterator = Array.from({ length: words }).map(x => state)
    instance.state.set(atts.id, { words, inputAtts, jump, whitespace, regExp, iterator, separator, invalid })
  })
})

Template.afPasswordmix.onRendered(function () {
  const instance = this
  const data = Template.currentData()
  const { value } = data
  if (!value) return

  const { separator } = data.atts
  instance.$('.afPasswordmix-hiddenInput').val(value)
  const split = value.split(separator)
  instance.$('.afPasswordmix-inputField').each(function (index, target) {
    if (index < split.length) {
      instance.$(target).val(split[ index ])
    }
  })
})

Template.afPasswordmix.helpers({
  wordInputs () {
    const instance = Template.instance()
    const state = instance.state.get(instance.data.atts.id)
    return state && state.iterator
  },
  inputAtts () {
    const instance = Template.instance()
    const state = instance.state.get(instance.data.atts.id)
    return state && state.inputAtts
  },
  showSeparator (separator, index, len) {
    if (!separator) return false
    return index < len - 1
  },
  dataSchemaKey () {
    return Template.instance().data.atts[ 'data-schema-key' ]
  },
  invalid () {
    const instance = Template.instance()
    const state = instance.state.get(instance.data.atts.id)
    return state && state.invalid
  }
})

Template.afPasswordmix.events({
  'input .afPasswordmix-inputField' (event, templateInstance) {
    const $inputs = templateInstance.$('.afPasswordmix-inputField')
    const words = []
    words.length = $inputs.length
    $inputs.each(function (index, value) {
      words[ index ] = templateInstance.$(value).val()
    })
    const instanceId = templateInstance.data.atts.id
    const state = templateInstance.state.get(instanceId)
    const { separator } = state
    templateInstance.$('.afPasswordmix-hiddenInput').val(words.join(separator || ''))
  }
})
