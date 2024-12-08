module.exports = function (app, router) {
  app.use('/api', require('./profiles.js')(router));
};
