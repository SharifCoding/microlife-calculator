// IMPORT LIBRARY
const express = require('express');
const createActivity = require('./controllers/createActivity');
const getActivities = require('./controllers/getActivities');
const getAdjustment = require('./controllers/getAdjustment');
const updateActivity = require('./controllers/updateActivity');
const deleteActivity = require('./controllers/deleteActivity');

// INSTANTIATE APP
const app = express();

// POST ROUTE
app.post('/profile/activities', createActivity);

// GET ROUTE
app.get('/profile/activities', getActivities);

// GET ROUTE
app.get('/profile/adjustment', getAdjustment);

// PUT ROUTE
app.put('/profile/activites/:profileActivityId', updateActivity);

// DELETE ROUTE
app.delete('/profile/activities/:profileActivityId', deleteActivity);

// FIRES UP WEB SERVER
app.listen(3000, () => console.log('Example app listening on port 3000!'));
