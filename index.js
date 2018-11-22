const express = require('express');
const morgan = require('morgan');
const Joi = require('joi');
const helmet = require('helmet');
const logger = require('./logger');
const auth = require('./auth');
const app = express();

app.use(helmet())
app.use(express.json()); //adding a piece of middleware.
app.use(express.urlencoded({ extended: true })); //extended allows us to parse arrays and such
app.use(express.static('public')); //extended allows us to parse arrays and such
// Custom Middleware
app.use(logger) 
app.use(auth)
// HTTP Request Logger
app.use(morgan('dev'));


const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course); // We should return the object to the client so the client knows what the ID is.

});

app.put('/api/courses/:id', (req, res) => {
    // Update a course a certin ID.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.'); // 404

    // example of object destructering 
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Update course
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.'); 

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

// Example of using uri params to return data
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.') // 404
    else res.send(course);
});


function validateCourse (course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    // Use Joi to validate input.    
    return Joi.validate(course, schema);
}


// PORT read from environment variable otherwise use default value.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port};`));
