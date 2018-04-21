/* eslint prefer-destructuring: 0 no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');

const updateActivity = (req, res) => {
  const profileActivityId = req.params.profileActivityId;
  // `fs.readFile` to retrieve the contents of `user.json`
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    // convert contents of `user.json` to a JS object and assign to `user`
    const user = JSON.parse(userJson);
    const userActivities = user.profile.activities;
    // find an object in the `activities` array with a matching `_id`
    const matchingActivity = userActivities.find(activity => activity._id === profileActivityId);

    matchingActivity.quantity = req.body.quantity;

    // fs.writeFile takes two arguments: the file path; and a callback function;
    fs.writeFile(filePath, JSON.stringify(user), (writeError) => {
      if (writeError) throw writeError;

      res.status(200).send({ success: true });
    });
  });
};

module.exports = updateActivity;
