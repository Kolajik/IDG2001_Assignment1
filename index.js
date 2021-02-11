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
  .get('/exercise3', (req,res) => res.render('pages/exercise3'))
  .get('/exercise4', (req,res) => res.render('pages/exercise4'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req,res) => res.send(showTimes()))
  .get('/ajaxCall.txt', (req, res) => res.sendFile(path.join(__dirname + '/views/pages/resources/ajaxCall.txt')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for(i=0; i < times; i++) {
    result += i + ' '
  }
  return result
}