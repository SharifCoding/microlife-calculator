const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v5');

const createActivity = (req, res) => {
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    // throw an error if there is one
    if (readError) throw readError;

    // parse file contents to a JavaScript object representing the user
    const user = JSON.parse(userJson);

    const activityId = uuid();
    // `Object.assign` activity object; empty object literal, the request body, and a new object
    const activity = Object.assign({}, req.body, { _id: activityId });
    // push() method adds element to the array
    user.profile.activities.push(activity);

    // fs.writeFile takes two arguments: the file path; and a callback function;
    fs.writeFile(filePath, JSON.stringify(user), (writeError) => {
      if (writeError) throw writeError;

      res.status(200).send({ profileActivityId: activityId });
    });
  });
};

module.exports = createActivity;
