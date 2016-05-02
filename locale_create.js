'use strict';

let langFile = require(process.argv[2]);
let keyToSearch = process.argv[3];
let valToAdd = process.argv[4];

let DOT_SEPARATOR = ".";
let _ = require('lodash');

let addKeysToObject = function (object, keys, options) {
  let keysToAdd;

  // deep copy by default
  let isDeep = true;

  // to preserve backwards compatibility, assume that only explicit options means shallow copy
  if (_.isUndefined(options) == false) {
    if (_.isBoolean(options.copy)) {
      isDeep = options.copy;
    }
  }

  // do not modify original object if copy is true (default)
  let finalObject;
  if (isDeep) {
    finalObject = _.clone(object, isDeep);
  } else {
    finalObject = object;
  }

  if (typeof finalObject === 'undefined') {
    throw new Error('undefined is not a valid object.');
  }
  if (arguments.length < 2) {
    throw new Error("provide at least two parameters: object and list of keys");
  }

  // collect keys
  if (Array.isArray(keys)) {
    keysToAdd = keys;
  } else {
    keysToAdd = [keys];
  }

  keysToAdd.forEach(function(elem) {
    for(let prop in finalObject) {
      if(finalObject.hasOwnProperty(prop)) {
        if (elem === prop) {
            if (valToAdd === undefined) {
                finalObject[prop] = {};
            } else {
                // simple key to add
                finalObject[prop] = valToAdd;
            }
        } else if (elem.indexOf(DOT_SEPARATOR) != -1) {
          let parts = elem.split(DOT_SEPARATOR);
          let pathWithoutLastEl;

          let lastAttribute;

          if (parts && parts.length === 2) {

            lastAttribute = parts[1];
            pathWithoutLastEl = parts[0];
            let nestedObjectRef = finalObject[pathWithoutLastEl];
            if (nestedObjectRef) {
                if (valToAdd === undefined) {
                    nestedObjectRef[lastAttribute] = {};
                } else {
                    nestedObjectRef[lastAttribute] = valToAdd;
                }
            }
          } else if (parts && parts.length === 3) {
            // last attribute is the last part of the parts
            lastAttribute = parts[2];
            let deepestRef = (finalObject[parts[0]])[parts[1]];
            if (valToAdd === undefined) {
                deepestRef[lastAttribute] = {};
            } else {
                deepestRef[lastAttribute] = valToAdd;
            }
        } else if (parts && parts.length === 4) {
            // last attribute is the last part of the parts
            lastAttribute = parts[3];
            let deepestRef = (finalObject[parts[0]])[parts[1]][parts[2]];
            if (valToAdd === undefined) {
                deepestRef[lastAttribute] = {};
            } else {
                deepestRef[lastAttribute] = valToAdd;
            }
        } else if (parts && parts.length === 5) {
            lastAttribute = parts[4];
            let deepestRef = (finalObject[parts[0]])[parts[1]][parts[2]][parts[3]];
            if (valToAdd === undefined) {
                deepestRef[lastAttribute] = {};
            } else {
                deepestRef[lastAttribute] = valToAdd;
            }
        } else {
            throw new Error("Nested level " + parts.length + " is not supported yet");
        }

        } else {
          if (_.isObject(finalObject[prop]) && !_.isArray(finalObject[prop])) {

            finalObject[prop] = addKeysToObject(finalObject[prop], keysToAdd, options);
          }
        }
      }

    }
  });

  return finalObject;

};

if (keyToSearch != null) {
    let result = addKeysToObject(langFile, [keyToSearch])

    let fs = require('fs');
    fs.writeFile(process.argv[2], JSON.stringify(result, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
    });
} else {
    console.log("Key cannot be null in this script.")
}
