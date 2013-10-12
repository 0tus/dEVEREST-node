'use strict';

var config = require('./config');

if (!config.databaseConnector)
  { throw 'Set databaseConnector field in the config'; }

var express = require('express'),
    db = require('./db/' + config.databaseConnector);

var app = express();

if (!Array.isArray(config.ressources))
  { throw 'No ressource declared in config.js'; }

// app.use(function(req, res, next) {
//   res.setHeader('Content-Type', 'application/json');
//   next();
// });

app.use(express.bodyParser());

config.ressources.forEach(function(ressource) {
  var shortPath = '/' + ressource,
      longPath = config.apiRouteNamespace ?
        '/' + config.apiRouteNamespace + shortPath : shortPath;

  // getRessource
  app.get(longPath + '/:id', function(req, res) {
    var dbRes = db.getRessource(shortPath + '/' + req.params.id);
    res.send(dbRes.statusCode, dbRes.data);
  });

  // getCollection
  app.get(longPath, function(req, res) {
    var dbRes = db.getCollection(shortPath);
    res.send(dbRes.statusCode, dbRes.data);
  });

  // createRessource
  app.post(longPath, function(req, res) {
    var dbRes = db.createRessource(shortPath, req.body);
    res.send(dbRes.statusCode, dbRes.data);
  });

  // updateRessource
  app.put(longPath + '/:id', function(req, res) {
    var dbRes = db.updateRessource(shortPath + '/' + req.params.id, req.body);
    res.send(dbRes.statusCode, '');
  });

  // resetCollection
  app.delete(longPath, function(req, res) {
    var dbRes = db.resetCollection(shortPath);
    res.send(dbRes.statusCode, '');
  });

  // deleteRessource
  app.delete(longPath + '/:id', function(req, res) {
    var dbRes = db.deleteRessource(shortPath + '/' + req.params.id);
    res.send(dbRes.statusCode, '');
  });
});

console.log("Listening on port " + config.port);

app.listen(config.port);