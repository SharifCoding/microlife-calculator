/* eslint prefer-destructuring: 0 no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');

const getActivities = (req, res) => {
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    // throw an error if there is one
    if (readError) throw readError;

    // parse file contents to a JavaScript object representing the user
    const user = JSON.parse(userJson);

    const activities = user.profile.activities;
    const profileActivityId = req.params.profileActivityId;

    if (profileActivityId) {
      // find an object in the `activities` array with a matching `_id`
      const profileActivity = activities.find(activity => activity._id === profileActivityId);
      // and return a `res.send` with the object
      return res.status(200).send(profileActivity);
    }
    return res.status(200).send(activities);
  });
};

module.exports = getActivities;
