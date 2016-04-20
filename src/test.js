var CryptoJS = require('crypto-js')
var fetch = require('isomorphic-fetch')
var random = require('random-name')

var headers = function() {
  var now = Date.now()
  var appKey = CryptoJS.SHA1('A6902408240122UZ5509984D-0109-C69E-FBC2-BE7885A75CE8UZ' + now) + '.' + now

  return {
    'Content-Type': 'application/json',
    'X-APICloud-AppId': 'A6902408240122',
    'X-APICloud-AppKey': appKey
  }
}

var save = function(data, index) {
  fetch('https://d.apicloud.com/mcm/api/car', {
    'method': 'POST',
    'body': JSON.stringify(data),
    'headers': headers()
  }).then((res)=>{
    console.log(index)
  })
}

for (var i = 200; i >= 0; i--) {
  save({
    'name': random.first(),
    'brand': ['bmw', 'benz', 'audi'][i%3],
    'color': ['red', 'blank', 'white', 'blue', 'gray'][i%5]
  }, i)
}