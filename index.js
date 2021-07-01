const express = require('express'); 
const app = express(); 
const port = 8000; 
const CampGround = require('./models/campground');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection being made!'); 
});



app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index')
  })

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})