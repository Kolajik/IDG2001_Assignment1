const cool = require('cool-ascii-faces')
// const { performance } = require('perf_hooks')
const express = require('express')
const fs = require('fs')
const path = require('path')
const sha256 = require('js-sha256')
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

    // await listDatabases(mongodbClient);
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
  .post('/assignment1/createUserAccount/:fname/:lname/:dateOfBirth/:city', async (req, res) => {
    const response = await createListings(mongodbClient, req.params.fname, req.params.lname, req.params.dateOfBirth, req.params.city);
    // console.log(response);
    res.setHeader('content-type', 'application/json');
    res.end(response.message);
  })
  .get('/assignment1/getAccount/:fname/:lname/:dateOfBirth/:city', async (req, res) => {
    const response = await findListingsByName(mongodbClient, req.params.fname, req.params.lname, req.params.dateOfBirth, req.params.city);
    // console.log(response);
    res.setHeader('content-type', 'application/json');
    res.end(response.message);
  })
  .delete('/assignment1/deleteAccountById/:person_num', async (req,res) => {
    const response = await deleteListings(mongodbClient, req.params.person_num);
    // console.log(response);
    res.setHeader('content-type', 'application/json');
    res.end(response.message);
  })
  .get('/assignment1/allPersonNums', async (req, res) => {
    const response = await seeAllPersonNums(mongodbClient);
    // console.log(response);
    res.setHeader('content-type', 'application/json');
    res.send(response);
  })
  .put('/assignment1/updateAccount/:person_num/:lname', async (req, res) => {
    const response = await updateClientsLastName(mongodbClient, req.params.person_num, req.params.lname);
    // console.log(response);
    res.setHeader('content-type', 'application/json');
    res.send(response.message);
  })
  // .get('/ajaxCall.txt', (req, res) => res.sendFile(path.join(__dirname + '/views/pages/resources/ajaxCall.txt')))
  // .get('/exercise2', (req,res) => res.render('pages/exercise2'))
  // .get('/exercise3', (req,res) => res.render('pages/exercise3'))
  // .get('/exercise4', (req,res) => res.render('pages/exercise4'))
  // .get('/cool', (req, res) => res.send(cool()))
  // .get('/times', (req,res) => res.send(showTimes()))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
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
  // performance.mark('A');
  const account_number = Math.floor(1000000 + Math.random() * 9999999);
  const person_num = sha256(firstName.toLowerCase()+lastName.toLowerCase()+dateOfBirth+city.toLowerCase());
  const dateOfBirthUnix = new Date(Date.parse(dateOfBirth))
  newListings = {
    "personal_number": person_num,
    "account_number": account_number,
    "first_name": firstName,
    "last_name": lastName,
    "date_of_birth": dateOfBirthUnix,
    "city": city,
    "creation_date": Date.now()
  }
  const finding = await client.db(DATABASE).collection(COLLECTION)
    .findOne({ personal_number: person_num})
    // Please try not to use then() here, because it will "use" finding object and it will be undefined on line 98 -> thus you can create infinite amount of same users
    // .then(() => {
       // performance.mark('B')
       // performance.measure('A to B', 'A', 'B');
    // })
    .catch(console.error);

  if (finding) {
    console.log(`User already exists.`);
    return { "message": `Client ${firstName} ${lastName} already has an account - ${finding.account_number}.` };
  }
  else {
    // performance.mark('C')
    // performance.measure('B to C', 'B', 'C');
    // const measureAB = performance.getEntriesByName('A to B')[0];
    // const measureBC = performance.getEntriesByName('B to C')[0];
    // console.log(`AB latency: ${measureAB.duration} BC latency: ${measureBC.duration}`)

    const result = client.db(DATABASE).collection(COLLECTION)
      .insertOne(newListings)
      .then(result => {
        console.log(`A new record with id ${result.insertedId} was inserted to DB ${DATABASE} and table ${COLLECTION}.`);
      })
      .catch(console.error);
    return { "message": `An account with number ${account_number} for ${firstName} ${lastName} client was created. Person id ${person_num}.` };
  }
}

async function findListingsByName(client, firstName, lastName, dateOfBirth, city) {
  const person_num = sha256(firstName.toLowerCase()+lastName.toLowerCase()+dateOfBirth+city.toLowerCase());
  query = { personal_number: person_num };
  const result = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .find(query)
    .toArray()
    .catch(console.error);

  if (result.length > 0) {
    console.log(`${result.length} record(s) exist in DB:`);
    console.log(result);
    return { "message": `Client's account number you looked for is: ${result[0].account_number}. <br>Personal number is ${result[0].personal_number}.` }
  }
  else {
    console.log("No record found in DB.");
    return { "message": `No account exists for ${firstName}/${lastName}/${dateOfBirth}/${city} combination.` }
  }
}

async function deleteListings(client, person_num) {
  query = { personal_number: person_num }
  const result = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .deleteOne(query)
    .catch(console.error);

  if (result.deletedCount > 0) {
    console.log(`${result.deletedCount} client(s) with personal number ${person_num} was/were deleted.`);
    return { "message": `${result.deletedCount} client(s) with personal number ${person_num} was/were deleted.` }
  }
  else {
    console.log(`No client with personal number ${person_num} exists in DB.`);
    return { "message": `No client with personal number ${person_num} exists in DB.` }
  }
}

async function updateClientsLastName(client, person_num, lastName) {
  const query = {personal_number: person_num}
  const update = {last_name: lastName}
  const result = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .updateOne(query, {$set: update})
    .catch(console.error);

    if (result.matchedCount > 0) {
      if (result.modifiedCount > 0) {
          console.log(`We have found ${result.matchedCount} records with such parameter. ${result.modifiedCount} - number of modified records.`);
          return {"message": `${person_num} was updated to ${lastName}.`};
      }
      else {
        console.log(`${result.modifiedCount} updated records. ${result.matchedCount} found objects in DB with such criteria.`);
        return {"message": `${result.modifiedCount} updated records. ${result.matchedCount} found objects in DB with such criteria.`};
      }
    }
    else {
      console.log(`${result.modifiedCount} updated records. ${result.matchedCount} found objects in DB with such criteria.`);
      return {"message": `${result.modifiedCount} updated records. ${result.matchedCount} found objects in DB with such criteria.`};
    }
}

async function seeAllPersonNums(client) {
  const result = await client
    .db(DATABASE)
    .collection(COLLECTION)
    .find()
    .toArray()
    .catch(console.error);

  if (result.length > 0) {
    console.log(`I have found many documents in the collection.`);
    const person_nums = []
    result.forEach(element => {
      person_nums.push(element.personal_number)
    })
    // console.log(person_nums);
    return person_nums
  }
  else {
    console.log("No record found in DB.");
    return "No record found in DB.";
  }
}
