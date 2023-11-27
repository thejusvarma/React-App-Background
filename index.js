const connectToMongo = require("./db");
const express = require('express')
const app = express()
const port = 3001
const session = require('express-session')

connectToMongo();

app.use(express.json())

app.use('/api/auth',require("./routes/auth"));
app.use('/api/notes',require("./routes/notes"));

// app.set('trust proxy', 1) // trust first proxy
// app.use(session({  
//   name: `daffyduck`,
//   secret: 'some-secret-example',  
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false, // This will only work if you have https enabled!
//     maxAge: 60000 // 1 min
//   } 
// }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})