/* eslint prefer-destructuring: 0 no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');

const getAdjustment = (req, res) => {
  // `fs.readFile` to retrieve the contents of `user.json`
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    if (readError) throw readError;

    // `fs.readFile` again to retreive the contents of `activities.json`
    const activitiesJsonPath = path.join(__dirname, 'activities.json');

    fs.readFile(activitiesJsonPath, 'utf8', (activitiesErr, activitiesJson) => {
      if (activitiesErr) throw activitiesErr;

      // convert contents of `user.json` to a JS object and assign to `user`
      const user = JSON.parse(userJson);
      // convert contents of `activities.json` to a JS object and assign to `activities`
      const activities = JSON.parse(activitiesJson).activities;

      // map() method creates a new array with the returned results
      const profileActivities = user.profile.activities.map((profileActivity) => {
        const getActivityById = activity => activity._id === profileActivity.activityId;
        // find() to find an object from `activities._id` equal to a user `activityId` field
        const matchingActivity = activities.find(getActivityById);

        // use `Object.assign()` to merge the found object into your user activity object
        return Object.assign(matchingActivity, profileActivity);
      });
      // array returned by the `map`, `reduce()` to total the `effect` field (our adjustment)
      const totalAdjustment = (total, activity) => total + (activity.effect * activity.quantity);
      // `reduce` assigned to a variable to reduce the line length to under 100 characters
      const adjustment = profileActivities.reduce(totalAdjustment, 0);

      res.status(200).send({ dayTotal: 48 + adjustment });
    });
  });
};

module.exports = getAdjustment;
