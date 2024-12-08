var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  secrets = require('./config/secrets'),
  bodyParser = require('body-parser'),
  authMiddleware = require('./middleware/auth');
cors = require('cors');

var app = express();

var port = process.env.PORT || 4000;

mongoose.connect(secrets.mongo_connection, { useNewUrlParser: true });

var corsOptions = {
  origin: '*',
  methods: 'POST,GET,PUT,DELETE',
  allowedHeaders:
    'Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
};
app.use(cors(corsOptions));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(authMiddleware);

require('./routes')(app, router);

app.listen(port);
console.log('Server running on port ' + port);
