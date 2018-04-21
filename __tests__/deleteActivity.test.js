/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');

const deleteActivity = require('../controllers/deleteActivity');

describe('deleteActivity', () => {
  it('deleting an activity from a user', (done) => {
  // testing at least two assertion
    expect.assertions(2);
    // use path.join to get location of filename
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    // adding in some activities to user object
    const user = {
      profile: {
        activities: [{
          _id: 'abc123',
          activityId: 'walk',
          quantity: 1,
        }, {
          _id: 'def456',
          activityId: 'meat',
          quantity: 2,
        }],
      },
    };
    // convert file contents to JSON string
    fs.writeFile(filePath, JSON.stringify(user), () => {
    // mock a request object
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/profile/activities/def456',
        params: {
          profileActivityId: 'def456',
        },
      });
      // mock a response object
      const response = httpMocks.createResponse({
      // event emitter to trigger an end event
        eventEmitter: events.EventEmitter,
      });

      // pass request/response objects into controller
      deleteActivity(request, response);

      // listen out for end event that signals res.send
      response.on('end', () => {
      // gives us information about a file
        fs.readFile(filePath, 'utf8', (error, userJson) => {
          expect(response.statusCode).toEqual(200);

          const updatedUser = JSON.parse(userJson);
          const updatedActivities = updatedUser.profile.activities;

          const deletedActivity = user.profile.activities[1];
          expect(updatedActivities).not.toContainEqual(expect.objectContaining(deletedActivity));

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
