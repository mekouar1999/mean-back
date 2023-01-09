let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const users = require('./routes/users');



let assignment = require('./routes/assignments');

mongoose.Promise = global.Promise;
//mongoose.set('debug', true);


// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud
const uri = config.database;


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments");
   
   
    // console.log("at URI = " + uri);
    //console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    
  },

    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS) 
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();

}); 

    // CORS Middleware

app.use(cors()); // c mieux que le cors express , suffit juste de npm i cors et de l add comme suit 



// Pour les formulaires

// Body Parser Middleware
app.use(bodyParser.json());



// Passport Middleware

require('./config/passport')(passport);

const requirepassport = require('express-session') // npm i express-session
app.use(passport.initialize());
app.use(passport.session());




app.use('/users', users);


// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser Middleware
app.use(bodyParser.json());

// 8010 en local et le process.env pour le deploy sur HEROKU

let port = process.env.PORT || 8010;

// les routes pour les assignements

const prefix = '/api';

app.route(prefix + '/assignments')
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);


app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);





  // get page principale pour enlever le cannot get 

  app.get('/', (req, res) => {
    res.send('hello MEAN APP')
  })


  app.get('/users/register', (req, res) => {
    res.send('Users Register Route')
  })




// On démarre le serveur
app.listen(port,() =>
console.log('Serveur démarré sur http://localhost:' + port));

module.exports = app;


