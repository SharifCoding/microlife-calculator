/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');

const createActivity = require('../controllers/createActivity');

// override return value of uuid module with 'abc123'
jest.mock('uuid/v5', () => jest.fn(() => 'abc123'));

describe('createActivity', () => {
  it('adds an activity to the profile', (done) => {
    // testing two assertion
    expect.assertions(2);

    // mock a request object
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/profile/activities',
      body: {
        activityId: 'short-walk',
        quantity: 1,
      },
    });

    // mock a response object
    const response = httpMocks.createResponse({
      // event emitter to trigger an end event
      eventEmitter: events.EventEmitter,
    });

    // pass request/response objects into controller
    createActivity(request, response);

    // listen out for end event that signals res.send
    response.on('end', () => {
      // use path.join to get location of filename
      const filePath = path.join(__dirname, '../controllers', 'user.json');

      // reads the file contents
      fs.readFile(filePath, 'utf8', (error, userJson) => {
        expect(response.statusCode).toEqual(200);

        // analysis the returned file contents to profile.activities
        const user = JSON.parse(userJson);
        const activity = Object.assign(request.body, { _id: 'abc123' });

        // toContainEqual matcher doesn't use strict equality
        // objectContaining look for object with matching key names/values
        expect(user.profile.activities).toContainEqual(expect.objectContaining(activity));

        done();
      });
    });
  });
  // file reset to its initial state prior to test
  afterEach(() => {
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    fs.writeFileSync(filePath, '{"profile" : {"activities":[]}}');
  });
});
