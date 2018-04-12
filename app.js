// IMPORT LIBRARY
const express = require('express');
const createActivity = require('./controllers/createActivity');
const getActivities = require('./controllers/getActivities');

// INSTANTIATE APP
const app = express();

// POST ROUTE
app.post('/profile/activities', createActivity);

// GET ROUTE
app.get('/profile/activities', getActivities);

// FIRES UP WEB SERVER
app.listen(3000, () => console.log('Example app listening on port 3000!'));
