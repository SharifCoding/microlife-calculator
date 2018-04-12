/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');

const getActivities = require('../controllers/getActivities');

describe('getActivities', () => {
  it('gets a list of the users activities', (done) => {
    // testing two assertion
    expect.assertions(2);
    // use path.join to get location of filename
    const filePath = path.join(__dirname, '../controllers', 'user.json');

    // adding in some activities to user object
    const user = {
      profile: {
        activities: [{
          activityId: 'short-walk',
          quantity: 1,
        }, {
          activityId: 'red-meat',
          quantity: 2,
        }],
      },
    };

    // convert file contents to JSON string
    fs.writeFile(filePath, JSON.stringify(user), () => {
      // mock a request object
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/profile/activities',
      });
      // mock a response object
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // pass request/response objects into controller
      getActivities(request, response);

      // listen out for end event that listen for `on` event
      response.on('end', () => {
        expect(response.statusCode).toEqual(200);
        expect(response._getData()).toEqual(user.profile.activities);
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
