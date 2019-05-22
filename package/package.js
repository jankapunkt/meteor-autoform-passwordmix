/* eslint-env meteor */
Package.describe({
  name: 'jkuester:autoform-passwordmix',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'Configurable extension to provide a password input that consists of a mix of random words.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jankapunkt/meteor-autoform-passwordmix.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: '../README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.6')
  api.use([
    'ecmascript',
    'reactive-dict',
    'templating@1.3.2',
    'aldeed:autoform@6.0.0'
  ])
  api.addFiles([
    'autoform-passwordmix.html',
    'autoform-passwordmix.js'
  ], 'client')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('templating')
  api.use('blaze')
  api.use('meteortesting:mocha')
  api.use('practicalmeteor:chai')
  api.use('jkuester:autoform-passwordmix')
  api.mainModule('autoform-passwordmix-tests.js')
})
