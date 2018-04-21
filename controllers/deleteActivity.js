/* eslint prefer-destructuring: 0 no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');

const deleteActivity = (req, res) => {
  // request URL route will look like: /profile/activites/:profileActivityId
  const profileActivityId = req.params.profileActivityId;
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    // parse file contents to a JavaScript object representing the user
    const user = JSON.parse(userJson);
    const userActivities = user.profile.activities;
    // find an object in the `activities` array with a matching `_id`
    const matchingActivity = userActivities.find(activity => activity._id === profileActivityId);
    const matchingActivityIndex = userActivities.indexOf(matchingActivity);

    // splice() changes the contents of an array by removing existing elements
    userActivities.splice(matchingActivityIndex, 1);

    fs.writeFile(filePath, JSON.stringify(user), (writeError) => {
      if (writeError) throw writeError;

      res.send({ success: true });
    });
  });
};

module.exports = deleteActivity;
