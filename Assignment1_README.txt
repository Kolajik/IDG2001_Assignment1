App URL:
  - https://cloudtechunknown.herokuapp.com/assignment1

Available APIs:
  - POST createUserAccount
    - <domain name of our site>/assignment1/createUserAccount/:fname/:lname/:dateOfBirth/:city
    - Creates a user account. Based on all parameters a sha256 hash is calculated
      and serves as a personal number. Account number is a random number from 1,000,000 to 9,999,999.
  - GET getAccount
    - <domain name of our site>/assignment1/getAccount/:fname/:lname/:dateOfBirth/:city
    - Searches for user's account number based on input parameters.
      Response also contains a personal number of the user for further use.
  - DELETE deleteAccountById
    - <domain name of our site>/assignment1/deleteAccountById/:person_num
    - Deletes user account from database.
  - GET allPersonNums
    - <domain name of our site>/assignment1/allPersonNums
    - Gets all personal numbers of all users in DB for further use.
      Technical API. Not meant to be used in production.
  - PUT updateAccount
    - <domain name of our site>/assignment1/updateAccount/:person_num/:lname
    - Updates a last name of client's account based on personal number.
      FYI: Does not update the hash (personal number) of a client. There is a possibility that
      more users can co-exist with such first/last name, city and birthDate in DB.
      However, they will have a different personal number.

Objects' structure in MongoDB:
  {
    "_id": ObjectId
    "personal_number": person_num,            (text)
    "account_number": account_number,         (number)
    "first_name": firstName,                  (text)
    "last_name": lastName,                    (text)
    "date_of_birth": dateOfBirthUnix,         (Date)
    "city": city,                             (text)
    "creation_date": Date.now()               (double) - Unix time
  }
