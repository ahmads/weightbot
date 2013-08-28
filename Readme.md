A Node.js module and a command line utility to export `CSV` data from [weightbot.com](http://weightbot.com)

## API
example usage:
```js
var weightbot = require('weightbot')

// get the data
weightbot.getData('email@example.com', 'pa$$word', function (err, data) {

  console.log(err, data)
})
```

## Command Line

```console
$ weightbot <email> <password>
```
