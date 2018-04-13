/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');

const getAdjustment = require('../controllers/getAdjustment');

describe('getAdjustment', () => {
  // use path.join to get location of filename
  const filePath = path.join(__dirname, '../controllers', 'user.json');

  it('gets the users microlife adjustment for the day', (done) => {
    expect.assertions(2);
    // adding in some activities to user object
    const user = {
      profile: {
        activities: [{
          activityId: 'walk',
          quantity: 1,
        }, {
          activityId: 'meat',
          quantity: 2,
        }, {
          activityId: 'tv',
          quantity: 1,
        }],
      },
    };

    // convert file contents to JSON string
    fs.writeFile(filePath, JSON.stringify(user), () => {
      // mock a request object
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/profile/adjustment',
      });
      // mock a response object
      const response = httpMocks.createResponse({
        // event emitter to trigger an end event
        eventEmitter: events.EventEmitter,
      });
      // pass request/response objects into controller
      getAdjustment(request, response);

      // listen out for end event that listen for `on` event
      response.on('end', () => {
        expect(response.statusCode).toEqual(200);
        expect(response._getData()).toEqual({ dayTotal: 47 });
        done();
      });
    });
  });
  // file reset to its initial state prior to test
  afterEach(() => {
    fs.writeFileSync(filePath, '{"profile" : {"activities":[]}}');
  });
});
