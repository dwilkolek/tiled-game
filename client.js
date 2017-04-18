const express = require('express');
var path = require('path');

const app = express();
const port = 3000

app.get('/', (request, response) => {
  // throw new Error('oops')
  response.sendFile('index.html', { root: path.join(__dirname, '') })
})

app.use('/app', express.static('app'));
// app.use('/js', express.static('js'));
app.use('/assets', express.static('assets'));
app.use('/assets/map', express.static('assets/map'));

app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err)
  response.status(500).send('Something broke!')
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})