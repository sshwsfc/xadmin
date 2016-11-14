'use strict'
const CryptoJS = require('crypto-js')
const fetch = require('isomorphic-fetch')
const Mock = require('mockjs')

const headers = () => {
  let now = Date.now()
  let appKey = CryptoJS.SHA1('A6902408240122UZ5509984D-0109-C69E-FBC2-BE7885A75CE8UZ' + now) + '.' + now

  return {
    'Content-Type': 'application/json',
    'X-APICloud-AppId': 'A6902408240122',
    'X-APICloud-AppKey': appKey
  }
}

const save = (data, index) => {
  fetch('https://d.apicloud.com/mcm/api/review', {
    'method': 'POST',
    'body': JSON.stringify(data),
    'headers': headers()
  }).then((res)=>{
    console.log(index)
  })
}

for (let i = 200; i >= 0; i--) {
  save(Mock.mock({
    'document': /1_1524-[A-Z]{3}16[1-9]{4}_1ENG/,
    'version': /P[A-H]/,
    'reviewer': '@first',
    'active|1-49': false, 
    //'content': '@sentence(9,15)',
    'create_time': '@now(yyyy-MM-dd HH:mm:ss)'
  }), i)
}
