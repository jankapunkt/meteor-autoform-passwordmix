# meteor-autoform-passwordmix
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
* RegExp pattern for each word (default enable all)
* Insert a separator character bewteen each word (default none)
* Whitespace stripping enabled/disabled (default off)
* Autojumping to next input on typing / to previous input on backspace (default off)

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
      regExp: /^[a-z0-9A-Z_@-\\!\\?\\.]$/, // this is just an example and not a default!
      separator: '-',
    }
  }
}
```

Note that when using `separator` (example `-`) the password will be like the following pattern `words-with-separator` and you have to provide input forms with the same separator, too.

However, the more powerful feature of the separator is to split the the password by the given char into an array and send the word array to the server, which can use it's own separator to build the "real" passwords for creating accounts or logging in.

This feature is introduced to avoid this extension to be focused around an array of words but keeping it as simple and low-throwshold as possible.

## License

MIT
