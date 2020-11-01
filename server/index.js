const express = require('express');
const app = express();
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/db');
const session = require('express-session')

app.use(session({
  secret: process.env.SESSION_SECRET || 'an insecure secret',
  resave: false,
  saveUninitialized: false
}));

app.use(volleyball)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.use('/api', require('./api'))

app.use(express.static(path.join(__dirname, "..", "public")));

// app.use('*', (req, res, next) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'))
// });

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});


const init = async () => {
  await db.sync({force:true})
  console.log('Database synced!')

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

init()
