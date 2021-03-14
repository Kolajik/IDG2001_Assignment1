const cool = require('cool-ascii-faces')
const express = require('express')
const fs = require('fs')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT || 5001
mainApp = express()

// Database definition and connection
const DATABASE = "Assignment1DB"
const COLLECTION = "Collection1"
const uri = "mongodb+srv://daviko:IholEApp5eOp*a@assignment1cluster0.ipbog.mongodb.net/Assignment1DB?retryWrites=true&w=majority";
const mongodbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function runDB() {
  try {
    await mongodbClient.connect();

    console.log("Connection to DB was successful.");

    await listDatabases(mongodbClient);
    // await createListings(mongodbClient, "Antonin", "AC", Date.parse("1990-09-15"), "Manilla");
    // await findListingsByName(mongodbClient, "Antonin");
    // await deleteListings(mongodbClient, "Antonin", "AC", "Manilla");
    // await findListingsByName(mongodbClient, "Antonin");
  } finally {
    // await mongodbClient.close();
  }
}
runDB().catch(console.error);

// Main back-end of application
mainApp
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/assignment1', (req, res) => res.render('pages/assignment01'))
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
  .post('/createUserAccount/:fname/:lname/:dateOfBirth/:city', async (req, res) => {
    const response = await createListings(mongodbClient, req.params.fname, req.params.lname, req.params.dateOfBirth, req.params.city);
    console.log(response);
    res.setHeader('content-type', 'application/json');
    res.end(response.message);
  })
  // .get('/ajaxCall.txt', (req, res) => res.sendFile(path.join(__dirname + '/views/pages/resources/ajaxCall.txt')))
  // .get('/exercise2', (req,res) => res.render('pages/exercise2'))
  // .get('/exercise3', (req,res) => res.render('pages/exercise3'))
  // .get('/exercise4', (req,res) => res.render('pages/exercise4'))
  // .get('/cool', (req, res) => res.send(cool()))
  // .get('/times', (req,res) => res.send(showTimes()))
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

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases: ")
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function createListings(client, firstName, lastName, dateOfBirth, city) {
  const account_number = Math.floor(1000000 + Math.random() * 9000000);
  const person_num = Math.floor(1000000 + Math.random() * 9000000);
  newListings = {
    "personal_number": person_num,
    "account_number": account_number,
    "first_name": firstName,
    "last_name": lastName,
    "date_of_birth": dateOfBirth,
    "city": city,
    "creation_date": Date.now()
  }
  const finding = await client.db(DATABASE).collection(COLLECTION)
    .findOne({first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth, city: city})
    .catch(console.error);

  if (finding) {
    console.log(`User already exists.`);
    return {"message": `Client ${firstName} ${lastName} already has an account - ${finding.account_number}.`};
  }
  else {
    const result = client.db(DATABASE).collection(COLLECTION)
      .insertOne(newListings)
      .then(result => {
        console.log(`A new record with id ${result.insertedId} was inserted to DB ${DATABASE} and table ${COLLECTION}.`);
      })
      .catch(console.error);
      return {"message": `An account with number ${account_number} for ${firstName} ${lastName} client was created. Person id ${person_num}.`};
  }
}

async function findListingsByName(client, firstName) {
  query = {"first_name": firstName}
  const result = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .find(query)
    .toArray()
    .then(result => {
      if (result.length > 0) {
        console.log(`${result.length} record(s) exist in DB:`);
        console.log(result);
      }
      else {
        console.log("No record found in DB.");
      }
    });
}

async function deleteListings(client, firstName, lastName, city) {
  query = {
    "first_name": firstName,
    "last_name": lastName,
    "city": city
  }
  const result = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .deleteMany(query)
    .then(result => {
      console.log(`${result.deletedCount} client(s) with name ${firstName} ${lastName} was/were deleted.`);
    });
}
