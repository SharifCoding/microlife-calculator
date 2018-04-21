/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');

const updateActivity = require('../controllers/updateActivity');

describe('updateActivity', () => {
  it('updating an activity of a user', (done) => {
  // testing at least two assertion
    expect.assertions(2);
    // use path.join to get location of filename
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    // adding in some activities to user object
    const user = {
      profile: {
        activities: [{
          _id: 'abc123',
          activityId: 'short-walk',
          quantity: 1,
        }, {
          _id: 'def456',
          activityId: 'red-meat',
          quantity: 2,
        }],
      },
    };
    // convert file contents to JSON string
    fs.writeFile(filePath, JSON.stringify(user), () => {
    // mock a request object
      const request = httpMocks.createRequest({
        method: 'PUT',
        url: '/profile/activities/def456',
        params: { profileActivityId: 'def456' },
        body: { quantity: 1 },
      });
      // mock a response object
      const response = httpMocks.createResponse({
      // event emitter to trigger an end event
        eventEmitter: events.EventEmitter,
      });
      // pass request/response objects into controller
      updateActivity(request, response);

      // listen out for end event that signals res.send
      response.on('end', () => {
        fs.readFile(filePath, 'utf8', (error, userJson) => {
          expect(response.statusCode).toEqual(200);

          const updatedActivity = Object.assign({}, user.profile.activities[1], { quantity: 1 });
          const updatedUser = JSON.parse(userJson);
          const updatedUserActivities = updatedUser.profile.activities;

          expect(updatedUserActivities).toContainEqual(expect.objectContaining(updatedActivity));
          done();
        });
      });
    });
  });
  afterEach(() => {
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    fs.writeFileSync(filePath, '{"profile":{"activities":[]}}');
  });
});
