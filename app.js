// IMPORT LIBRARY
const express = require('express');
const createActivity = require('./controllers/createActivity');
const getActivities = require('./controllers/getActivities');
const getAdjustment = require('./controllers/getAdjustment');

// INSTANTIATE APP
const app = express();

// POST ROUTE
app.post('/profile/activities', createActivity);

// GET ROUTE
app.get('/profile/activities', getActivities);

// GET ROUTE
app.get('/profile/adjustment', getAdjustment);

// FIRES UP WEB SERVER
app.listen(3000, () => console.log('Example app listening on port 3000!'));
