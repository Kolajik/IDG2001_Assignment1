const cool = require('cool-ascii-faces')
const express = require('express')
const fs = require('fs')
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
//  .get('/students', (req, res) => res.send([{name:'student_1'}, {name:'student_2'}, {name:'student_3'}])) // http://localhost:5000/students
  .get('/students/:id',(req,res)=> res.send({id:req.params.id, name: "New_student"})) // http://localhost:5000/students/1
  // a)	Read the given users.json file and display the all users in web.
//  .get('/all_users', (req, res) => res.sendFile(path.join(__dirname + '/views/pages/resources/users.json')))
  .get('/all_users', (req, res) => fs.readFile(path.join(__dirname + '/views/pages/resources/users.json'), 'utf-8',
  function(err, data) {
    res.end(data)
  }))
  // b)	Pass the id in URL and display the corresponding user details.
  .get('/user/:id', (req, res) => fs.readFile(path.join(__dirname + '/views/pages/resources/users.json'), 'utf-8',
  function(err, data) {
    users = JSON.parse(data)
    res.end(JSON.stringify(users["user" + req.params.id]))
  }))
  // c)	Add the following details by modifying users.json file.
//  .get('/add_user')
  // d)	Delete the user id =4 by modifying users.json file.
//  .get('/delete_user')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for(i=0; i < times; i++) {
    result += i + ' '
  }
  return result
}

function getAllUsers(e) {
    console.log(e)
    fetch(e)
      .then(response => response.json())
      .then(data => {
          console.log(data);
      });
}