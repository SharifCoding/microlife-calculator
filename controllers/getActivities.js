const fs = require('fs');
const path = require('path');

const getActivities = (req, res) => {
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    // throw an error if there is one
    if (readError) throw readError;

    // parse file contents to a JavaScript object representing the user
    const user = JSON.parse(userJson);

    res.status(200).send(user.profile.activities);
  });
};

module.exports = getActivities;
