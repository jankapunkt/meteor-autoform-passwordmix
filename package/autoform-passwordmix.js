/* global AutoForm */
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
    const { words } = atts
    const { jump } = atts
    const { whitespace } = atts
    const { regExp } = atts
    const { separator } = atts
    const { inputClass } = atts
    const paste = atts.paste || false
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
    instance.state.set(atts.id, { words, inputAtts, jump, whitespace, regExp, iterator, separator, invalid, paste })
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
  'blur .afPasswordmix-inputField' (event, templateInstance) {
    const instanceId = templateInstance.data.atts.id
    const state = templateInstance.state.get(instanceId)
    const { separator } = state
    const { min } = state
    const { max } = state
    const { whitespace } = state
    const regExp = state.regExp && new RegExp(state.regExp)

    // get all inputs to run validation checks for all words
    const $current = templateInstance.$(event.currentTarget)
    const $inputs = templateInstance.$('.afPasswordmix-inputField')
    const words = []
    words.length = $inputs.length

    let allChecksPassed = true
    $inputs.each(function (index, value) {
      // TODO check if $.each cann be aborted like using break
      // TODO for example using the Array.every method
      if (!allChecksPassed) return
      const $target = templateInstance.$(value)
      const currentWord = $target.val() || ''

      // check min if present
      // check max if present
      // check regExp if present
      // check whitespace if present
      // (i.e. when whitespace has been pasted)
      if (min && currentWord.length < min) {
        allChecksPassed = false
        return assignError($current)
      }
      if (max && currentWord.length > max) {
        allChecksPassed = false
        return assignError($current)
      }
      if (regExp && !regExp.test(currentWord)) {
        allChecksPassed = false
        return assignError($current)
      }
      if (whiteSpaceRegExp.test(currentWord)) {
        allChecksPassed = false
        return assignError($current)
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
})

function assignError ($target) {
  $target.addClass('border border-danger')
}

function updateWords ($targets, words, templateInstance) {

}