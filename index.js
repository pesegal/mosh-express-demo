// Debugger
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
// ..
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const Joi = require('joi');
const helmet = require('helmet');
const logger = require('./logger');
const auth = require('./auth');
const courses = require('./routes/courses');
const app = express();

// Which environment the code is running in
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
// You can also get the env from app if NODE_ENV undefined then it defaults to 'development'
console.log(`env: ${app.get('env')}`)

// Registering the templeting engine with express.
app.set('view engine', 'pug');
app.set('views', './views'); // This is default location and this line is not required unless diff loc.

// MIDDLEWARE
app.use(helmet()) // Used to validate HTTP headers (best practice)
app.use(express.json()); //adding a piece of middleware.
app.use(express.urlencoded({ extended: true })); //extended allows us to parse arrays and such
app.use(express.static('public')); //extended allows us to parse arrays and such
// Custom Middleware
app.use(logger) 
app.use(auth)

// Linking in Routes
app.use('/api/courses', courses);

// Environment configuration dependent packages
console.log('My Application Name: ' + config.get('name'));
console.log('Mail Server Host: ' + config.get('mail.host'));
console.log('App Password: ' + config.get('mail.password' || 'No ENV Pass Set'));

// Environment dependent middleware.
if (app.get('env') === 'development') {
    // HTTP Request Logger
    app.use(morgan('dev'));
    startupDebugger('Morgan enabled.');
}

// DB WORK debug example
dbDebugger('DB WORK');

// Render HTML template
app.get('/', (req, res) => {
    res.render('index', {
        title: 'My Express App',
        message: 'Hello'
    });
});

// PORT read from environment variable otherwise use default value.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port};`));
