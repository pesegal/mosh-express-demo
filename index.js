const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json()); //adding a piece of middleware.

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
    // Joi schema
    const schema = {
        name: Joi.string().min(3).required()
    };

    // Use Joi to validate input.
    const result = Joi.validate(req.body, schema);
    console.log(result);


    // Instead of writing input validation you can use a package.
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course); // We should return the object to the client so the client knows what the ID is.

});

// Example of using uri params to return data
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given id was not found.') // 404
    else res.send(course);
});


// PORT read from environment variable otherwise use default value.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port};`));
