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

app.get('/', async(req, res) => {
  res.redirect('/campgrounds'); 
})

app.get('/campgrounds', async(req, res) => {
    let items = await CampGround.find().sort({createdAt: 1});
    res.render('index', {items}); 
  });

app.get('/campgrounds/:id', async(req, res) => {
let { id } = req.params;
let item = await CampGround.findById({_id: id}); 
console.log(item); 
res.render('detail', {item}); 
}); 





app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})