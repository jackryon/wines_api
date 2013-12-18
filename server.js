var express = require('express');
var wines = require('./resources/wines');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/wines', wines.index);
app.post('/wines', wines.create);
app.get('/wines/:id', wines.read);
app.put('/wines/:id', wines.update);
app.delete('/wines/:id', wines.delete);


app.listen(3000);
console.log('App listening on port 3000');