/* eslint prefer-destructuring: 0 no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');

const getActivities = (req, res) => {
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    if (readError) throw readError;

    const user = JSON.parse(userJson);
    const activities = user.profile.activities;
    const profileActivityId = req.params.profileActivityId;

    if (profileActivityId) {
      const profileActivity = activities.find(activity => activity._id === profileActivityId);
      return res.status(200).send(profileActivity);
    }
    return res.status(200).send(activities);
  });
};

module.exports = getActivities;
