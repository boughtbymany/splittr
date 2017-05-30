# Splittr

Useful utility to split strings whitin HTML inputs based on a given pattern

##### Usage:

```javascript
new Splittr({
    'input': inputElement                 // input -> Node element
    'delimiter': '-',                     // desired separator (can be anything)
    'pattern': 'nnn-nnn-nnn',             // your pattern (include delimiter as well)
    'errCallback': errorCallbackFunction  // provide an error handling function
})
```

<br>

**Patterns (nn-nn-nn)**

A pattern consists of two parts: **validation rule** and the **separator** (added automatically while typing)

##### Validation rules:
* **n** - numbers only
* **L** - uppercase letters only
* **l** - lowercase letters only
* **w** - symbols only

*Validation rules can be combined in any order or group size:*

	nn-LLLL-w-www  (possible valid input 12-ABCD-!-.?#)
	LnL-lwn-nn-wL  (possible valid input A1B-a$2-34-&C)

##### Separator:
* can be anything ("&" - nnn&nnn&nnn, or "-" nnn-n-nnn, etc.)


##### Development Setup

```
# install dependencies
$ npm install

# dev mode
$ npm start

# test
$ npm run test

# build
$ npm run build
```
