module.exports = {
   "type": "mysql",
   // "host": "casting-dev.c4vmivapzauk.eu-central-1.rds.amazonaws.com",
   // "port": 3306,
   // "username": "admin",
   // "password": "Gs1tf3Raah35tBW7r3Iq",
   // "database": "casting_dev",
//

   "host": "localhost",
   "port": 3306,
   "username": "root",
   "password": "tonitonitoni",
   // "password": "123456",
   "database": "casting_dev",

   "synchronize": true,
   "logging": true,
   "cache" : true,
   "charset": "UTF8MB4_GENERAL_CI",
   "entities": [
      // for dev i'll use src folder , in prod i'll user dist folder , it 'll be set as DB_Dir in package.json
      `${__dirname}/${process.env.DB_Dir}/models/*.{ts,js}`,
      // `${__dirname}/src/models/newModels/*.{ts,js}`,

   ],
   "migrations": [
      "src/migration/**/*.js"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/models",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
