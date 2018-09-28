var npm = require('npm');
npm.load(function(err) {
  // handle errors

  // install modules
  npm.commands.install(['botkit'], function(er, data) {
    // log errors or data
    console.log("Error while installing BOTKIT:",er);
  });
  npm.commands.install(['request'], function(er, data) {
    console.log("Error while installing REQUEST:",er);
    // log errors or data
  });

npm.commands.install(['nodemailer'], function(er, data) {
    console.log("Error while installing NODEMAILER:",er);
    // log errors or data
  });

  npm.on('log', function(message) {
    // log installation progress
    console.log(message);
  });
});