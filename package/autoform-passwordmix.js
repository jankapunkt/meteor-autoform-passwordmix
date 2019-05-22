/* global AutoForm */
import { Template } from 'meteor/templating'

AutoForm.addInputType('tags', {
  template: 'afPasswordmix',
  valueOut () {
    const val = this.val()
    return val && val.join()
  },
  valueIn (initialValue) {
    return initialValue
  }
})

Template.afPasswordmix.onCreated(function () {
  const instance = this


  instance.autorun(() => {
    const data = Template.currentData()
    const { atts } = data

    console.log(data)
  })
})

Template.afPasswordmix.helpers({

})

Template.afPasswordmix.events({

})
