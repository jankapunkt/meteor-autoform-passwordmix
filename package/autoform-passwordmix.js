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

  })
})

Template.afPasswordmix.onRendered(function () {
  const instance = this
  const data = Template.currentData()
  const $hidden = instance.$(`#afPasswordmix-${instance.data.atts.id}`)
  $hidden.addClass('bg-danger')
  if (data.atts.autocomplete) {
    setTimeout(() => {
      const autocomplete = document.getElementById(`afPasswordmix-${instance.data.atts.id}`)
      const value = autocomplete.value
      if (value) {
        const { separator } = data.atts
        instance.$('.afPasswordmix-hiddenInput').val(value)
        const split = value.split(separator)
        instance.$('.afPasswordmix-inputField').each(function (index, target) {
          if (index < split.length) {
            instance.$(target).val(split[ index ])
          }
        })
      }
    }, 50)
  } else {
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
  }

  // we also want to update the internal structure
  // if we have any changes on our schema, because
  // they may affect the words, e.g. regex or schema
  instance.autorun(() => {
    const data = Template.currentData()
    if (data) {
      setTimeout(() => {
        updateWords(instance)
      }, 50)
    }
  })
})

Template.afPasswordmix.helpers({
  autocomplete () {
    const instance = Template.instance()
    const state = instance.state.get(instance.data.atts.id)
    return state && state.autocomplete
  },
  instanceId () {
    return Template.instance().data.atts.id
  },
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
    const { separator } = state
    const regExp = state.regExp && new RegExp('^' + state.regExp + '$', 'g')

    if (paste === false) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    let data = (event.originalEvent.clipboardData || window.clipboardData).getData('text')
    if (data && data.indexOf(separator)) {
      event.preventDefault()
      event.stopPropagation()
      spreadInput({ data, separator, regExp, templateInstance })
    }
    updateWords(templateInstance)
  },
  'input .afPasswordmix-inputField' (event, templateInstance) {
    const evt = event.originalEvent
    const { data } = evt
    if (data && data.length > 1) {
      const instanceId = templateInstance.data.atts.id
      const state = templateInstance.state.get(instanceId)
      const { separator } = state
      const regExp = state.regExp && new RegExp(state.regExp, 'g')
      spreadInput({ data, separator, regExp, templateInstance })
    }
    updateWords(templateInstance)
  }
})

function assignError ($target, invalid) {
  if (!invalid) return
  $target.removeClass('border-success')
  $target.addClass('border border-danger')
}

function clearError ($target, invalid) {
  if (!invalid) return
  $target.removeClass('border-danger')
}

function spreadInput ({ data, separator, regExp, templateInstance }) {
  const split = data.split(separator)
  if (split.length <= 1) return
  templateInstance.$('.afPasswordmix-inputField').each(function (index, target) {
    if (index > split.length - 1) return
    const word = split[ index ]
    const passedRegexp = regExp ? regExp.test(word) : true
    if (!passedRegexp) {
      templateInstance.$(target).val(null)
    } else {
      templateInstance.$(target).val(word)
    }
  })
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
      assignError($current, invalid)
    } else if (max && currentWord.length > max) {
      allChecksPassed = false
      assignError($current, invalid)
    } else {
      clearError($current, invalid)
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
