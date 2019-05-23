/* global AutoForm $ */
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

const whiteSpaceRegExp = new RegExp(/^[\s]+$/)

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
    const iterator = Array.from({ length: atts.words }).map(x => state)
    instance.state.set(atts.id, Object.assign({}, atts, { inputAtts, invalid, iterator }))

    if (invalid) {
      updateWords(instance)
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
  'keydown .afPasswordmix-inputField' (event, templateInstance) {
    const instanceId = templateInstance.data.atts.id
    const state = templateInstance.state.get(instanceId)
    const { whitespace } = state
    const regExp = state.regExp && new RegExp(state.regExp, 'g')

    switch (event.key) {
      case 'Backspace':
      case 'Tab':
      case 'Enter':
      case 'Return':
        return true
      case 'Space':
        return !whitespace
      default:
        if (regExp) {
          //console.log(event.key, regExp.toString(), regExp.test(event))
          return regExp.test(event.key)
        } else {
          return true
        }
    }
  },
  'paste' (event, templateInstance) {
    const instanceId = templateInstance.data.atts.id
    const state = templateInstance.state.get(instanceId)
    const { paste } = state
    if (!paste) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
  },
  'input .afPasswordmix-inputField' (event, templateInstance) {
    updateWords(templateInstance)
  },
})

function assignError ($target) {
  $target.removeClass('border-success')
  $target.addClass('border border-danger')
  return false
}

function clearError ($target) {
  $target.removeClass('border-danger')
  $target.addClass('border border-success')
}

function updateWords (templateInstance) {
  const instanceId = templateInstance.data.atts.id
  const state = templateInstance.state.get(instanceId)
  const { separator } = state
  const { min } = state
  const { max } = state
  const { invalid } = state

  // get all inputs to run validation checks for all words
  const $inputs = templateInstance.$('.afPasswordmix-inputField')
  const words = []
  words.length = $inputs.length

  let allChecksPassed = true
  $inputs.each(function (index, value) {
    const $current = templateInstance.$(value)
    const currentWord = $current.val() || ''

    // check min if present
    // check max if present
    // check regExp if present
    // check whitespace if present
    // (i.e. when whitespace has been pasted)
    if (min && currentWord.length < min) {
      allChecksPassed = false
      if (invalid) assignError($current)
    } else if (max && currentWord.length > max) {
      allChecksPassed = false
      if (invalid) assignError($current)
    } else {
      if (invalid) {
        clearError($current)
      }
    }

    words[ index ] = currentWord
  })

  // If all inputs have passed min / max / regExp / whiteSpace checks
  // we can safely update the hidden input. Otherwise we flush it, so
  // we can ensure, that the internal validation is "passed on" to
  // the overall form validation.
  const finalWords = allChecksPassed ? words.join(separator || '') : ''
  templateInstance.$('.afPasswordmix-hiddenInput').val(finalWords)
}