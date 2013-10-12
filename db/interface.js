"use strict";

var REQUIRED_METHODS = [
  "getCollection", "getRessource", "createRessource",
  "updateRessource", "resetCollection", "deleteRessource"
];

function DBInterface() {
  this.exports = {};
}

DBInterface.prototype = {
  addMethod: function(name, callback) {
    this.exports[name] = callback;
  },
  export: function() {
    for (var i = 0; i < REQUIRED_METHODS.length; i++) {
      var elem = REQUIRED_METHODS[i];
      if (typeof this.exports[elem] !== "function") {
        throw "Your database connector must implement the " + elem + " method";
      }
    }
    return this.exports;
  },
  callMethod: function (name /* , arguments */) {
    if (typeof this.exports[name] !== "function") { return null; }
    var args = Array.prototype.slice.call(arguments, 1);
    return this.exports[name].apply(args);
  }
};

module.exports = DBInterface;