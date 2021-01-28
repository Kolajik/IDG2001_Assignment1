var ex2 = require('./exercise2.js');

const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/exercise2', (req,res) => res.render('pages/exercise2'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req,res) => res.send(showTimes()))
  .get('/fibNumFun', (req,res) => res.send(ex2.fibonacciNumFunction(10)))
  .get('/fibNumRec', (req,res) => res.send(ex2.fibonacciNumRecursive(10)) + ", ")
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for(i=0; i < times; i++) {
    result += i + ' '
  }
  return result
}