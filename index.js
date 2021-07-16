require('dotenv').config();
let bodyParser = require('body-parser');
const colors = require('colors'); 
const express = require('express'); 
const app = express(); 
const port = 8000; 
const CampGround = require('./models/campground');
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection being made!'); 
});


app.set('view engine', 'ejs');
// app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); 


// ROUTES
app.get('/', async(req, res) => {
  res.redirect('/campgrounds'); 
})

app.get('/campgrounds', async(req, res) => {
    let Campgrounds = await CampGround.find().sort({createdAt: 1});
    res.render('index', {Campgrounds}); 
  });


app.get('/campgrounds/new', (req, res) => {
    res.render('newCampground'); 
})

app.post('/campgrounds', async (req, res) => {
  console.log(colors.red(req.body.campground)); 
      let newCampground = await new CampGround(req.body.campground); 
          await newCampground.save().then(response => console.log(response)); 

      res.send(req.body); 
  });

app.get('/campgrounds/:id', async(req, res) => {
let Campground = await CampGround.findById(req.params.id);  
res.render('detail', {Campground}); 
}); 

app.listen(port, () => {
console.log(colors.rainbow(`Example app listening at http://localhost:${port}`)
)});