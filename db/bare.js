'use strict';

var DBInterface = require('./interface'),
    url = require('url'),
    fs = require('fs');

var uint = 0;

var DATABASE_PATH = '/tmp/dev_database.json';

var _interface = new DBInterface(),
    database = loadDatabase();

///////////////////////
// Utility functions //
///////////////////////

function loadDatabase() {
  // if (!fs.existsSync(DATABASE_PATH)) { return {}; }
  try { return JSON.parse(fs.readFileSync(DATABASE_PATH)); }
  catch (e) { return {}; }
}

function uid() {
  var id = Date.now().toString() + (++uint).toString();
  return parseInt(id, 10);
}

function saveDatabase() {
  fs.writeFile(DATABASE_PATH, JSON.stringify(database));
}

function isHash(obj) {
  return typeof obj === 'object' && !Array.isArray(obj);
}

function findRessource(path) {
  path = url.parse(path).pathname;
  var pathname = path.split('/'),
      collectionPath = pathname.slice(0, pathname.length - 2).join('/'),
      id = pathname.slice(pathname - 1).join(''),
      collection = database[collectionPath] || null,
      elem = null,
      i;

  if (Array.isArray(collection)) {
    for (i = 0; i < collection.length; i++) {
      elem = collection[i];
      if (elem.id === id) { break; }
    }
  }

  return {
    success: !!elem,
    collection: collection,
    ressource: elem,
    path: path,
    collectionPath: collectionPath,
    id: id,
    index: i
  };
}

/////////////////////////
// Interface functions //
/////////////////////////

_interface.addMethod('getCollection', function(path) {
  path = url.parse(path).pathname;
  if (!database[path]) { return { success: false, statusCode: 404 }; }
  return {
    success: true,
    statusCode: 200,
    data: database[path]
  };
});

_interface.addMethod('getRessource', function(path) {
  var search = findRessource(path);

  if (search.success) {
    return {
      success: true,
      statusCode: 200,
      data: search.elem
    };
  }
  else { return { success: false, statusCode: 404 }; }
});

_interface.addMethod('createRessource', function(path, data) {
  if (!isHash(data)) { return { success: false, statusCode: 400 }; }
  path = url.parse(path).pathname;

  // Create a unique id if none
  if (!data.id) { data.id = uid(); }
  // Error if ressource already exists
  else {
    if (findRessource(path + '/' + data.id).success) {
      return {
        success: false,
        statusCode: 400
      };
    }
  }

  database[path] = database[path] || [];
  database[path].push(data);
  saveDatabase();
  return { success: true, statusCode: 201, data: data };
});

_interface.addMethod('updateRessource', function(path, data) {
  path = url.parse(path).pathname;
  var search = findRessource(path);
  if (!search.success) { return { success: false, statusCode: 400 }; }
  // Force id
  data.id = search.elem.id;
  search.collection.splice(search.index, 1);
  search.collection.push(data);
  saveDatabase();
  return {
    success: true,
    statusCode: 200,
    data: data
  };
});

_interface.addMethod('resetCollection', function(path) {
  path = url.parse(path).pathname;
  // Error if collection does not exist
  if (!database[path]) { return { success: false, statusCode: 400 }; }
  database[path].length = 0;
  saveDatabase();
  return { success: true, statusCode: 200 };
});

_interface.addMethod('deleteRessource', function(path) {
  path = url.parse(path).pathname;
  var search = findRessource(path);
  if (!search.success) { return { success: false, statusCode: 400 }; }
  search.collection.splice(search.index, 1);
  saveDatabase();
  return { success: true, statusCode: 200 };
});

module.exports = _interface.export();