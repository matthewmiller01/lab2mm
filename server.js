const express = require('express');
const path = require('path');
require('cross-fetch/polyfill');
//using body-parser express package downloaded from online for form submission
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const host = '127.0.0.1';
const port = 3000;

app.set('view engine', 'ejs');
// all templates will be saved in directory views
app.set('views', path.join(__dirname, 'views'));
//provided by Harvard Art Museums
const API_KEY = '6a6275c0-b77e-11e8-a4d1-69890776a30b';

// behavior for the index route
app.get('/', (req, res) => {
  const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    //displays all galleries with HTML from index template
    res.render('index', {galleries: data.records});
  });
});
//uses the id number of the gallery to get the specific objects within it
app.get('/gallery/:gallery_id', function(req, res) {
  const ids = `https://api.harvardartmuseums.org/object?gallery=${req.params.gallery_id}&apikey=${API_KEY}`;
  fetch(ids)
  .then(response => response.json())
  .then(data => {
    //refers to the gallery template where we have HTML to list individual objects
    res.render('gallery', {objects: data.records});
  })
});

//an overall JavaScript object containing all comments as dictionaries with their text and an id number
let comments = [];
//gets page for the individual object based on its ID number
app.get('/object/:object_id', function(req, res){
  const ids = `https://api.harvardartmuseums.org/object/${req.params.object_id}?apikey=${API_KEY}`;
  fetch(ids)
  .then(response => response.json())
  .then(data =>{
    //JavaScript object that will contain comments pertaining to this individual object
    let objectcomms = [];
    //loops through all comments and checks if a given comment matches the ID of this object
    comments.forEach(comment =>{
    if (comment.id == req.params.object_id)
      {
          //adds it to the list of comments for this object to be displayed
          objectcomms.push(comment.text)
        }
    })
    //creates overall string of all comments to pass in to the template rather than a javascript object
    let commentString = "";
    //numbers the comments
    let commNumber = 1;
    objectcomms.forEach(comment =>{
      commentString += "\n" + commNumber + ". ";
      //converts the comment to a string to add to the overall list
      commentString+= " " + comment.toString() + " ";
      commNumber++;
    })
    //renders template for the individual object with all relevant variables passed in
    res.render('object', {title: data.title, description: data.description, accessionyear: data.accessionyear, primaryimageurl : data.primaryimageurl, commentString: commentString, provenance: data.provenance, object_id : data.id});
   })
});
//when form submitted, this handles the post request by adding the comment to list using body-parser
app.post('/commenthandler/:object_id', function(req, res){
  //adds the comment and its object ID to the overall list of comments
  comments.push({text: req.body.comment, id: req.params.object_id});
  //creates and concatenates a string for the redirect URL to go back to object page
  let address = '/object/';
  address+= req.params.object_id;
  //redirects to page for the individual object after adding comment for it
  res.redirect(address);
})

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}/`);
});
