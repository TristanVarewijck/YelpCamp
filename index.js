require('dotenv').config();
let bodyParser = require('body-parser');
let morgan = require('morgan')
const colors = require('colors'); 
const express = require('express');
let methodOverride = require('method-override'); 
const app = express(); 
const port = 8000; 
const CampGround = require('./models/campground');
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection being made!'); 
});

app.set('view engine', 'ejs');
morgan('tiny');


app.use(express.static('public'), (express.urlencoded({extended: true})));
// app.use(morgan('tiny'))

// EXPRESS MIDDLEWARE TEMPLATE
  // app.use((req, res, next) => ){
    // YOUR CODE
  // });
  
  // MIDDLE WARE FOR A SPECIFIC ROUTE
// app.use('/ROUTE', (req, res , next) => {
    // YOUR CODE 
// })

// PACKAGES 
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

// HANDWRITTEN
app.use((req, res, next) => {
  console.log('LOGGED');
  next();
}); 

app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(req.requestTime)
  next(); 
})

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
  let newCampground = await new CampGround(req.body.campground); 
      await newCampground.save().then(response => console.log(colors.green(response + '--- ' + 'NEW'))); 

  res.redirect(`/campgrounds/${newCampground._id}`); 
  });

app.get('/campgrounds/:id', async(req, res) => {
  let Campground = await CampGround.findById(req.params.id);  
  res.render('detail', { Campground }); 
});

app.get('/campgrounds/:id/update', async(req, res) => {
  let Campground = await CampGround.findById(req.params.id);
  res.render('updateCampground', { Campground }); 
})

app.put('/campgrounds/:id/update', async(req, res) => {
  const { id } = req.params;
  let Campground = await CampGround.findById(id);
  await CampGround.findByIdAndUpdate(id, (req.body.campground)).then(response => console.log(colors.orange(response + '--- ' + 'UPDATE')));
  res.redirect(`/campgrounds/${Campground._id}`); 
})

app.delete('/campgrounds/:id', async(req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id).then(response => console.log(colors.red(response + '--- ' + 'DELETED'))); 
  res.redirect(`/campgrounds`); 
})

app.use((req, res) => {
  res.status(404).send('404 not found..'); 
})

app.listen(port, () => {
console.log(colors.rainbow(`Example app listening at http://localhost:${port}`)
)});