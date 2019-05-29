# Meteor Autoform Passwordmix

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

Check out the [DEMO](https://jankapunkt.github.io/meteor-autoform-passwordmix/)!

Configurable extension to provide a password input that consists of a mix of random words.

Instead of forcing users to enter complex password pattern you can now provide an input for multiple words, which increases password length and uniqueness.

## Requirements and installation

This extension requires AutoForm >= 6. It works out-of-the box with Bootstrap 3 and requires no further action to also display correct using [Bootstrap 4](https://github.com/imajus/autoform-bootstrap4). To install the component add it via  

```bash
$ meteor add jkuester:autoform-passwordmix
```

## Configuration and usage

The extensions provides configration for 

* Show characters instead password dots (default: off) 
* Number of words required (default 3)
* Min/Max length for each word required (default min. 4 / max. 20)
* Insert a separator character bewteen each word (default none)
* RegExp pattern for each word (default enable all)
* Whitespace prevention enabled/disabled (default off)
* Allow or prevent paste on the inputs (default enabled)
* Enable / disable `autocomplete` (default disabled)
* Autojumping to next input on typing / to previous input on backspace (default off) (**tbd**)

A full example would therefore look like the following:

```javascript
{
  password: {
    type: String,
    autoform: {
      type: 'passwordmix',
      words: 3,
      min: 4,
      max: 20,
      regExp: '[a-z0-9A-Z]+',
      separator: '-',
      whitespace: true,
      jump: true,
      show: true,
      paste: true,
      autocomplete: true
    }
  }
}
```

Note that when using `separator` (example `-`) the password will be like the following pattern `words-with-separator` and you have to provide input forms with the same separator, too.

However, the more powerful feature of the separator is to split the the password by the given char into an array and send the word array to the server, which can use it's own separator to build the "real" passwords for creating accounts or logging in.

This feature is introduced to avoid this extension to be focused around an array of words but keeping it as simple and low-throwshold as possible.

## Run the examples

To run the examples locally, clone this project and cd into the `example` folder and use the npm sript to start:

```bash
$ git clone git@github.com:jankapunkt/meteor-autoform-passwordmix.git
$ cd example
$ meteor npm run start
```

If you don't use the start script it won't use your latest changes of the `packages` folder.
/***
## License

MIT
