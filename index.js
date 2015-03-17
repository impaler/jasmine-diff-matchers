var fs       = require('fs'),
    path     = require('path'),
    isString = require('lodash.isstring');

var config     = require('./config'),
    diffExpect = require('./diffUtil');

/**
 * Get a Jasmine 2.x matcher for strings based on the given compare method
 * @param {function} compareMethod A method that takes <code>actual</code> and <code>expected</code> values
 * @returns {function} A Jasmine 2.x custom matcher
 */
function getStringCompare(compareMethod) {
    return function() {
        return {
            compare: function (actual, expected) {
                var pass;
                var message = [actual, expected]
                    .map(function (value, i) {
                        return !isString(value) && ('value "' + (i ? 'expected' : 'actual') + '" must be a string');
                    })
                    .filter(Boolean)
                    .join(', ');
                if (message) {
                    pass    = false;
                } else {
                    var posixActual   = posixLineEndings(actual);
                    var posixExpected = posixLineEndings(expected);
                    pass    = (posixActual === posixExpected);
                    message = pass ?
                        'Text is matching' :
                        ('Text does not match, please review the diff below.\n' +
                        compareMethod(posixActual, posixExpected));
                }
                return {
                    pass   : pass,
                    message: message
                };
            }
        }
    };
}

/**
 * Get a Jasmine 2.x matcher for files based on the given compare method
 * @param {function} compareMethod A method that takes <code>actual</code> and <code>expected</code> values
 * @returns {function} A Jasmine 2.x custom matcher
 */
function getFileCompare(compareMethod) {
    return function() {
        /**
         * Attempt to load the given file path
         * @param {string|Array.<string>} filePath The path to attempt load
         * @returns {string|Buffer} The file buffer on success or a string on failure
         */
        function findFile(filePath) {

            // join the string elements in the file path
            var joined  = [].concat(filePath)
                .filter(isString)
                .join(path.sep);

            // try the joined string in the cwd, then try the config base path
            var usePath  = [
                    joined,
                    [__dirname, config.basePath, joined]
                ]
                .map(function resolve(elements) {
                    return path.resolve.apply(path, [].concat(elements));
                })
                .filter(fs.existsSync)
                .shift();

            // load the file as a buffer or instead give an error message
            if (usePath) {
                return fs.readFileSync(usePath);
            } else {
                return ['file does not exist', joined, '(tried to used the config.basePath', config.basePath,
                    'with no success)'].join(' ');
            }
        }

        /**
         * Match first occurrence of the item in an array
         */
        function isFirstOccurrence(value, i, array) {
            return (array.indexOf(value) === i);
        }

        return {
            compare: function (actual, expected) {
                var foundActual   = findFile(actual),
                    foundExpected = findFile(expected);
                var pass;
                var message = [foundActual, foundExpected]
                    .filter(isString)
                    .filter(isFirstOccurrence)
                    .join(', ');
                if (message) {
                    pass    = false;
                } else {
                    var posixActual   = posixLineEndings(foundActual);
                    var posixExpected = posixLineEndings(foundExpected);
                    pass    = (posixActual === posixExpected);
                    message = pass ?
                        'Files are matching' :
                        ('Files do not match, please review the diff below.\n' +
                        compareMethod(posixActual, posixExpected));
                }
                return {
                    pass   : pass,
                    message: message
                };
            }
        }
    };
}

/**
 * Change windows style line endings to posix style
 * @param {string|Buffer} candide The text of buffer to convert
 * @returns {string} The converted text
 */
function posixLineEndings(candidate) {
    return candidate.toString().replace(/\r?\n/g, '\n');
}

module.exports = {
    diffChars: {
        diffChars    : getStringCompare(diffExpect.diffChars),
        diffFileChars: getFileCompare(diffExpect.diffChars)
    },
    diffLines: {
        diffLines    : getStringCompare(diffExpect.diffLines),
        diffFileLines: getFileCompare(diffExpect.diffLines)
    },
    diffPatch: {
        diffPatch    : getStringCompare(diffExpect.diffPatch),
        diffFilePatch: getFileCompare(diffExpect.diffPatch)
    }
};
